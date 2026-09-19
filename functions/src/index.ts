import {setGlobalOptions} from "firebase-functions/v2";
import {
  onDocumentCreated,
  onDocumentDeleted,
} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";

import {initializeApp} from "firebase-admin/app";
import {
  FieldValue,
  getFirestore,
} from "firebase-admin/firestore";

initializeApp();

setGlobalOptions({
  maxInstances: 10,
});

const db = getFirestore();

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

type ActivityData = {
  scopeType?: string;
  scopeId?: string;
  plannedItemId?: string;
};

type CollegePlanItem = {
  id: string;
  status?: string;
  activityId?: string;
  [key: string]: unknown;
};

type CollegePlanData = {
  collegeId?: string;
  items?: CollegePlanItem[];
};

/*
 * =========================================================
 * LINK ACTIVITY TO SCHOOL PLAN
 * =========================================================
 *
 * Runs automatically when a new Activity is created.
 *
 * If the Activity:
 * - belongs to a School
 * - contains a plannedItemId
 *
 * the trusted backend:
 * - finds the School Plan
 * - finds the selected Plan Item
 * - links the Activity
 * - changes the Plan Item status to completed
 *
 * Dashboard users do NOT need write access
 * to collegePlans for this operation.
 */

export const linkActivityToSchoolPlan =
  onDocumentCreated(
    "activities/{activityId}",
    async (event) => {
      const snapshot = event.data;

      if (!snapshot) {
        return;
      }

      const activity =
        snapshot.data() as ActivityData;

      const activityId =
        event.params.activityId;

      /*
       * Only School Activities can be
       * connected to a School Plan.
       */
      if (
        activity.scopeType !== "college"
      ) {
        return;
      }

      const scopeId =
        activity.scopeId;

      const plannedItemId =
        activity.plannedItemId;

      /*
       * Activity was created without
       * selecting a planned activity.
       */
      if (
        !scopeId ||
        !plannedItemId
      ) {
        return;
      }

      const planRef =
        db
          .collection("collegePlans")
          .doc(scopeId);

      try {
        await db.runTransaction(
          async (transaction) => {
            const planSnapshot =
              await transaction.get(
                planRef
              );

            if (
              !planSnapshot.exists
            ) {
              logger.warn(
                "School Plan was not found while linking Activity.",
                {
                  activityId,
                  scopeId,
                  plannedItemId,
                }
              );

              return;
            }

            const plan =
              planSnapshot.data() as
                | CollegePlanData
                | undefined;

            if (
              !plan ||
              !Array.isArray(plan.items)
            ) {
              logger.warn(
                "School Plan does not contain a valid items array.",
                {
                  activityId,
                  scopeId,
                  plannedItemId,
                }
              );

              return;
            }

            /*
             * Extra consistency check.
             *
             * If collegeId exists inside
             * the document, it must match
             * the document/scope ID.
             */
            if (
              plan.collegeId &&
              plan.collegeId !== scopeId
            ) {
              logger.error(
                "School Plan collegeId does not match Activity scopeId.",
                {
                  activityId,
                  scopeId,
                  planCollegeId:
                    plan.collegeId,
                }
              );

              return;
            }

            const plannedItem =
              plan.items.find(
                (item) =>
                  item.id ===
                  plannedItemId
              );

            if (
              !plannedItem
            ) {
              logger.warn(
                "Planned Activity was not found in School Plan.",
                {
                  activityId,
                  scopeId,
                  plannedItemId,
                }
              );

              return;
            }

            /*
             * Prevent linking one Plan Item
             * to two different Activities.
             */
            if (
              plannedItem.activityId &&
              plannedItem.activityId !==
                activityId
            ) {
              logger.warn(
                "Planned Activity is already linked to another Activity.",
                {
                  activityId,
                  scopeId,
                  plannedItemId,
                  existingActivityId:
                    plannedItem.activityId,
                }
              );

              return;
            }

            /*
             * Idempotency:
             *
             * If this exact Activity is
             * already linked, there is
             * nothing else to do.
             */
            if (
              plannedItem.activityId ===
                activityId &&
              plannedItem.status ===
                "completed"
            ) {
              return;
            }

            const updatedItems =
              plan.items.map(
                (item) => {
                  if (
                    item.id !==
                    plannedItemId
                  ) {
                    return item;
                  }

                  return {
                    ...item,

                    activityId,

                    /*
                     * completed means:
                     * the planned activity
                     * was carried out and
                     * an Activity was uploaded.
                     *
                     * This is independent
                     * from approval status.
                     */
                    status:
                      "completed",
                  };
                }
              );

            transaction.update(
              planRef,
              {
                items:
                  updatedItems,

                updatedAt:
                  FieldValue.serverTimestamp(),
              }
            );
          }
        );

        logger.info(
          "Activity School Plan linking process completed.",
          {
            activityId,
            scopeId,
            plannedItemId,
          }
        );
      } catch (error) {
        logger.error(
          "Failed to link Activity to School Plan.",
          {
            activityId,
            scopeId,
            plannedItemId,
            error,
          }
        );

        throw error;
      }
    }
  );

/*
 * =========================================================
 * UNLINK DELETED ACTIVITY FROM SCHOOL PLAN
 * =========================================================
 *
 * Runs automatically when an Activity is deleted.
 *
 * If the deleted Activity was linked
 * to a School Plan Item:
 *
 * - remove activityId
 * - return status to planned
 *
 * This also happens from trusted backend code.
 */

export const unlinkDeletedActivityFromSchoolPlan =
  onDocumentDeleted(
    "activities/{activityId}",
    async (event) => {
      const snapshot = event.data;

      if (!snapshot) {
        return;
      }

      const activity =
        snapshot.data() as ActivityData;

      const activityId =
        event.params.activityId;

      if (
        activity.scopeType !== "college"
      ) {
        return;
      }

      const scopeId =
        activity.scopeId;

      const plannedItemId =
        activity.plannedItemId;

      if (
        !scopeId ||
        !plannedItemId
      ) {
        return;
      }

      const planRef =
        db
          .collection("collegePlans")
          .doc(scopeId);

      try {
        await db.runTransaction(
          async (transaction) => {
            const planSnapshot =
              await transaction.get(
                planRef
              );

            /*
             * Activity can still be deleted
             * even if its old School Plan
             * no longer exists.
             */
            if (
              !planSnapshot.exists
            ) {
              return;
            }

            const plan =
              planSnapshot.data() as
                | CollegePlanData
                | undefined;

            if (
              !plan ||
              !Array.isArray(plan.items)
            ) {
              return;
            }

            const plannedItem =
              plan.items.find(
                (item) =>
                  item.id ===
                  plannedItemId
              );

            if (
              !plannedItem
            ) {
              return;
            }

            /*
             * Only unlink if this Plan Item
             * actually belongs to the
             * Activity that was deleted.
             */
            if (
              plannedItem.activityId !==
              activityId
            ) {
              return;
            }

            const updatedItems =
              plan.items.map(
                (item) => {
                  if (
                    item.id !==
                    plannedItemId
                  ) {
                    return item;
                  }

                  /*
                   * Remove activityId instead
                   * of storing undefined.
                   */
                  const {
                    activityId:
                      _activityId,
                    ...itemWithoutActivity
                  } = item;

                  return {
                    ...itemWithoutActivity,

                    status:
                      "planned",
                  };
                }
              );

            transaction.update(
              planRef,
              {
                items:
                  updatedItems,

                updatedAt:
                  FieldValue.serverTimestamp(),
              }
            );
          }
        );

        logger.info(
          "Deleted Activity was unlinked from School Plan.",
          {
            activityId,
            scopeId,
            plannedItemId,
          }
        );
      } catch (error) {
        logger.error(
          "Failed to unlink deleted Activity from School Plan.",
          {
            activityId,
            scopeId,
            plannedItemId,
            error,
          }
        );

        throw error;
      }
    }
  );
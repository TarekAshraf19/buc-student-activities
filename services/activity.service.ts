import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import {
  db,
} from "@/lib/firebase";

import type {
  Activity,
  ActivityScopeType,
  StudentClubCategory,
} from "@/types/activity";

/*
 * =========================================================
 * TYPES
 * =========================================================
 */

/*
 * status / review information is never supplied
 * by the Add Activity form.
 *
 * Every new Activity starts as pending.
 */
export type CreateActivityData =
  Omit<
    Activity,
    | "id"
    | "status"
    | "reviewedBy"
    | "reviewedAt"
    | "declineReason"
    | "plannedItemId"
  >;

/*
 * Dean editing is limited to Activity content.
 *
 * These fields cannot be edited here:
 * - id
 * - status
 * - reviewedBy
 * - reviewedAt
 * - declineReason
 * - createdBy
 * - scopeType
 * - scopeId
 * - plannedItemId
 */
export type UpdateActivityData =
  Partial<
    Pick<
      Activity,
      | "title"
      | "description"
      | "category"
      | "date"
      | "image"
      | "subcategoryId"
    >
  >;

const activitiesCollection =
  collection(
    db,
    "activities"
  );

/*
 * =========================================================
 * HELPERS
 * =========================================================
 */

function mapActivity(
  documentSnapshot: {
    id: string;
    data: () => unknown;
  }
): Activity {
  return {
    id:
      documentSnapshot.id,

    ...(documentSnapshot.data() as Omit<
      Activity,
      "id"
    >),
  };
}

/*
 * =========================================================
 * PUBLIC QUERIES
 * =========================================================
 *
 * Public website must only receive approved Activities.
 */

/*
 * Get all approved Activities.
 */
export async function getActivities(): Promise<
  Activity[]
> {
  const activitiesQuery =
    query(
      activitiesCollection,

      where(
        "status",
        "==",
        "approved"
      )
    );

  const snapshot =
    await getDocs(
      activitiesQuery
    );

  return snapshot.docs.map(
    mapActivity
  );
}

/*
 * Get one Activity for the Public Website.
 *
 * Pending and declined Activities
 * must never be displayed publicly.
 */
export async function getActivityById(
  activityId: string
): Promise<Activity | null> {
  const activityRef =
    doc(
      db,
      "activities",
      activityId
    );

  const snapshot =
    await getDoc(
      activityRef
    );

  if (
    !snapshot.exists()
  ) {
    return null;
  }

  const activity = {
    id:
      snapshot.id,

    ...snapshot.data(),
  } as Activity;

  if (
    activity.status !==
    "approved"
  ) {
    return null;
  }

  return activity;
}

/*
 * Get School name for Activity cards/details.
 */
export async function getCollegeNameById(
  collegeId: string
): Promise<{
  en: string;
  ar: string;
} | null> {
  if (
    !collegeId
  ) {
    return null;
  }

  const collegeRef =
    doc(
      db,
      "colleges",
      collegeId
    );

  const snapshot =
    await getDoc(
      collegeRef
    );

  if (
    !snapshot.exists()
  ) {
    return null;
  }

  const data =
    snapshot.data();

  if (
    !data.name
  ) {
    return null;
  }

  return data.name as {
    en: string;
    ar: string;
  };
}

/*
 * Public Activities by scope.
 *
 * Example:
 * college / student-club / local-regional.
 */
export async function getActivitiesByScope(
  scopeType: ActivityScopeType
): Promise<Activity[]> {
  const activitiesQuery =
    query(
      activitiesCollection,

      where(
        "scopeType",
        "==",
        scopeType
      ),

      where(
        "status",
        "==",
        "approved"
      )
    );

  const snapshot =
    await getDocs(
      activitiesQuery
    );

  return snapshot.docs.map(
    mapActivity
  );
}

/*
 * Public Activities for one specific entity.
 *
 * Example:
 * School of Business.
 */
export async function getActivitiesByScopeId(
  scopeType: ActivityScopeType,
  scopeId: string
): Promise<Activity[]> {
  const activitiesQuery =
    query(
      activitiesCollection,

      where(
        "scopeType",
        "==",
        scopeType
      ),

      where(
        "scopeId",
        "==",
        scopeId
      ),

      where(
        "status",
        "==",
        "approved"
      )
    );

  const snapshot =
    await getDocs(
      activitiesQuery
    );

  return snapshot.docs.map(
    mapActivity
  );
}

/*
 * Public Student Activities
 * filtered by category.
 */
export async function getStudentClubActivitiesByCategory(
  category: StudentClubCategory
): Promise<Activity[]> {
  const activitiesQuery =
    query(
      activitiesCollection,

      where(
        "scopeType",
        "==",
        "student-club"
      ),

      where(
        "subcategoryId",
        "==",
        category
      ),

      where(
        "status",
        "==",
        "approved"
      )
    );

  const snapshot =
    await getDocs(
      activitiesQuery
    );

  return snapshot.docs.map(
    mapActivity
  );
}

/*
 * =========================================================
 * DASHBOARD QUERIES
 * =========================================================
 *
 * Dashboard users need to see all statuses:
 *
 * pending
 * approved
 * declined
 *
 * Firestore Security Rules enforce
 * that the user can only read their own scope.
 */

/*
 * Get all Activities for the current
 * Dashboard user's scope.
 */
export async function getDashboardActivitiesByScopeId(
  scopeType: ActivityScopeType,
  scopeId: string
): Promise<Activity[]> {
  const activitiesQuery =
    query(
      activitiesCollection,

      where(
        "scopeType",
        "==",
        scopeType
      ),

      where(
        "scopeId",
        "==",
        scopeId
      )
    );

  const snapshot =
    await getDocs(
      activitiesQuery
    );

  return snapshot.docs.map(
    mapActivity
  );
}

/*
 * Get one Activity inside Dashboard.
 *
 * No status filter here because
 * Dashboard needs pending/approved/declined.
 *
 * Firestore Rules enforce scope access.
 */
export async function getDashboardActivityById(
  activityId: string
): Promise<Activity | null> {
  const activityRef =
    doc(
      db,
      "activities",
      activityId
    );

  const snapshot =
    await getDoc(
      activityRef
    );

  if (
    !snapshot.exists()
  ) {
    return null;
  }

  return {
    id:
      snapshot.id,

    ...snapshot.data(),
  } as Activity;
}

/*
 * =========================================================
 * CREATE ACTIVITY
 * =========================================================
 *
 * Uploader and Dean can create Activities.
 *
 * Every new Activity:
 *
 * status = pending
 *
 * IMPORTANT:
 *
 * The client NEVER writes to collegePlans here.
 *
 * If plannedItemId exists, it is stored
 * on the Activity document only.
 *
 * A trusted backend function will later
 * perform the School Plan linking.
 */

export async function createActivity(
  data: CreateActivityData,
  plannedItemId?: string
): Promise<string> {
  const cleanedPlannedItemId =
    plannedItemId?.trim();

  const activityData = {
    ...data,

    status:
      "pending" as const,

    ...(
      data.scopeType ===
        "college" &&
      cleanedPlannedItemId
        ? {
            plannedItemId:
              cleanedPlannedItemId,
          }
        : {}
    ),
  };

  const documentRef =
    await addDoc(
      activitiesCollection,
      activityData
    );

  return documentRef.id;
}

/*
 * =========================================================
 * EDIT ACTIVITY
 * =========================================================
 *
 * Dean only.
 *
 * Firestore Security Rules enforce:
 * - role == dean
 * - same scope
 *
 * This service intentionally exposes
 * only editable Activity content fields.
 */

export async function updateActivity(
  activityId: string,
  data: UpdateActivityData
): Promise<void> {
  const activityRef =
    doc(
      db,
      "activities",
      activityId
    );

  await updateDoc(
    activityRef,
    data
  );
}

/*
 * =========================================================
 * APPROVE ACTIVITY
 * =========================================================
 *
 * Dean only.
 *
 * Firestore Rules enforce:
 * - role == dean
 * - same scope
 * - reviewedBy == request.auth.uid
 */

export async function approveActivity(
  activityId: string,
  reviewerId: string
): Promise<void> {
  const activityRef =
    doc(
      db,
      "activities",
      activityId
    );

  await updateDoc(
    activityRef,
    {
      status:
        "approved",

      reviewedBy:
        reviewerId,

      reviewedAt:
        serverTimestamp(),

      /*
       * Remove an old decline reason
       * if a previously declined Activity
       * is later approved.
       */
      declineReason:
        deleteField(),
    }
  );
}

/*
 * =========================================================
 * DECLINE ACTIVITY
 * =========================================================
 *
 * Dean only.
 */

export async function declineActivity(
  activityId: string,
  reviewerId: string,
  declineReason: string
): Promise<void> {
  const reason =
    declineReason.trim();

  if (
    !reason
  ) {
    throw new Error(
      "DECLINE_REASON_REQUIRED"
    );
  }

  const activityRef =
    doc(
      db,
      "activities",
      activityId
    );

  await updateDoc(
    activityRef,
    {
      status:
        "declined",

      reviewedBy:
        reviewerId,

      reviewedAt:
        serverTimestamp(),

      declineReason:
        reason,
    }
  );
}

/*
 * =========================================================
 * DELETE ACTIVITY
 * =========================================================
 *
 * Dean only.
 *
 * IMPORTANT:
 *
 * The client deletes only the Activity.
 *
 * If the Activity is linked to a School Plan,
 * unlinking/resetting the Plan Item must be
 * handled by trusted backend code.
 *
 * The client never receives permission
 * to modify collegePlans as part of deletion.
 */

export async function deleteActivity(
  activityId: string
): Promise<void> {
  const activityRef =
    doc(
      db,
      "activities",
      activityId
    );

  await deleteDoc(
    activityRef
  );
}
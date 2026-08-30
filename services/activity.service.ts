import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type {
  Activity,
  ActivityScopeType,
  StudentClubCategory,
} from "@/types/activity";

import type {
  CollegePlan,
  CollegePlanItem,
} from "@/types/college-plan";

export type CreateActivityData =
  Omit<Activity, "id">;

export type UpdateActivityData =
  Partial<Omit<Activity, "id">>;

const activitiesCollection =
  collection(db, "activities");

export async function getActivities(): Promise<
  Activity[]
> {
  const snapshot =
    await getDocs(
      activitiesCollection
    );

  return snapshot.docs.map(
    (document) => ({
      id: document.id,
      ...document.data(),
    })
  ) as Activity[];
}

export async function getActivityById(
  activityId: string
): Promise<Activity | null> {
  const activityRef = doc(
    db,
    "activities",
    activityId
  );

  const snapshot =
    await getDoc(
      activityRef
    );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Activity;
}

/*
 * بنجيب اسم الكلية من scopeId
 * عشان نعرضه في Activity Card
 * و Activity Details.
 */
export async function getCollegeNameById(
  collegeId: string
): Promise<{
  en: string;
  ar: string;
} | null> {
  if (!collegeId) {
    return null;
  }

  const collegeRef = doc(
    db,
    "colleges",
    collegeId
  );

  const snapshot =
    await getDoc(
      collegeRef
    );

  if (!snapshot.exists()) {
    return null;
  }

  const data =
    snapshot.data();

  if (!data.name) {
    return null;
  }

  return data.name as {
    en: string;
    ar: string;
  };
}

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
      )
    );

  const snapshot =
    await getDocs(
      activitiesQuery
    );

  return snapshot.docs.map(
    (document) => ({
      id: document.id,
      ...document.data(),
    })
  ) as Activity[];
}

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
      )
    );

  const snapshot =
    await getDocs(
      activitiesQuery
    );

  return snapshot.docs.map(
    (document) => ({
      id: document.id,
      ...document.data(),
    })
  ) as Activity[];
}

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
      )
    );

  const snapshot =
    await getDocs(
      activitiesQuery
    );

  return snapshot.docs.map(
    (document) => ({
      id: document.id,
      ...document.data(),
    })
  ) as Activity[];
}

export async function createActivity(
  data: CreateActivityData,
  plannedItemId?: string
): Promise<string> {
  /*
   * أي نشاط غير College
   * أو College activity غير مرتبط بالخطة.
   */
  if (
    data.scopeType !== "college" ||
    !plannedItemId
  ) {
    const documentRef =
      await addDoc(
        activitiesCollection,
        data
      );

    return documentRef.id;
  }

  /*
   * College activity مرتبط بـ
   * planned item.
   *
   * إنشاء النشاط + ربطه بالخطة
   * بيحصلوا في transaction واحدة.
   */
  const activityRef =
    doc(
      activitiesCollection
    );

  const planRef = doc(
    db,
    "collegePlans",
    data.scopeId
  );

  await runTransaction(
    db,
    async (transaction) => {
      const planSnapshot =
        await transaction.get(
          planRef
        );

      if (
        !planSnapshot.exists()
      ) {
        throw new Error(
          "COLLEGE_PLAN_NOT_FOUND"
        );
      }

      const plan = {
        id: planSnapshot.id,
        ...planSnapshot.data(),
      } as CollegePlan;

      const plannedItem =
        plan.items.find(
          (
            item: CollegePlanItem
          ) =>
            item.id ===
            plannedItemId
        );

      if (!plannedItem) {
        throw new Error(
          "PLANNED_ACTIVITY_NOT_FOUND"
        );
      }

      if (
        plannedItem.activityId
      ) {
        throw new Error(
          "PLANNED_ACTIVITY_ALREADY_LINKED"
        );
      }

      const updatedItems:
        CollegePlanItem[] =
        plan.items.map(
          (
            item: CollegePlanItem
          ) => {
            if (
              item.id !==
              plannedItemId
            ) {
              return item;
            }

            return {
              ...item,
              activityId:
                activityRef.id,
              status:
                "completed",
            };
          }
        );

      transaction.set(
        activityRef,
        data
      );

      transaction.update(
        planRef,
        {
          items:
            updatedItems,
          updatedAt:
            serverTimestamp(),
        }
      );
    }
  );

  return activityRef.id;
}

export async function updateActivity(
  activityId: string,
  data: UpdateActivityData
): Promise<void> {
  const activityRef = doc(
    db,
    "activities",
    activityId
  );

  await updateDoc(
    activityRef,
    data
  );
}

export async function deleteActivity(
  activityId: string
): Promise<void> {
  const activityRef = doc(
    db,
    "activities",
    activityId
  );

  await runTransaction(
    db,
    async (transaction) => {
      /*
       * الأول نجيب النشاط عشان نعرف
       * هل هو College activity ولا لأ.
       */
      const activitySnapshot =
        await transaction.get(
          activityRef
        );

      if (
        !activitySnapshot.exists()
      ) {
        return;
      }

      const activity = {
        id: activitySnapshot.id,
        ...activitySnapshot.data(),
      } as Activity;

      /*
       * الأنشطة غير التابعة لكلية
       * مالهاش College Plan.
       */
      if (
        activity.scopeType !==
        "college"
      ) {
        transaction.delete(
          activityRef
        );

        return;
      }

      const planRef = doc(
        db,
        "collegePlans",
        activity.scopeId
      );

      const planSnapshot =
        await transaction.get(
          planRef
        );

      /*
       * لو مفيش structured plan،
       * نحذف النشاط عادي.
       */
      if (
        !planSnapshot.exists()
      ) {
        transaction.delete(
          activityRef
        );

        return;
      }

      const plan = {
        id: planSnapshot.id,
        ...planSnapshot.data(),
      } as CollegePlan;

      let linkFound = false;

      const updatedItems:
        CollegePlanItem[] =
        plan.items.map(
          (
            item: CollegePlanItem
          ) => {
            if (
              item.activityId !==
              activityId
            ) {
              return item;
            }

            linkFound = true;

            /*
             * بنشيل activityId تمامًا
             * بدل ما نحطه undefined.
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

      /*
       * لو النشاط كان مربوط ببند
       * في الخطة، نفك الربط.
       */
      if (linkFound) {
        transaction.update(
          planRef,
          {
            items:
              updatedItems,
            updatedAt:
              serverTimestamp(),
          }
        );
      }

      /*
       * وفي نفس transaction نحذف
       * النشاط نفسه.
       */
      transaction.delete(
        activityRef
      );
    }
  );
}
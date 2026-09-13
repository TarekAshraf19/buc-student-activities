import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type {
  CollegePlan,
  CollegePlanHistory,
  CollegePlanInput,
} from "@/types/college-plan";

const COLLECTION_NAME =
  "collegePlans";

const HISTORY_COLLECTION_NAME =
  "collegePlanHistory";

export async function getStructuredCollegePlan(
  collegeId: string
): Promise<CollegePlan | null> {
  const planRef = doc(
    db,
    COLLECTION_NAME,
    collegeId
  );

  const snapshot =
    await getDoc(planRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as CollegePlan;
}

export async function getCollegePlanHistory(
  collegeId: string
): Promise<CollegePlanHistory[]> {
  const historyQuery = query(
    collection(
      db,
      HISTORY_COLLECTION_NAME
    ),
    where(
      "collegeId",
      "==",
      collegeId
    ),
    orderBy(
      "archivedAt",
      "desc"
    )
  );

  const snapshot =
    await getDocs(historyQuery);

  return snapshot.docs.map(
    (historyDoc) => ({
      id: historyDoc.id,
      ...historyDoc.data(),
    } as CollegePlanHistory)
  );
}

export async function saveStructuredCollegePlan(
  input: CollegePlanInput,
  previousPlanName = "",
  previousPlanUrl = ""
) {
  const planRef = doc(
    db,
    COLLECTION_NAME,
    input.collegeId
  );

  const snapshot =
    await getDoc(planRef);

  if (!snapshot.exists()) {
    await setDoc(planRef, {
      collegeId:
        input.collegeId,

      academicYear:
        input.academicYear,

      semester:
        input.semester,

      items:
        input.items,

      createdAt:
        serverTimestamp(),

      updatedAt:
        serverTimestamp(),
    });

    return;
  }

  const currentPlan =
    snapshot.data();

  const isNewPeriod =
    currentPlan.academicYear !==
      input.academicYear ||
    currentPlan.semester !==
      input.semester;

  if (!isNewPeriod) {
    await updateDoc(
      planRef,
      {
        academicYear:
          input.academicYear,

        semester:
          input.semester,

        items:
          input.items,

        updatedAt:
          serverTimestamp(),
      }
    );

    return;
  }

  const historyRef = doc(
    collection(
      db,
      HISTORY_COLLECTION_NAME
    )
  );

  await runTransaction(
    db,
    async (transaction) => {
      const latestSnapshot =
        await transaction.get(
          planRef
        );

      if (!latestSnapshot.exists()) {
        transaction.set(
          planRef,
          {
            collegeId:
              input.collegeId,

            academicYear:
              input.academicYear,

            semester:
              input.semester,

            items:
              input.items,

            createdAt:
              serverTimestamp(),

            updatedAt:
              serverTimestamp(),
          }
        );

        return;
      }

      const latestPlan =
        latestSnapshot.data();

      const shouldArchive =
        latestPlan.academicYear !==
          input.academicYear ||
        latestPlan.semester !==
          input.semester;

      if (!shouldArchive) {
        transaction.update(
          planRef,
          {
            academicYear:
              input.academicYear,

            semester:
              input.semester,

            items:
              input.items,

            updatedAt:
              serverTimestamp(),
          }
        );

        return;
      }

      transaction.set(
        historyRef,
        {
          collegeId:
            latestPlan.collegeId ??
            input.collegeId,

          planName:
            previousPlanName,

          planUrl:
            previousPlanUrl,

          academicYear:
            latestPlan.academicYear,

          semester:
            latestPlan.semester,

          items:
            latestPlan.items ?? [],

          createdAt:
            latestPlan.createdAt ??
            serverTimestamp(),

          updatedAt:
            latestPlan.updatedAt ??
            serverTimestamp(),

          archivedAt:
            serverTimestamp(),
        }
      );

      transaction.set(
        planRef,
        {
          collegeId:
            input.collegeId,

          academicYear:
            input.academicYear,

          semester:
            input.semester,

          items:
            input.items,

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp(),
        }
      );
    }
  );
}

export async function deleteStructuredCollegePlan(
  collegeId: string
) {
  const planRef = doc(
    db,
    COLLECTION_NAME,
    collegeId
  );

  await deleteDoc(planRef);
}
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type {
  CollegePlan,
  CollegePlanInput,
} from "@/types/college-plan";

const COLLECTION_NAME = "collegePlans";

export async function getStructuredCollegePlan(
  collegeId: string
): Promise<CollegePlan | null> {
  const planRef = doc(
    db,
    COLLECTION_NAME,
    collegeId
  );

  const snapshot = await getDoc(planRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as CollegePlan;
}

export async function saveStructuredCollegePlan(
  input: CollegePlanInput
) {
  const planRef = doc(
    db,
    COLLECTION_NAME,
    input.collegeId
  );

  const snapshot = await getDoc(planRef);

  if (snapshot.exists()) {
    await updateDoc(planRef, {
      academicYear: input.academicYear,
      semester: input.semester,
      items: input.items,
      updatedAt: serverTimestamp(),
    });

    return;
  }

  await setDoc(planRef, {
    collegeId: input.collegeId,
    academicYear: input.academicYear,
    semester: input.semester,
    items: input.items,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
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
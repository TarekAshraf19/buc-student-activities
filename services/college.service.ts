import {
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type { College } from "@/types/college";

export async function getColleges(): Promise<College[]> {
  const querySnapshot = await getDocs(
    collection(db, "colleges")
  );

  return querySnapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  })) as College[];
}

export async function getCollegeById(
  collegeId: string
): Promise<College | null> {
  const collegeRef = doc(
    db,
    "colleges",
    collegeId
  );

  const collegeSnapshot =
    await getDoc(collegeRef);

  if (!collegeSnapshot.exists()) {
    return null;
  }

  return {
    id: collegeSnapshot.id,
    ...collegeSnapshot.data(),
  } as College;
}

export async function getCollegeByUserId(
  userId: string
): Promise<College | null> {
  const collegesQuery = query(
    collection(db, "colleges"),
    where("userId", "==", userId)
  );

  const querySnapshot =
    await getDocs(collegesQuery);

  if (querySnapshot.empty) {
    return null;
  }

  const collegeDocument =
    querySnapshot.docs[0];

  return {
    id: collegeDocument.id,
    ...collegeDocument.data(),
  } as College;
}

export async function updateCollegePlan(
  collegeId: string,
  planName: string,
  planUrl: string
): Promise<void> {
  const collegeRef = doc(
    db,
    "colleges",
    collegeId
  );

  await updateDoc(
    collegeRef,
    {
      planName,
      planUrl,
    }
  );
}

export async function deleteCollegePlan(
  collegeId: string
): Promise<void> {
  const collegeRef = doc(
    db,
    "colleges",
    collegeId
  );

  await updateDoc(
    collegeRef,
    {
      planName: deleteField(),
      planUrl: deleteField(),
    }
  );
}
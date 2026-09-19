import {
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import {
  db,
} from "@/lib/firebase";

import type {
  College,
} from "@/types/college";

/*
 * =========================================================
 * GET ALL SCHOOLS
 * =========================================================
 */

export async function getColleges(): Promise<College[]> {
  const querySnapshot =
    await getDocs(
      collection(
        db,
        "colleges"
      )
    );

  return querySnapshot.docs.map(
    (document) => ({
      id: document.id,
      ...document.data(),
    })
  ) as College[];
}

/*
 * =========================================================
 * GET SCHOOL BY ID
 * =========================================================
 *
 * Dashboard users are linked to their School through:
 *
 * dashboardUsers/{uid}.scopeId
 *
 * The scopeId is the School document ID.
 */

export async function getCollegeById(
  collegeId: string
): Promise<College | null> {
  const collegeRef =
    doc(
      db,
      "colleges",
      collegeId
    );

  const collegeSnapshot =
    await getDoc(
      collegeRef
    );

  if (
    !collegeSnapshot.exists()
  ) {
    return null;
  }

  return {
    id:
      collegeSnapshot.id,

    ...collegeSnapshot.data(),
  } as College;
}

/*
 * =========================================================
 * UPDATE SCHOOL PLAN FILE
 * =========================================================
 */

export async function updateCollegePlan(
  collegeId: string,
  planName: string,
  planUrl: string
): Promise<void> {
  const collegeRef =
    doc(
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

/*
 * =========================================================
 * DELETE SCHOOL PLAN FILE
 * =========================================================
 */

export async function deleteCollegePlan(
  collegeId: string
): Promise<void> {
  const collegeRef =
    doc(
      db,
      "colleges",
      collegeId
    );

  await updateDoc(
    collegeRef,
    {
      planName:
        deleteField(),

      planUrl:
        deleteField(),
    }
  );
}
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type {
  ActivityScopeType,
  LocalizedText,
} from "@/types/activity";

export type CurrentEntity = {
  scopeType: ActivityScopeType;
  scopeId: string;
  name: LocalizedText;
  active?: boolean;
};

type EntityDocumentData = {
  userId?: string;
  active?: boolean;

  name?: {
    en?: string;
    ar?: string;
  };

  title?: {
    en?: string;
    ar?: string;
  };
};

function getEntityName(
  data: EntityDocumentData
): LocalizedText {
  return {
    en:
      data.name?.en ??
      data.title?.en ??
      "",

    ar:
      data.name?.ar ??
      data.title?.ar ??
      "",
  };
}

async function findUserInCollection(
  collectionName: string,
  userId: string,
  scopeType: ActivityScopeType
): Promise<CurrentEntity | null> {
  const entitiesQuery =
    query(
      collection(
        db,
        collectionName
      ),
      where(
        "userId",
        "==",
        userId
      )
    );

  const snapshot =
    await getDocs(
      entitiesQuery
    );

  if (snapshot.empty) {
    return null;
  }

  const document =
    snapshot.docs[0];

  const data =
    document.data() as EntityDocumentData;

  return {
    scopeType,
    scopeId:
      document.id,

    name:
      getEntityName(
        data
      ),

    active:
      data.active,
  };
}

export async function getCurrentEntity(
  userId: string
): Promise<CurrentEntity | null> {
  const college =
    await findUserInCollection(
      "colleges",
      userId,
      "college"
    );

  if (college) {
    return college;
  }

  const localRegional =
    await findUserInCollection(
      "Local & Regional Activities",
      userId,
      "local-regional"
    );

  if (localRegional) {
    return localRegional;
  }

  const scientificSociety =
    await findUserInCollection(
      "Scientific Societies",
      userId,
      "scientific-society"
    );

  if (scientificSociety) {
    return scientificSociety;
  }

  const studentClub =
    await findUserInCollection(
      "student_club",
      userId,
      "student-club"
    );

  if (studentClub) {
    return studentClub;
  }

  return null;
}
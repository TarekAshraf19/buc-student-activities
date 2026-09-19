import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import type {
  ActivityScopeType,
  LocalizedText,
} from "@/types/activity";

export type DashboardUserRole =
  | "uploader"
  | "dean";

export type CurrentEntity = {
  scopeType: ActivityScopeType;
  scopeId: string;
  name: LocalizedText;
  active: boolean;
  role: DashboardUserRole;
};

type DashboardUserDocument = {
  role: DashboardUserRole;
  scopeType: ActivityScopeType;
  scopeId: string;
  active: boolean;
};

type EntityDocumentData = {
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

function getEntityCollectionName(
  scopeType: ActivityScopeType
): string {
  switch (scopeType) {
    case "college":
      return "colleges";

    case "local-regional":
      return "Local & Regional Activities";

    case "student-club":
      return "student_club";

    case "scientific-society":
      return "Scientific Societies";

    default:
      throw new Error(
        "Unsupported entity scope."
      );
  }
}

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

function isValidDashboardUserRole(
  role: unknown
): role is DashboardUserRole {
  return (
    role === "uploader" ||
    role === "dean"
  );
}

function isValidScopeType(
  scopeType: unknown
): scopeType is ActivityScopeType {
  return (
    scopeType === "college" ||
    scopeType === "local-regional" ||
    scopeType === "student-club" ||
    scopeType === "scientific-society"
  );
}

export async function getCurrentEntity(
  userId: string
): Promise<CurrentEntity | null> {
  const dashboardUserRef = doc(
    db,
    "dashboardUsers",
    userId
  );

  const dashboardUserSnapshot =
    await getDoc(
      dashboardUserRef
    );

  if (
    !dashboardUserSnapshot.exists()
  ) {
    return null;
  }

  const dashboardUser =
    dashboardUserSnapshot.data() as
      Partial<DashboardUserDocument>;

  if (
    !isValidDashboardUserRole(
      dashboardUser.role
    ) ||
    !isValidScopeType(
      dashboardUser.scopeType
    ) ||
    typeof dashboardUser.scopeId !==
      "string" ||
    !dashboardUser.scopeId
  ) {
    throw new Error(
      "Invalid dashboard user configuration."
    );
  }

  if (
    dashboardUser.active !== true
  ) {
    return null;
  }

  const entityCollectionName =
    getEntityCollectionName(
      dashboardUser.scopeType
    );

  const entityRef = doc(
    db,
    entityCollectionName,
    dashboardUser.scopeId
  );

  const entitySnapshot =
    await getDoc(
      entityRef
    );

  if (!entitySnapshot.exists()) {
    return null;
  }

  const entityData =
    entitySnapshot.data() as
      EntityDocumentData;

  if (entityData.active === false) {
    return null;
  }

  return {
    scopeType:
      dashboardUser.scopeType,

    scopeId:
      dashboardUser.scopeId,

    name:
      getEntityName(
        entityData
      ),

    active: true,

    role:
      dashboardUser.role,
  };
}
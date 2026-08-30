import type { Timestamp } from "firebase/firestore";

export type LocalizedText = {
  en: string;
  ar: string;
};

export type CollegePlanSemester =
  | "first"
  | "second"
  | "summer";

export type CollegePlanItemStatus =
  | "planned"
  | "in-progress"
  | "completed"
  | "cancelled";

export type CollegePlanItem = {
  id: string;
  title: LocalizedText;
  category: LocalizedText;
  plannedDate: string;
  status: CollegePlanItemStatus;
  activityId?: string;
};

export type CollegePlan = {
  id: string;
  collegeId: string;
  academicYear: string;
  semester: CollegePlanSemester;
  items: CollegePlanItem[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type CollegePlanInput = {
  collegeId: string;
  academicYear: string;
  semester: CollegePlanSemester;
  items: CollegePlanItem[];
};
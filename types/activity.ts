export type LocalizedText = {
  en: string;
  ar: string;
};

export type ActivityScopeType =
  | "college"
  | "local-regional"
  | "student-club"
  | "scientific-society";

export type StudentClubCategory =
  | "social-media"
  | "social"
  | "sports"
  | "cultural"
  | "art";

export type Activity = {
  id: string;

  title: LocalizedText;

  description: LocalizedText;

  category: LocalizedText;

  date: string;

  image: string;

  createdBy: string;

  scopeType: ActivityScopeType;

  scopeId: string;

  subcategoryId?: StudentClubCategory;
};
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

export type ActivityStatus =
  | "pending"
  | "approved"
  | "declined";

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

  /*
   * Used only when a School Activity
   * is linked to an item in the School Plan.
   *
   * The client stores the reference here.
   * A trusted backend function handles
   * updating the actual School Plan.
   */
  plannedItemId?: string;

  status: ActivityStatus;

  reviewedBy?: string;
  reviewedAt?: unknown;

  declineReason?: string;
};
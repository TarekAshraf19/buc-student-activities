import type { LocalizedText } from "@/types/activity";

export type Major = {
  en: string;
  ar: string;
};

export type College = {
  id: string;

  name: LocalizedText;

  description: LocalizedText;

  image: string;

  userId?: string;

  majors?: Major[];

  planName?: string;

  planUrl?: string;
};
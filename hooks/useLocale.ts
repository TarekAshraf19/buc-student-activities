"use client";

import { useParams } from "next/navigation";

export type Locale = "en" | "ar";

export function useLocale() {
  const params = useParams();

  const locale: Locale =
    params.locale === "ar"
      ? "ar"
      : "en";

  const isArabic =
    locale === "ar";

  return {
    locale,
    isArabic,
  };
}
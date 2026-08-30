"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  Users,
} from "lucide-react";

import SectionActivities from "@/components/activities/SectionActivities";

import { useLocale } from "@/hooks/useLocale";
import { useStudentClubActivities } from "@/hooks/useStudentClubActivities";

import type {
  StudentClubCategory,
} from "@/types/activity";

const validCategories: StudentClubCategory[] = [
  "social-media",
  "social",
  "sports",
  "cultural",
  "art",
];

function isStudentClubCategory(
  value: string
): value is StudentClubCategory {
  return validCategories.includes(
    value as StudentClubCategory
  );
}

export default function StudentClubCategoryPage() {
  const params = useParams();

  const t = useTranslations(
    "StudentClubCategory"
  );

  const {
    locale,
    isArabic,
  } = useLocale();

  const categoryParam =
    typeof params.category === "string"
      ? params.category
      : "";

  const category =
    isStudentClubCategory(
      categoryParam
    )
      ? categoryParam
      : null;

  const {
    activities,
    loading,
    error,
  } = useStudentClubActivities(
    category ?? "social-media"
  );

  const BackArrow =
    isArabic
      ? ArrowRight
      : ArrowLeft;

  if (!category) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 pt-24">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[var(--primary)]">
            {t("notFound")}
          </h1>

          <Link
            href={`/${locale}/student-clubs`}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)]"
          >
            <BackArrow className="h-4 w-4" />

            {t("back")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 pb-20 pt-32">
      <div className="mx-auto max-w-7xl">
        <Link
          href={`/${locale}/student-clubs`}
          className="group inline-flex items-center gap-2 text-sm font-bold text-[var(--primary)] transition hover:text-[var(--secondary)]"
        >
          <BackArrow
            className={`h-4 w-4 transition-transform ${
              isArabic
                ? "group-hover:translate-x-1"
                : "group-hover:-translate-x-1"
            }`}
          />

          {t("back")}
        </Link>

        <div className="mt-10 max-w-3xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--secondary)]/10 text-[var(--secondary)]">
            <Users className="h-7 w-7" />
          </div>

          <p className="mt-6 text-sm font-semibold tracking-[0.2em] text-[var(--secondary)]">
            {t("eyebrow")}
          </p>

          <h1 className="mt-4 text-4xl font-bold text-[var(--primary)] md:text-6xl">
            {t(
              `committees.${category}.title`
            )}
          </h1>

          <p className="mt-6 text-lg leading-8 text-[var(--muted)]">
            {t(
              `committees.${category}.description`
            )}
          </p>
        </div>

        <div className="mt-14">
          <SectionActivities
            activities={activities}
            loading={loading}
            error={error}
            loadingLabel={t("loading")}
            errorLabel={t("error")}
            emptyLabel={t("empty")}
            viewLabel={t("viewActivity")}
          />
        </div>
      </div>
    </main>
  );
}
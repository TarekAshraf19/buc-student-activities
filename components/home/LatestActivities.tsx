"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useTranslations } from "next-intl";

import ActivityGrid from "@/components/activities/ActivityGrid";

import { useActivities } from "@/hooks/useActivities";
import { useLocale } from "@/hooks/useLocale";

export default function LatestActivities() {
  const t = useTranslations(
    "LatestActivities"
  );

  const {
    locale,
    isArabic,
  } = useLocale();

  const {
    activities,
    loading,
    error,
  } = useActivities();

  const Arrow =
    isArabic
      ? ArrowLeft
      : ArrowRight;

  const latestActivities = [...activities]
    .sort(
      (a, b) =>
        new Date(
          `${b.date}T00:00:00`
        ).getTime() -
        new Date(
          `${a.date}T00:00:00`
        ).getTime()
    )
    .slice(0, 3);

  return (
    <section className="bg-[var(--background)] px-6 py-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold tracking-[0.2em] text-[var(--secondary)]">
            {t("eyebrow")}
          </p>

          <h2 className="text-3xl font-bold leading-tight text-[var(--primary)] md:text-5xl">
            {t("title")}
          </h2>

          <p className="mt-5 text-base leading-7 text-[var(--muted)] md:text-lg">
            {t("description")}
          </p>

          <Link
            href={`/${locale}/activities`}
            className="group mt-7 inline-flex items-center gap-2 font-semibold text-[var(--primary)] transition hover:text-[var(--secondary)]"
          >
            {t("viewAll")}

            <Arrow
              className={`h-5 w-5 transition-transform ${
                isArabic
                  ? "group-hover:-translate-x-1"
                  : "group-hover:translate-x-1"
              }`}
            />
          </Link>
        </div>

        {loading && (
          <div className="py-16 text-center text-[var(--muted)]">
            {t("loading")}
          </div>
        )}

        {error && (
          <div className="py-16 text-center text-red-500">
            {t("error")}
          </div>
        )}

        {!loading &&
          !error &&
          latestActivities.length > 0 && (
            <div className="mt-12 md:mt-16">
              <ActivityGrid
                activities={
                  latestActivities
                }
                viewLabel={t(
                  "discoverMore"
                )}
              />
            </div>
          )}

        {!loading &&
          !error &&
          latestActivities.length === 0 && (
            <div className="py-16 text-center text-[var(--muted)]">
              {t("empty")}
            </div>
          )}
      </div>
    </section>
  );
}
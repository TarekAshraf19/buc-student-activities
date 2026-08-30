"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  MessageCircle,
  Palette,
  Puzzle,
  HandHeart,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { useActivitiesByScope } from "@/hooks/useActivitiesByScope";
import { useLocale } from "@/hooks/useLocale";

import type {
  StudentClubCategory,
} from "@/types/activity";

const committees: {
  id: StudentClubCategory;
  icon: typeof MessageCircle;
}[] = [
  {
    id: "social-media",
    icon: MessageCircle,
  },
  {
    id: "social",
    icon: HandHeart,
  },
  {
    id: "sports",
    icon: Puzzle,
  },
  {
    id: "cultural",
    icon: BookOpen,
  },
  {
    id: "art",
    icon: Palette,
  },
];

export default function StudentClubsPage() {
  const t = useTranslations(
    "StudentClubs"
  );

  const {
    locale,
    isArabic,
  } = useLocale();

  const {
    activities,
    loading,
    error,
  } = useActivitiesByScope(
    "student-club"
  );

  const Arrow =
    isArabic
      ? ArrowLeft
      : ArrowRight;

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 pb-20 pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-[0.2em] text-[var(--secondary)]">
            {t("eyebrow")}
          </p>

          <h1 className="mt-4 text-4xl font-bold text-[var(--primary)] md:text-6xl">
            {t("title")}
          </h1>

          <p className="mt-6 text-lg leading-8 text-[var(--muted)]">
            {t("description")}
          </p>
        </div>

        {loading && (
          <div className="py-20 text-center text-[var(--muted)]">
            {t("loading")}
          </div>
        )}

        {error && (
          <div className="py-20 text-center text-red-500">
            {t("error")}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {committees.map(
              (committee) => {
                const Icon =
                  committee.icon;

                const activityCount =
                  activities.filter(
                    (activity) =>
                      activity.subcategoryId ===
                      committee.id
                  ).length;

                return (
                  <article
                    key={committee.id}
                    className="flex min-h-[330px] flex-col rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <Icon className="h-8 w-8" />
                    </div>

                    <h2 className="mt-7 text-2xl font-bold leading-snug text-[var(--primary)]">
                      {t(
                        `committees.${committee.id}.title`
                      )}
                    </h2>

                    <p className="mt-4 text-base leading-7 text-[var(--muted)]">
                      {t(
                        `committees.${committee.id}.description`
                      )}
                    </p>

                    <div className="mt-auto pt-8">
                      <div className="border-t border-gray-100 pt-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <span className="text-sm font-semibold text-[var(--muted)]">
                            {t(
                              "activityCount",
                              {
                                count:
                                  activityCount,
                              }
                            )}
                          </span>

                          <Link
                            href={`/${locale}/student-clubs/${committee.id}`}
                            className="group inline-flex w-fit items-center gap-2 text-sm font-bold text-[var(--primary)] transition hover:text-[var(--secondary)]"
                          >
                            {t(
                              "viewCommittee"
                            )}

                            <Arrow
                              className={`h-4 w-4 shrink-0 transition-transform ${
                                isArabic
                                  ? "group-hover:-translate-x-1"
                                  : "group-hover:translate-x-1"
                              }`}
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
      </div>
    </main>
  );
}
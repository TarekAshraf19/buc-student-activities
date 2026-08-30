"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
} from "lucide-react";
import { useTranslations } from "next-intl";

import ActivityGrid from "@/components/activities/ActivityGrid";

import { useCollegeDetails } from "@/hooks/useCollegeDetails";
import { useLocale } from "@/hooks/useLocale";

export default function CollegeDetails() {
  const t = useTranslations(
    "CollegeDetails"
  );

  const {
    locale,
    isArabic,
  } = useLocale();

  const params = useParams();

  const collegeId =
    typeof params.id === "string"
      ? params.id
      : "";

  const {
    college,
    activities,
    loading,
    error,
  } = useCollegeDetails(collegeId);

  const Arrow =
    isArabic
      ? ArrowLeft
      : ArrowRight;

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {loading && (
        <div className="flex min-h-screen items-center justify-center text-[var(--muted)]">
          {t("loading")}
        </div>
      )}

      {error && !loading && (
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <h1 className="text-3xl font-bold text-[var(--primary)]">
            {t("notFound")}
          </h1>

          <p className="mt-4 text-[var(--muted)]">
            {t(
              "notFoundDescription"
            )}
          </p>

          <Link
            href={`/${locale}/colleges`}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            <Arrow className="h-5 w-5" />

            {t("back")}
          </Link>
        </div>
      )}

      {college &&
        !loading &&
        !error && (
          <>
            <section className="relative h-[55vh] min-h-[400px] overflow-hidden">
              <img
                src={college.image}
                alt={
                  college.name[
                    locale
                  ]
                }
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-12 text-white">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-md">
                  <Building2 className="h-4 w-4" />

                  {t("college")}
                </div>

                <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
                  {
                    college.name[
                      locale
                    ]
                  }
                </h1>
              </div>
            </section>

            <section className="px-6 py-16 md:py-20">
              <div className="mx-auto max-w-7xl">
                <Link
                  href={`/${locale}/colleges`}
                  className="group inline-flex items-center gap-2 text-sm font-bold text-[var(--primary)] transition hover:text-[var(--secondary)]"
                >
                  <Arrow
                    className={`h-4 w-4 transition-transform ${
                      isArabic
                        ? "group-hover:translate-x-1"
                        : "group-hover:-translate-x-1"
                    }`}
                  />

                  {t("back")}
                </Link>

                <div className="mt-12 max-w-3xl">
                  <h2 className="text-3xl font-bold text-[var(--primary)]">
                    {t("about")}
                  </h2>

                  <p className="mt-6 text-lg leading-9 text-[var(--muted)]">
                    {
                      college
                        .description[
                        locale
                      ]
                    }
                  </p>
                </div>

                <div className="mt-20">
                  <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div>
                      <p className="text-sm font-semibold tracking-[0.2em] text-[var(--secondary)]">
                        {t(
                          "activitiesEyebrow"
                        )}
                      </p>

                      <h2 className="mt-3 text-3xl font-bold text-[var(--primary)] md:text-4xl">
                        {t(
                          "activitiesTitle"
                        )}
                      </h2>
                    </div>

                    <Link
                      href={`/${locale}/activities`}
                      className="group inline-flex items-center gap-2 font-semibold text-[var(--primary)] transition hover:text-[var(--secondary)]"
                    >
                      {t(
                        "viewAllActivities"
                      )}

                      <Arrow
                        className={`h-5 w-5 transition-transform ${
                          isArabic
                            ? "group-hover:-translate-x-1"
                            : "group-hover:translate-x-1"
                        }`}
                      />
                    </Link>
                  </div>

                  {activities.length >
                    0 && (
                    <div className="mt-10">
                      <ActivityGrid
                        activities={
                          activities
                        }
                        viewLabel={t(
                          "viewActivity"
                        )}
                      />
                    </div>
                  )}

                  {activities.length ===
                    0 && (
                    <div className="mt-10 rounded-[2rem] bg-white p-10 text-center text-[var(--muted)] shadow-sm">
                      {t(
                        "noActivities"
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        )}
    </main>
  );
}
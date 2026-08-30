"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ArrowRight,
  ArrowLeft,
  CalendarDays,
  Layers3,
} from "lucide-react";

import {
  useTranslations,
} from "next-intl";

import {
  useActivity,
} from "@/hooks/useActivity";

import {
  useLocale,
} from "@/hooks/useLocale";

import {
  getCollegeNameById,
} from "@/services/activity.service";

type CollegeName = {
  en: string;
  ar: string;
};

export default function ActivityDetails() {
  const t =
    useTranslations(
      "ActivityDetails"
    );

  const {
    locale,
    isArabic,
  } = useLocale();

  const params =
    useParams();

  const activityId =
    typeof params.id === "string"
      ? params.id
      : "";

  const {
    activity,
    loading,
    error,
  } =
    useActivity(activityId);

  const [
    collegeName,
    setCollegeName,
  ] =
    useState<CollegeName | null>(
      null
    );

  const Arrow =
    isArabic
      ? ArrowLeft
      : ArrowRight;

  useEffect(() => {
    if (
      !activity ||
      activity.scopeType !==
        "college" ||
      !activity.scopeId
    ) {
      setCollegeName(null);
      return;
    }

    const loadCollegeName =
      async () => {
        try {
          const name =
            await getCollegeNameById(
              activity.scopeId
            );

          setCollegeName(name);
        } catch (error) {
          console.error(
            "Error loading college name:",
            error
          );

          setCollegeName(null);
        }
      };

    loadCollegeName();
  }, [activity]);

  function getScopeLabel() {
    if (!activity) {
      return "";
    }

    switch (activity.scopeType) {
      case "college":
        return (
          collegeName?.[locale] ??
          t("scopes.college")
        );

      case "local-regional":
        return t(
          "scopes.localRegional"
        );

      case "student-club":
        return t(
          "scopes.studentClub"
        );

      case "scientific-society":
        return t(
          "scopes.scientificSociety"
        );

      default:
        return "";
    }
  }

  function getCommitteeLabel() {
    if (
      !activity ||
      activity.scopeType !==
        "student-club" ||
      !activity.subcategoryId
    ) {
      return null;
    }

    return t(
      `committees.${activity.subcategoryId}`
    );
  }

  const committeeLabel =
    getCommitteeLabel();

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {loading && (
        <div className="flex min-h-[70vh] items-center justify-center text-[var(--muted)]">
          {t("loading")}
        </div>
      )}

      {error &&
        !loading && (
          <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
            <h1 className="text-3xl font-bold text-[var(--primary)]">
              {t("notFound")}
            </h1>

            <p className="mt-4 text-[var(--muted)]">
              {t(
                "notFoundDescription"
              )}
            </p>

            <Link
              href={`/${locale}/activities`}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white transition hover:opacity-90"
            >
              <Arrow className="h-5 w-5" />

              {t("back")}
            </Link>
          </div>
        )}

      {activity &&
        !loading &&
        !error && (
          <>
            <section className="relative h-[55vh] min-h-[400px] overflow-hidden">
              <img
                src={
                  activity.image
                }
                alt={
                  activity.title[
                    locale
                  ]
                }
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-12 text-white">
                <span className="inline-block rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-md">
                  {
                    activity
                      .category[
                      locale
                    ]
                  }
                </span>

                <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
                  {
                    activity.title[
                      locale
                    ]
                  }
                </h1>
              </div>
            </section>

            <section className="px-6 py-16 md:py-20">
              <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[2fr_1fr]">
                <div>
                  <Link
                    href={`/${locale}/activities`}
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

                  <h2 className="mt-10 text-3xl font-bold text-[var(--primary)]">
                    {t("about")}
                  </h2>

                  <p className="mt-6 text-lg leading-9 text-[var(--muted)]">
                    {
                      activity
                        .description[
                        locale
                      ]
                    }
                  </p>
                </div>

                <aside className="h-fit rounded-[2rem] bg-white p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-[var(--primary)]">
                    {t(
                      "information"
                    )}
                  </h3>

                  <div className="mt-7 space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-[var(--background)] p-3 text-[var(--secondary)]">
                        <Layers3 className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-sm text-[var(--muted)]">
                          {t(
                            "section"
                          )}
                        </p>

                        <p className="mt-1 font-semibold text-[var(--primary)]">
                          {getScopeLabel()}
                        </p>
                      </div>
                    </div>

                    {committeeLabel && (
                      <div className="flex items-start gap-4">
                        <div className="rounded-xl bg-[var(--background)] p-3 text-[var(--secondary)]">
                          <Layers3 className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="text-sm text-[var(--muted)]">
                            {t(
                              "committee"
                            )}
                          </p>

                          <p className="mt-1 font-semibold text-[var(--primary)]">
                            {
                              committeeLabel
                            }
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-[var(--background)] p-3 text-[var(--secondary)]">
                        <CalendarDays className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-sm text-[var(--muted)]">
                          {t(
                            "date"
                          )}
                        </p>

                        <p className="mt-1 font-semibold text-[var(--primary)]">
                          {
                            activity.date
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-[var(--background)] p-3 text-[var(--secondary)]">
                        <Layers3 className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="text-sm text-[var(--muted)]">
                          {t(
                            "category"
                          )}
                        </p>

                        <p className="mt-1 font-semibold text-[var(--primary)]">
                          {
                            activity
                              .category[
                              locale
                            ]
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </section>
          </>
        )}
    </main>
  );
}
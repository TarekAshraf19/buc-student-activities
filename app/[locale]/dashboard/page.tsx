"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Plus,
  CalendarDays,
  Building2,
  Pencil,
  Trash2,
  FileText,
  MapPinned,
  FlaskConical,
  Users,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useLocale } from "@/hooks/useLocale";
import { useCurrentEntity } from "@/hooks/useCurrentEntity";
import { useCurrentCollege } from "@/hooks/useCurrentCollege";
import { useEntityActivities } from "@/hooks/useEntityActivities";

export default function DashboardPage() {
  const t = useTranslations("Dashboard");

  const { locale } = useLocale();

  const {
    user,
    loading: authLoading,
  } = useAuth();

  const {
    entity,
    loading: entityLoading,
    error: entityError,
  } = useCurrentEntity();

  /*
   * College data is still needed here only for:
   * - displaying the college name
   * - College Plan
   *
   * Other entity types do not depend on it.
   */
  const {
    college,
    loading: collegeLoading,
  } = useCurrentCollege(
    entity?.scopeType === "college"
      ? user?.uid
      : undefined
  );

  const {
    activities,
    loading: activitiesLoading,
    error: activitiesError,
    deletingId,
    removeActivity,
  } = useEntityActivities(
    entity?.scopeType,
    entity?.scopeId
  );

  const loading =
    authLoading ||
    entityLoading ||
    activitiesLoading ||
    (entity?.scopeType === "college" &&
      collegeLoading);

  const handleDelete = async (
    activityId: string
  ) => {
    const confirmed = window.confirm(
      t("deleteConfirm")
    );

    if (!confirmed) {
      return;
    }

    const success =
      await removeActivity(activityId);

    if (!success) {
      alert(t("deleteError"));
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 pt-24">
        <p className="text-[var(--muted)]">
          {t("loading")}
        </p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  if (
    entityError ||
    !entity
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 pt-24">
        <div className="max-w-md text-center">
          <Building2 className="mx-auto h-12 w-12 text-[var(--secondary)]" />

          <h1 className="mt-6 text-3xl font-bold text-[var(--primary)]">
            {t("noEntity")}
          </h1>

          <p className="mt-4 text-[var(--muted)]">
            {t("noEntityDescription")}
          </p>
        </div>
      </main>
    );
  }

  const isCollege =
    entity.scopeType === "college";

  const entityInfo = (() => {
    switch (entity.scopeType) {
      case "college":
        return {
          label:
            college?.name[locale] ??
            t("entities.college"),
          Icon: Building2,
        };

      case "local-regional":
        return {
          label:
            t("entities.localRegional"),
          Icon: MapPinned,
        };

      case "scientific-society":
        return {
          label:
            t("entities.scientificSociety"),
          Icon: FlaskConical,
        };

      case "student-club":
        return {
          label:
            t("entities.studentClub"),
          Icon: Users,
        };
    }
  })();

  const EntityIcon =
    entityInfo.Icon;

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 pb-20 pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-sm font-semibold tracking-[0.2em] text-[var(--secondary)]">
              {t("eyebrow")}
            </p>

            <h1 className="text-4xl font-bold text-[var(--primary)] md:text-6xl">
              {t("title")}
            </h1>

            <div className="mt-5 flex items-center gap-3 text-[var(--muted)]">
              <EntityIcon className="h-5 w-5 text-[var(--secondary)]" />

              <p className="text-lg">
                {entityInfo.label}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {isCollege && (
              <Link
                href={`/${locale}/dashboard/college-plan`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--primary)] bg-white px-6 py-3 font-semibold text-[var(--primary)] transition hover:bg-[var(--primary)] hover:text-white"
              >
                <FileText className="h-5 w-5" />

                {t("collegePlan")}
              </Link>
            )}

            <Link
              href={`/${locale}/dashboard/add-activity`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)]"
            >
              <Plus className="h-5 w-5" />

              {t("addActivity")}
            </Link>
          </div>
        </div>

        <div className="mt-14">
          <h2 className="text-2xl font-bold text-[var(--primary)] md:text-3xl">
            {t("yourActivities")}
          </h2>

          {activitiesError && (
            <div className="mt-8 rounded-[2rem] bg-white p-10 text-center shadow-sm">
              <p className="text-red-500">
                {t("activitiesError")}
              </p>
            </div>
          )}

          {!activitiesError &&
            activities.length === 0 && (
              <div className="mt-8 rounded-[2rem] bg-white p-10 text-center shadow-sm">
                <CalendarDays className="mx-auto h-10 w-10 text-[var(--secondary)]" />

                <h3 className="mt-5 text-xl font-bold text-[var(--primary)]">
                  {t("noActivities")}
                </h3>

                <p className="mt-3 text-[var(--muted)]">
                  {t(
                    "noActivitiesDescription"
                  )}
                </p>
              </div>
            )}

          {!activitiesError &&
            activities.length > 0 && (
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {activities.map(
                  (activity) => (
                    <article
                      key={activity.id}
                      className="overflow-hidden rounded-[2rem] bg-white shadow-sm"
                    >
                      <div className="relative h-52 overflow-hidden">
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

                        <span className="absolute start-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-[var(--primary)]">
                          {
                            activity
                              .category[
                              locale
                            ]
                          }
                        </span>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                          <CalendarDays className="h-4 w-4" />

                          {activity.date}
                        </div>

                        <h3 className="mt-4 text-xl font-bold text-[var(--primary)]">
                          {
                            activity.title[
                              locale
                            ]
                          }
                        </h3>

                        <div className="mt-6 flex items-center gap-5">
                          <Link
                            href={`/${locale}/dashboard/edit-activity/${activity.id}`}
                            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--primary)] transition hover:text-[var(--secondary)]"
                          >
                            <Pencil className="h-4 w-4" />

                            {t("edit")}
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                activity.id
                              )
                            }
                            disabled={
                              deletingId ===
                              activity.id
                            }
                            className="inline-flex items-center gap-2 text-sm font-bold text-red-500 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />

                            {deletingId ===
                            activity.id
                              ? t(
                                  "deleting"
                                )
                              : t(
                                  "delete"
                                )}
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                )}
              </div>
            )}
        </div>
      </div>
    </main>
  );
}
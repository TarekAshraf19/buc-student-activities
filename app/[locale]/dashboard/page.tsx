"use client";

import Link from "next/link";

import {
  useState,
} from "react";

import {
  useTranslations,
} from "next-intl";

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
  CheckCircle2,
  XCircle,
  Clock3,
  CircleCheckBig,
  CircleX,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useLocale } from "@/hooks/useLocale";
import { useCurrentEntity } from "@/hooks/useCurrentEntity";
import { useEntityActivities } from "@/hooks/useEntityActivities";

import type {
  Activity,
} from "@/types/activity";

export default function DashboardPage() {
  const t =
    useTranslations("Dashboard");

  const { locale } =
    useLocale();

  const {
    user,
    loading: authLoading,
  } = useAuth();

  const {
    entity,
    loading: entityLoading,
    error: entityError,
  } = useCurrentEntity();

  const {
    activities,
    loading: activitiesLoading,
    error: activitiesError,

    deletingId,
    approvingId,
    decliningId,

    removeActivity,
    approveActivity,
    declineActivity,
  } = useEntityActivities(
    entity?.scopeType,
    entity?.scopeId
  );

  /*
   * =========================================================
   * DECLINE MODAL STATE
   * =========================================================
   */

  const [
    declineActivityId,
    setDeclineActivityId,
  ] = useState<string | null>(
    null
  );

  const [
    declineReason,
    setDeclineReason,
  ] = useState("");

  const [
    declineError,
    setDeclineError,
  ] = useState(false);

  /*
   * =========================================================
   * ROLE
   * =========================================================
   */

  const isDean =
    entity?.role === "dean";

  const isUploader =
    entity?.role === "uploader";

  const isCollege =
    entity?.scopeType ===
    "college";

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  const loading =
    authLoading ||
    entityLoading ||
    activitiesLoading;

  /*
   * =========================================================
   * DELETE
   * =========================================================
   */

  const handleDelete = async (
    activityId: string
  ) => {
    if (!isDean) {
      return;
    }

    const confirmed =
      window.confirm(
        t("deleteConfirm")
      );

    if (!confirmed) {
      return;
    }

    const success =
      await removeActivity(
        activityId
      );

    if (!success) {
      alert(
        t("deleteError")
      );
    }
  };

  /*
   * =========================================================
   * APPROVE
   * =========================================================
   */

  const handleApprove = async (
    activityId: string
  ) => {
    if (
      !isDean ||
      !user
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        t("approveConfirm")
      );

    if (!confirmed) {
      return;
    }

    const success =
      await approveActivity(
        activityId,
        user.uid
      );

    if (!success) {
      alert(
        t("approveError")
      );
    }
  };

  /*
   * =========================================================
   * DECLINE
   * =========================================================
   */

  const openDeclineModal = (
    activityId: string
  ) => {
    if (!isDean) {
      return;
    }

    setDeclineActivityId(
      activityId
    );

    setDeclineReason("");
    setDeclineError(false);
  };

  const closeDeclineModal =
    () => {
      setDeclineActivityId(
        null
      );

      setDeclineReason("");
      setDeclineError(false);
    };

  const handleDecline =
    async () => {
      if (
        !isDean ||
        !user ||
        !declineActivityId
      ) {
        return;
      }

      if (
        !declineReason.trim()
      ) {
        setDeclineError(true);
        return;
      }

      setDeclineError(false);

      const success =
        await declineActivity(
          declineActivityId,
          user.uid,
          declineReason
        );

      if (!success) {
        alert(
          t("declineError")
        );

        return;
      }

      closeDeclineModal();
    };

  /*
   * =========================================================
   * STATUS
   * =========================================================
   */

  const getStatusConfig = (
    activity: Activity
  ) => {
    switch (
      activity.status
    ) {
      case "approved":
        return {
          label:
            t(
              "status.approved"
            ),

          className:
            "bg-emerald-50 text-emerald-700",

          Icon:
            CircleCheckBig,
        };

      case "declined":
        return {
          label:
            t(
              "status.declined"
            ),

          className:
            "bg-red-50 text-red-600",

          Icon:
            CircleX,
        };

      case "pending":
      default:
        return {
          label:
            t(
              "status.pending"
            ),

          className:
            "bg-amber-50 text-amber-700",

          Icon:
            Clock3,
        };
    }
  };

  /*
   * =========================================================
   * LOADING SCREEN
   * =========================================================
   */

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

  /*
   * =========================================================
   * INVALID ENTITY
   * =========================================================
   */

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
            {t(
              "noEntityDescription"
            )}
          </p>
        </div>
      </main>
    );
  }

  /*
   * =========================================================
   * ENTITY INFORMATION
   * =========================================================
   */

  const entityInfo = (() => {
    switch (
      entity.scopeType
    ) {
      case "college":
        return {
          label:
            entity.name[
              locale
            ] ||
            t(
              "entities.college"
            ),

          Icon:
            Building2,
        };

      case "local-regional":
        return {
          label:
            entity.name[
              locale
            ] ||
            t(
              "entities.localRegional"
            ),

          Icon:
            MapPinned,
        };

      case "scientific-society":
        return {
          label:
            entity.name[
              locale
            ] ||
            t(
              "entities.scientificSociety"
            ),

          Icon:
            FlaskConical,
        };

      case "student-club":
        return {
          label:
            entity.name[
              locale
            ] ||
            t(
              "entities.studentClub"
            ),

          Icon:
            Users,
        };
    }
  })();

  const EntityIcon =
    entityInfo.Icon;

  /*
   * =========================================================
   * PAGE
   * =========================================================
   */

  return (
    <>
      <main className="min-h-screen bg-[var(--background)] px-6 pb-20 pt-32">
        <div className="mx-auto max-w-7xl">

          {/* HEADER */}

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-4 text-sm font-semibold tracking-[0.2em] text-[var(--secondary)]">
                {t("eyebrow")}
              </p>

              <h1 className="text-4xl font-bold text-[var(--primary)] md:text-6xl">
                {t("title")}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-[var(--muted)]">
                <EntityIcon className="h-5 w-5 text-[var(--secondary)]" />

                <p className="text-lg">
                  {
                    entityInfo.label
                  }
                </p>

                <span className="text-[var(--border)]">
                  •
                </span>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[var(--primary)] shadow-sm">
                  {isDean
                    ? t(
                        "roles.dean"
                      )
                    : t(
                        "roles.uploader"
                      )}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              {/* SCHOOL PLAN */}

              {isCollege && (
                <Link
                  href={`/${locale}/dashboard/college-plan`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--primary)] bg-white px-6 py-3 font-semibold text-[var(--primary)] transition hover:bg-[var(--primary)] hover:text-white"
                >
                  <FileText className="h-5 w-5" />

                  {t(
                    "collegePlan"
                  )}
                </Link>
              )}

              {/* ADD ACTIVITY */}

              <Link
                href={`/${locale}/dashboard/add-activity`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)]"
              >
                <Plus className="h-5 w-5" />

                {t(
                  "addActivity"
                )}
              </Link>
            </div>
          </div>

          {/* ACTIVITIES */}

          <div className="mt-14">
            <h2 className="text-2xl font-bold text-[var(--primary)] md:text-3xl">
              {t(
                "yourActivities"
              )}
            </h2>

            {/* ERROR */}

            {activitiesError && (
              <div className="mt-8 rounded-[2rem] bg-white p-10 text-center shadow-sm">
                <p className="text-red-500">
                  {t(
                    "activitiesError"
                  )}
                </p>
              </div>
            )}

            {/* EMPTY */}

            {!activitiesError &&
              activities.length ===
                0 && (
                <div className="mt-8 rounded-[2rem] bg-white p-10 text-center shadow-sm">
                  <CalendarDays className="mx-auto h-10 w-10 text-[var(--secondary)]" />

                  <h3 className="mt-5 text-xl font-bold text-[var(--primary)]">
                    {t(
                      "noActivities"
                    )}
                  </h3>

                  <p className="mt-3 text-[var(--muted)]">
                    {t(
                      "noActivitiesDescription"
                    )}
                  </p>
                </div>
              )}

            {/* GRID */}

            {!activitiesError &&
              activities.length >
                0 && (
                <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {activities.map(
                    (
                      activity
                    ) => {
                      const status =
                        getStatusConfig(
                          activity
                        );

                      const StatusIcon =
                        status.Icon;

                      return (
                        <article
                          key={
                            activity.id
                          }
                          className="overflow-hidden rounded-[2rem] bg-white shadow-sm"
                        >
                          {/* IMAGE */}

                          <div className="relative h-52 overflow-hidden">
                            <img
                              src={
                                activity.image
                              }
                              alt={
                                activity
                                  .title[
                                  locale
                                ]
                              }
                              className="h-full w-full object-cover"
                            />

                            {/* CATEGORY */}

                            <span className="absolute start-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-[var(--primary)]">
                              {
                                activity
                                  .category[
                                  locale
                                ]
                              }
                            </span>

                            {/* STATUS */}

                            <span
                              className={`absolute end-5 top-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${status.className}`}
                            >
                              <StatusIcon className="h-4 w-4" />

                              {
                                status.label
                              }
                            </span>
                          </div>

                          {/* CONTENT */}

                          <div className="p-6">
                            <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                              <CalendarDays className="h-4 w-4" />

                              {
                                activity.date
                              }
                            </div>

                            <h3 className="mt-4 text-xl font-bold text-[var(--primary)]">
                              {
                                activity
                                  .title[
                                  locale
                                ]
                              }
                            </h3>

                            {/* DECLINE REASON */}

                            {activity.status ===
                              "declined" &&
                              activity.declineReason && (
                                <div className="mt-4 rounded-xl bg-red-50 p-4">
                                  <p className="text-xs font-bold text-red-700">
                                    {t(
                                      "declineReason"
                                    )}
                                  </p>

                                  <p className="mt-1 text-sm text-red-600">
                                    {
                                      activity.declineReason
                                    }
                                  </p>
                                </div>
                              )}

                            {/* DEAN CONTROLS */}

                            {isDean && (
                              <div className="mt-6 border-t border-[var(--border)] pt-5">

                                {/* MODERATION */}

                                {activity.status ===
                                  "pending" && (
                                  <div className="flex flex-wrap gap-3">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleApprove(
                                          activity.id
                                        )
                                      }
                                      disabled={
                                        approvingId ===
                                        activity.id
                                      }
                                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      <CheckCircle2 className="h-4 w-4" />

                                      {approvingId ===
                                      activity.id
                                        ? t(
                                            "approving"
                                          )
                                        : t(
                                            "approve"
                                          )}
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        openDeclineModal(
                                          activity.id
                                        )
                                      }
                                      disabled={
                                        decliningId ===
                                        activity.id
                                      }
                                      className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                      <XCircle className="h-4 w-4" />

                                      {t(
                                        "decline"
                                      )}
                                    </button>
                                  </div>
                                )}

                                {/* EDIT / DELETE */}

                                <div className="mt-4 flex flex-wrap items-center gap-5">
                                  <Link
                                    href={`/${locale}/dashboard/edit-activity/${activity.id}`}
                                    className="inline-flex items-center gap-2 text-sm font-bold text-[var(--primary)] transition hover:text-[var(--secondary)]"
                                  >
                                    <Pencil className="h-4 w-4" />

                                    {t(
                                      "edit"
                                    )}
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
                            )}

                            {/* UPLOADER MESSAGE */}

                            {isUploader && (
                              <div className="mt-6 border-t border-[var(--border)] pt-4">
                                <p className="text-sm text-[var(--muted)]">
                                  {activity.status ===
                                  "pending"
                                    ? t(
                                        "waitingForApproval"
                                      )
                                    : activity.status ===
                                        "approved"
                                      ? t(
                                          "activityApproved"
                                        )
                                      : t(
                                          "activityDeclined"
                                        )}
                                </p>
                              </div>
                            )}
                          </div>
                        </article>
                      );
                    }
                  )}
                </div>
              )}
          </div>
        </div>
      </main>

      {/* =====================================================
          DECLINE MODAL
         ===================================================== */}

      {declineActivityId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-6">
          <div className="w-full max-w-lg rounded-[2rem] bg-white p-7 shadow-2xl">
            <div className="flex items-start justify-between gap-5">
              <div>
                <h2 className="text-2xl font-bold text-[var(--primary)]">
                  {t(
                    "declineModal.title"
                  )}
                </h2>

                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {t(
                    "declineModal.description"
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeDeclineModal
                }
                className="rounded-lg p-2 text-[var(--muted)] transition hover:bg-slate-100"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-6">
              <label
                htmlFor="declineReason"
                className="text-sm font-bold text-[var(--primary)]"
              >
                {t(
                  "declineModal.reasonLabel"
                )}
              </label>

              <textarea
                id="declineReason"
                value={
                  declineReason
                }
                onChange={(event) => {
                  setDeclineReason(
                    event.target.value
                  );

                  if (
                    event.target.value.trim()
                  ) {
                    setDeclineError(
                      false
                    );
                  }
                }}
                rows={5}
                placeholder={t(
                  "declineModal.reasonPlaceholder"
                )}
                className={`mt-3 w-full resize-none rounded-xl border bg-white px-4 py-3 text-[var(--foreground)] outline-none transition ${
                  declineError
                    ? "border-red-500 focus:border-red-500"
                    : "border-[var(--border)] focus:border-[var(--secondary)]"
                }`}
              />

              {declineError && (
                <p className="mt-2 text-sm font-medium text-red-500">
                  {t(
                    "declineModal.reasonRequired"
                  )}
                </p>
              )}
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={
                  closeDeclineModal
                }
                className="rounded-xl border border-[var(--border)] px-5 py-3 font-semibold text-[var(--primary)] transition hover:bg-slate-50"
              >
                {t(
                  "declineModal.cancel"
                )}
              </button>

              <button
                type="button"
                onClick={
                  handleDecline
                }
                disabled={
                  decliningId ===
                  declineActivityId
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <XCircle className="h-5 w-5" />

                {decliningId ===
                declineActivityId
                  ? t(
                      "declining"
                    )
                  : t(
                      "declineModal.confirm"
                    )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
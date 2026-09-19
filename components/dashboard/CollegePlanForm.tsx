"use client";

import Link from "next/link";

import {
  CalendarDays,
  CheckCircle2,
  Eye,
  FileText,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";

import {
  useTranslations,
} from "next-intl";

import type {
  CollegePlanItem,
  CollegePlanSemester,
} from "@/types/college-plan";

type CollegePlanFormProps = {
  planName: string;
  planUrl: string;
  file: File | null;

  academicYear: string;
  semester: CollegePlanSemester;
  items: CollegePlanItem[];

  saving: boolean;
  loadingPlan: boolean;

  hasCurrentPlan: boolean;
  isStartingNewPlan: boolean;

  readOnly: boolean;

  onPlanNameChange: (
    value: string
  ) => void;

  onAcademicYearChange: (
    value: string
  ) => void;

  onSemesterChange: (
    value: CollegePlanSemester
  ) => void;

  onFileChange: (
    event:
      React.ChangeEvent<HTMLInputElement>
  ) => void;

  onAddItem: () => void;

  onRemoveItem: (
    itemId: string
  ) => void;

  onUpdateItem: (
    itemId: string,
    field:
      | "titleEn"
      | "titleAr"
      | "categoryEn"
      | "categoryAr"
      | "plannedDate"
      | "status",
    value: string
  ) => void;

  onSave: (
    event:
      React.FormEvent<HTMLFormElement>
  ) => void;

  onStartNewPlan: () => void;

  onCancelNewPlan: () => void;
};

export default function CollegePlanForm({
  planName,
  planUrl,
  file,

  academicYear,
  semester,
  items,

  saving,
  loadingPlan,

  hasCurrentPlan,
  isStartingNewPlan,

  readOnly,

  onPlanNameChange,
  onAcademicYearChange,
  onSemesterChange,

  onFileChange,

  onAddItem,
  onRemoveItem,
  onUpdateItem,

  onSave,

  onStartNewPlan,
  onCancelNewPlan,
}: CollegePlanFormProps) {
  const t =
    useTranslations(
      "CollegePlan"
    );

  const isWorking =
    saving ||
    loadingPlan;

  const disabled =
    isWorking ||
    readOnly;

  return (
    <form
      onSubmit={(event) => {
        if (readOnly) {
          event.preventDefault();
          return;
        }

        onSave(event);
      }}
      className="mt-10 space-y-8"
    >
      {/* ============================================= */}
      {/* READ ONLY NOTICE */}
      {/* ============================================= */}

      {readOnly && (
        <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--background)] text-[var(--secondary)]">
              <Eye className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-bold text-[var(--primary)]">
                {t(
                  "readOnlyTitle"
                )}
              </h2>

              <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                {t(
                  "readOnlyDescription"
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================= */}
      {/* PLAN INFORMATION */}
      {/* ============================================= */}

      <section className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm md:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--background)] text-[var(--secondary)]">
            <FileText className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-[var(--primary)]">
              {t(
                "planInformation"
              )}
            </h2>

            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
              {t(
                "planInformationDescription"
              )}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* PLAN NAME */}

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-bold text-[var(--primary)]">
              {t(
                "planName"
              )}
            </label>

            <input
              type="text"
              value={planName}
              disabled={disabled}
              required={!readOnly}
              onChange={(event) =>
                onPlanNameChange(
                  event.target.value
                )
              }
              placeholder={t(
                "planNamePlaceholder"
              )}
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--secondary)] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-[var(--muted)]"
            />
          </div>

          {/* ACADEMIC YEAR */}

          <div>
            <label className="mb-2 block text-sm font-bold text-[var(--primary)]">
              {t(
                "academicYear"
              )}
            </label>

            <input
              type="text"
              value={
                academicYear
              }
              disabled={
                disabled
              }
              required={
                !readOnly
              }
              onChange={(event) =>
                onAcademicYearChange(
                  event.target.value
                )
              }
              placeholder={t(
                "academicYearPlaceholder"
              )}
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--secondary)] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-[var(--muted)]"
            />
          </div>

          {/* SEMESTER */}

          <div>
            <label className="mb-2 block text-sm font-bold text-[var(--primary)]">
              {t(
                "semester"
              )}
            </label>

            <select
              value={
                semester
              }
              disabled={
                disabled
              }
              onChange={(event) =>
                onSemesterChange(
                  event.target
                    .value as CollegePlanSemester
                )
              }
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-[var(--foreground)] outline-none transition focus:border-[var(--secondary)] disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-[var(--muted)]"
            >
              <option value="first">
                {t(
                  "semesters.first"
                )}
              </option>

              <option value="second">
                {t(
                  "semesters.second"
                )}
              </option>

              <option value="summer">
                {t(
                  "semesters.summer"
                )}
              </option>
            </select>
          </div>
        </div>

        {/* CURRENT PDF */}

        {planUrl && (
          <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-[var(--secondary)]" />

                <div>
                  <p className="text-sm font-bold text-[var(--primary)]">
                    {planName}
                  </p>

                  <p className="text-xs text-[var(--muted)]">
                    {t(
                      "currentFile"
                    )}
                  </p>
                </div>
              </div>

              <Link
                href={planUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-bold text-[var(--primary)] transition hover:border-[var(--secondary)] hover:text-[var(--secondary)]"
              >
                <Eye className="h-4 w-4" />

                {t(
                  "viewFile"
                )}
              </Link>
            </div>
          </div>
        )}

        {/* PDF UPLOAD - DEAN ONLY */}

        {!readOnly && (
          <div className="mt-6">
            <label className="mb-2 block text-sm font-bold text-[var(--primary)]">
              {t(
                "planFile"
              )}
            </label>

            <label
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--background)] px-6 py-8 text-center transition ${
                isWorking
                  ? "cursor-not-allowed opacity-60"
                  : "hover:border-[var(--secondary)]"
              }`}
            >
              <Upload className="h-7 w-7 text-[var(--secondary)]" />

              <p className="mt-3 font-bold text-[var(--primary)]">
                {file
                  ? file.name
                  : t(
                      "uploadFile"
                    )}
              </p>

              <p className="mt-1 text-sm text-[var(--muted)]">
                {t(
                  "pdfOnly"
                )}
              </p>

              <input
                type="file"
                accept="application/pdf"
                disabled={
                  isWorking
                }
                onChange={
                  onFileChange
                }
                className="hidden"
              />
            </label>
          </div>
        )}
      </section>

      {/* ============================================= */}
      {/* PLANNED ACTIVITIES */}
      {/* ============================================= */}

      <section className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--background)] text-[var(--secondary)]">
              <CalendarDays className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[var(--primary)]">
                {t(
                  "plannedActivities"
                )}
              </h2>

              <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                {t(
                  "plannedActivitiesDescription"
                )}
              </p>
            </div>
          </div>

          {!readOnly && (
            <button
              type="button"
              disabled={
                isWorking
              }
              onClick={
                onAddItem
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--secondary)] px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />

              {t(
                "addPlannedActivity"
              )}
            </button>
          )}
        </div>

        {/* EMPTY */}

        {items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--background)] p-8 text-center">
            <CalendarDays className="mx-auto h-8 w-8 text-[var(--muted)]" />

            <p className="mt-3 font-bold text-[var(--primary)]">
              {t(
                "noPlannedActivities"
              )}
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {items.map(
              (
                item,
                index
              ) => (
                <div
                  key={
                    item.id
                  }
                  className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-[var(--secondary)]">
                        {t(
                          "activityNumber",
                          {
                            number:
                              index +
                              1,
                          }
                        )}
                      </p>
                    </div>

                    {!readOnly && (
                      <button
                        type="button"
                        disabled={
                          isWorking
                        }
                        onClick={() =>
                          onRemoveItem(
                            item.id
                          )
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label={t(
                          "removeActivity"
                        )}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    {/* TITLE EN */}

                    <div>
                      <label className="mb-2 block text-sm font-bold text-[var(--primary)]">
                        {t(
                          "activityTitleEn"
                        )}
                      </label>

                      <input
                        type="text"
                        value={
                          item
                            .title
                            .en
                        }
                        disabled={
                          disabled
                        }
                        required={
                          !readOnly
                        }
                        onChange={(event) =>
                          onUpdateItem(
                            item.id,
                            "titleEn",
                            event
                              .target
                              .value
                          )
                        }
                        className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--secondary)] disabled:cursor-not-allowed disabled:bg-slate-50"
                      />
                    </div>

                    {/* TITLE AR */}

                    <div>
                      <label className="mb-2 block text-sm font-bold text-[var(--primary)]">
                        {t(
                          "activityTitleAr"
                        )}
                      </label>

                      <input
                        type="text"
                        dir="rtl"
                        value={
                          item
                            .title
                            .ar
                        }
                        disabled={
                          disabled
                        }
                        required={
                          !readOnly
                        }
                        onChange={(event) =>
                          onUpdateItem(
                            item.id,
                            "titleAr",
                            event
                              .target
                              .value
                          )
                        }
                        className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--secondary)] disabled:cursor-not-allowed disabled:bg-slate-50"
                      />
                    </div>

                    {/* CATEGORY EN */}

                    <div>
                      <label className="mb-2 block text-sm font-bold text-[var(--primary)]">
                        {t(
                          "activityCategoryEn"
                        )}
                      </label>

                      <input
                        type="text"
                        value={
                          item
                            .category
                            .en
                        }
                        disabled={
                          disabled
                        }
                        required={
                          !readOnly
                        }
                        onChange={(event) =>
                          onUpdateItem(
                            item.id,
                            "categoryEn",
                            event
                              .target
                              .value
                          )
                        }
                        className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--secondary)] disabled:cursor-not-allowed disabled:bg-slate-50"
                      />
                    </div>

                    {/* CATEGORY AR */}

                    <div>
                      <label className="mb-2 block text-sm font-bold text-[var(--primary)]">
                        {t(
                          "activityCategoryAr"
                        )}
                      </label>

                      <input
                        type="text"
                        dir="rtl"
                        value={
                          item
                            .category
                            .ar
                        }
                        disabled={
                          disabled
                        }
                        required={
                          !readOnly
                        }
                        onChange={(event) =>
                          onUpdateItem(
                            item.id,
                            "categoryAr",
                            event
                              .target
                              .value
                          )
                        }
                        className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--secondary)] disabled:cursor-not-allowed disabled:bg-slate-50"
                      />
                    </div>

                    {/* DATE */}

                    <div>
                      <label className="mb-2 block text-sm font-bold text-[var(--primary)]">
                        {t(
                          "plannedDate"
                        )}
                      </label>

                      <input
                        type="date"
                        value={
                          item
                            .plannedDate
                        }
                        disabled={
                          disabled
                        }
                        required={
                          !readOnly
                        }
                        onChange={(event) =>
                          onUpdateItem(
                            item.id,
                            "plannedDate",
                            event
                              .target
                              .value
                          )
                        }
                        className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--secondary)] disabled:cursor-not-allowed disabled:bg-slate-50"
                      />
                    </div>

                    {/* STATUS */}

                    <div>
                      <label className="mb-2 block text-sm font-bold text-[var(--primary)]">
                        {t(
                          "status"
                        )}
                      </label>

                      <select
                        value={
                          item.status
                        }
                        disabled={
                          disabled
                        }
                        onChange={(event) =>
                          onUpdateItem(
                            item.id,
                            "status",
                            event
                              .target
                              .value
                          )
                        }
                        className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 outline-none transition focus:border-[var(--secondary)] disabled:cursor-not-allowed disabled:bg-slate-50"
                      >
                        <option value="planned">
                          {t(
                            "statuses.planned"
                          )}
                        </option>

                        <option value="in-progress">
                          {t(
                            "statuses.inProgress"
                          )}
                        </option>

                        <option value="completed">
                          {t(
                            "statuses.completed"
                          )}
                        </option>

                        <option value="cancelled">
                          {t(
                            "statuses.cancelled"
                          )}
                        </option>
                      </select>
                    </div>
                  </div>

                  {item.activityId && (
                    <div className="mt-5 flex items-center gap-2 rounded-xl bg-white p-3 text-sm font-semibold text-[var(--primary)]">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />

                      {t(
                        "linkedToActivity"
                      )}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </section>

      {/* ============================================= */}
      {/* DEAN ACTIONS */}
      {/* ============================================= */}

      {!readOnly && (
        <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row">
            {hasCurrentPlan &&
              !isStartingNewPlan && (
                <button
                  type="button"
                  disabled={
                    isWorking
                  }
                  onClick={
                    onStartNewPlan
                  }
                  className="rounded-xl border border-[var(--border)] bg-white px-5 py-3 text-sm font-bold text-[var(--primary)] transition hover:border-[var(--secondary)] hover:text-[var(--secondary)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {t(
                    "startNewSemester"
                  )}
                </button>
              )}

            {isStartingNewPlan && (
              <button
                type="button"
                disabled={
                  isWorking
                }
                onClick={
                  onCancelNewPlan
                }
                className="rounded-xl border border-[var(--border)] bg-white px-5 py-3 text-sm font-bold text-[var(--muted)] transition hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {t(
                  "cancelNewSemester"
                )}
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={
              isWorking
            }
            className="rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? t(
                  "saving"
                )
              : t(
                  "save"
                )}
          </button>
        </section>
      )}
    </form>
  );
}
"use client";

import {
  FileText,
  Plus,
  Save,
  Trash2,
  Upload,
} from "lucide-react";

import { useTranslations } from "next-intl";

import type {
  CollegePlanItem,
  CollegePlanSemester,
} from "@/types/college-plan";

type ItemField =
  | "titleEn"
  | "titleAr"
  | "categoryEn"
  | "categoryAr"
  | "plannedDate";

type CollegePlanFormProps = {
  planName: string;
  planUrl: string;
  file: File | null;

  academicYear: string;
  semester: CollegePlanSemester;
  items: CollegePlanItem[];

  saving: boolean;
  deleting: boolean;
  loadingPlan: boolean;

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
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;

  onAddItem: () => void;

  onRemoveItem: (
    itemId: string
  ) => void;

  onUpdateItem: (
    itemId: string,
    field: ItemField,
    value: string
  ) => void;

  onSave: (
    event: React.FormEvent<HTMLFormElement>
  ) => void;

  onDelete: () => void;
};

export default function CollegePlanForm({
  planName,
  planUrl,
  file,

  academicYear,
  semester,
  items,

  saving,
  deleting,
  loadingPlan,

  onPlanNameChange,
  onAcademicYearChange,
  onSemesterChange,

  onFileChange,

  onAddItem,
  onRemoveItem,
  onUpdateItem,

  onSave,
  onDelete,
}: CollegePlanFormProps) {
  const t =
    useTranslations("CollegePlan");

  const isWorking =
    saving ||
    deleting ||
    loadingPlan;

  return (
    <form
      onSubmit={onSave}
      className="mt-12 rounded-[2rem] bg-white p-8 shadow-sm md:p-10"
    >
      {/* Plan Name */}
      <div>
        <label className="text-sm font-semibold text-[var(--primary)]">
          {t("planName")}
        </label>

        <input
          type="text"
          value={planName}
          onChange={(event) =>
            onPlanNameChange(
              event.target.value
            )
          }
          disabled={isWorking}
          required
          className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[var(--secondary)] disabled:opacity-60"
        />
      </div>

      {/* Academic Year + Semester */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-[var(--primary)]">
            {t("academicYear")}
          </label>

          <input
            type="text"
            value={academicYear}
            onChange={(event) =>
              onAcademicYearChange(
                event.target.value
              )
            }
            placeholder={t(
              "academicYearPlaceholder"
            )}
            disabled={isWorking}
            required
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[var(--secondary)] disabled:opacity-60"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-[var(--primary)]">
            {t("semester")}
          </label>

          <select
            value={semester}
            onChange={(event) =>
              onSemesterChange(
                event.target
                  .value as CollegePlanSemester
              )
            }
            disabled={isWorking}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-[var(--secondary)] disabled:opacity-60"
          >
            <option value="first">
              {t("firstSemester")}
            </option>

            <option value="second">
              {t("secondSemester")}
            </option>

            <option value="summer">
              {t("summerSemester")}
            </option>
          </select>
        </div>
      </div>

      {/* Planned Activities */}
      <div className="mt-10">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-[var(--primary)]">
              {t("plannedActivities")}
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              {t(
                "plannedActivitiesDescription"
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={onAddItem}
            disabled={isWorking}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--secondary)] px-4 py-3 text-sm font-bold text-[var(--secondary)] transition hover:bg-[var(--background)] disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />

            {t("addActivity")}
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {items.map(
            (item, index) => (
              <div
                key={item.id}
                className="rounded-2xl border border-gray-200 p-5 md:p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-bold text-[var(--primary)]">
                    {t(
                      "plannedActivity"
                    )}{" "}
                    {index + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      onRemoveItem(
                        item.id
                      )
                    }
                    disabled={isWorking}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-red-500 transition hover:bg-red-50 disabled:opacity-60"
                    aria-label={t(
                      "removeActivity"
                    )}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Titles */}
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-[var(--primary)]">
                      {t("activityTitleEn")}
                    </label>

                    <input
                      type="text"
                      value={
                        item.title.en
                      }
                      onChange={(
                        event
                      ) =>
                        onUpdateItem(
                          item.id,
                          "titleEn",
                          event.target
                            .value
                        )
                      }
                      disabled={
                        isWorking
                      }
                      required
                      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[var(--secondary)] disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[var(--primary)]">
                      {t("activityTitleAr")}
                    </label>

                    <input
                      type="text"
                      dir="rtl"
                      value={
                        item.title.ar
                      }
                      onChange={(
                        event
                      ) =>
                        onUpdateItem(
                          item.id,
                          "titleAr",
                          event.target
                            .value
                        )
                      }
                      disabled={
                        isWorking
                      }
                      required
                      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[var(--secondary)] disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-semibold text-[var(--primary)]">
                      {t(
                        "activityCategoryEn"
                      )}
                    </label>

                    <input
                      type="text"
                      value={
                        item.category.en
                      }
                      onChange={(
                        event
                      ) =>
                        onUpdateItem(
                          item.id,
                          "categoryEn",
                          event.target
                            .value
                        )
                      }
                      disabled={
                        isWorking
                      }
                      required
                      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[var(--secondary)] disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-[var(--primary)]">
                      {t(
                        "activityCategoryAr"
                      )}
                    </label>

                    <input
                      type="text"
                      dir="rtl"
                      value={
                        item.category.ar
                      }
                      onChange={(
                        event
                      ) =>
                        onUpdateItem(
                          item.id,
                          "categoryAr",
                          event.target
                            .value
                        )
                      }
                      disabled={
                        isWorking
                      }
                      required
                      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[var(--secondary)] disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Planned Date */}
                <div className="mt-5">
                  <label className="text-sm font-semibold text-[var(--primary)]">
                    {t("plannedDate")}
                  </label>

                  <input
                    type="date"
                    value={
                      item.plannedDate
                    }
                    onChange={(
                      event
                    ) =>
                      onUpdateItem(
                        item.id,
                        "plannedDate",
                        event.target
                          .value
                      )
                    }
                    disabled={
                      isWorking
                    }
                    required
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[var(--secondary)] disabled:opacity-60"
                  />
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* PDF Upload */}
      <div className="mt-10">
        <label className="text-sm font-semibold text-[var(--primary)]">
          {t("planFile")}
        </label>

        <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 px-6 py-10 text-center transition hover:border-[var(--secondary)]">
          <Upload className="h-8 w-8 text-[var(--secondary)]" />

          <span className="mt-4 font-semibold text-[var(--primary)]">
            {file
              ? file.name
              : t("chooseFile")}
          </span>

          <span className="mt-2 text-sm text-[var(--muted)]">
            {t("pdfOnly")}
          </span>

          <input
            type="file"
            accept="application/pdf,.pdf"
            onChange={onFileChange}
            disabled={isWorking}
            className="hidden"
          />
        </label>
      </div>

      {/* Current PDF */}
      {planUrl && (
        <div className="mt-8 rounded-2xl bg-[var(--background)] p-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[var(--secondary)]">
                <FileText className="h-6 w-6" />
              </div>

              <div>
                <p className="font-bold text-[var(--primary)]">
                  {planName ||
                    t("currentPlan")}
                </p>

                <p className="mt-1 text-sm text-[var(--muted)]">
                  {t("currentPlan")}
                </p>
              </div>
            </div>

            <a
              href={planUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-[var(--secondary)] transition hover:opacity-70"
            >
              {t("viewPlan")}
            </a>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={isWorking}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-4 font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-5 w-5" />

          {saving
            ? t("saving")
            : t("save")}
        </button>

        {planUrl && (
          <button
            type="button"
            onClick={onDelete}
            disabled={isWorking}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-6 py-4 font-semibold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className="h-5 w-5" />

            {deleting
              ? t("deleting")
              : t("delete")}
          </button>
        )}
      </div>
    </form>
  );
}
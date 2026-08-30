"use client";

import {
  ImagePlus,
  Save,
} from "lucide-react";

import {
  useTranslations,
} from "next-intl";

import {
  useLocale,
} from "@/hooks/useLocale";

import type {
  ActivityScopeType,
  StudentClubCategory,
} from "@/types/activity";

import type {
  CollegePlanItem,
} from "@/types/college-plan";

export type ActivityFormData = {
  titleEn: string;
  titleAr: string;

  descriptionEn: string;
  descriptionAr: string;

  categoryEn: string;
  categoryAr: string;

  date: string;

  subcategoryId:
    | StudentClubCategory
    | "";

  plannedItemId: string;
};

type ActivityFormProps = {
  form: ActivityFormData;

  onChange: (
    field: keyof ActivityFormData,
    value: string
  ) => void;

  imageFile: File | null;

  imagePreview: string;

  onImageChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;

  onSubmit: (
    event: React.FormEvent<HTMLFormElement>
  ) => void;

  saving: boolean;

  submitLabel: string;

  scopeType: ActivityScopeType;

  plannedActivities?: CollegePlanItem[];

  plannedActivitiesLoading?: boolean;

  showPlannedActivity?: boolean;
};

const studentClubCategories:
  StudentClubCategory[] = [
    "social-media",
    "social",
    "sports",
    "cultural",
    "art",
  ];

export default function ActivityForm({
  form,
  onChange,
  imageFile,
  imagePreview,
  onImageChange,
  onSubmit,
  saving,
  submitLabel,
  scopeType,
  plannedActivities = [],
  plannedActivitiesLoading = false,
  showPlannedActivity = true,
}: ActivityFormProps) {
  const t =
    useTranslations(
      "ActivityForm"
    );

  const {
    locale,
  } = useLocale();

  const isStudentClub =
    scopeType ===
    "student-club";

  const isCollege =
    scopeType ===
    "college";

  return (
    <form
      onSubmit={onSubmit}
      className="mt-12 rounded-[2rem] bg-white p-8 shadow-sm md:p-10"
    >
      {/* Planned Activity */}

      {isCollege &&
        showPlannedActivity && (
          <div className="mb-8 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
            <label className="text-sm font-semibold text-[var(--primary)]">
              {t(
                "plannedActivity"
              )}
            </label>

            <p className="mt-1 text-sm text-[var(--muted)]">
              {t(
                "plannedActivityDescription"
              )}
            </p>

            <select
              value={
                form.plannedItemId
              }
              onChange={(
                event
              ) =>
                onChange(
                  "plannedItemId",
                  event.target
                    .value
                )
              }
              disabled={
                saving ||
                plannedActivitiesLoading
              }
              className="mt-4 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-[var(--secondary)] disabled:opacity-60"
            >
              <option value="">
                {plannedActivitiesLoading
                  ? t(
                      "loadingPlannedActivities"
                    )
                  : t(
                      "choosePlannedActivity"
                    )}
              </option>

              {plannedActivities.map(
                (item) => {
                  const title =
                    locale === "ar"
                      ? item.title.ar ||
                        item.title.en
                      : item.title.en ||
                        item.title.ar;

                  return (
                    <option
                      key={
                        item.id
                      }
                      value={
                        item.id
                      }
                    >
                      {title}
                      {item.plannedDate
                        ? ` — ${item.plannedDate}`
                        : ""}
                    </option>
                  );
                }
              )}
            </select>

            {!plannedActivitiesLoading &&
              plannedActivities.length ===
                0 && (
                <p className="mt-3 text-sm font-medium text-amber-700">
                  {t(
                    "noPlannedActivities"
                  )}
                </p>
              )}
          </div>
        )}

      {/* Title */}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-[var(--primary)]">
            {t("titleEn")}
          </label>

          <input
            type="text"
            value={
              form.titleEn
            }
            onChange={(
              event
            ) =>
              onChange(
                "titleEn",
                event.target
                  .value
              )
            }
            required
            disabled={saving}
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[var(--secondary)] disabled:opacity-60"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-[var(--primary)]">
            {t("titleAr")}
          </label>

          <input
            type="text"
            dir="rtl"
            value={
              form.titleAr
            }
            onChange={(
              event
            ) =>
              onChange(
                "titleAr",
                event.target
                  .value
              )
            }
            required
            disabled={saving}
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[var(--secondary)] disabled:opacity-60"
          />
        </div>
      </div>

      {/* Description */}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-[var(--primary)]">
            {t(
              "descriptionEn"
            )}
          </label>

          <textarea
            rows={6}
            value={
              form.descriptionEn
            }
            onChange={(
              event
            ) =>
              onChange(
                "descriptionEn",
                event.target
                  .value
              )
            }
            required
            disabled={saving}
            className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[var(--secondary)] disabled:opacity-60"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-[var(--primary)]">
            {t(
              "descriptionAr"
            )}
          </label>

          <textarea
            rows={6}
            dir="rtl"
            value={
              form.descriptionAr
            }
            onChange={(
              event
            ) =>
              onChange(
                "descriptionAr",
                event.target
                  .value
              )
            }
            required
            disabled={saving}
            className="mt-2 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[var(--secondary)] disabled:opacity-60"
          />
        </div>
      </div>

      {/* Category */}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-[var(--primary)]">
            {t(
              "categoryEn"
            )}
          </label>

          <input
            type="text"
            value={
              form.categoryEn
            }
            onChange={(
              event
            ) =>
              onChange(
                "categoryEn",
                event.target
                  .value
              )
            }
            required
            disabled={saving}
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[var(--secondary)] disabled:opacity-60"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-[var(--primary)]">
            {t(
              "categoryAr"
            )}
          </label>

          <input
            type="text"
            dir="rtl"
            value={
              form.categoryAr
            }
            onChange={(
              event
            ) =>
              onChange(
                "categoryAr",
                event.target
                  .value
              )
            }
            required
            disabled={saving}
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[var(--secondary)] disabled:opacity-60"
          />
        </div>
      </div>

      {/* Student Family Committee */}

      {isStudentClub && (
        <div className="mt-6">
          <label className="text-sm font-semibold text-[var(--primary)]">
            {t(
              "committee"
            )}
          </label>

          <select
            value={
              form.subcategoryId
            }
            onChange={(
              event
            ) =>
              onChange(
                "subcategoryId",
                event.target
                  .value
              )
            }
            required
            disabled={saving}
            className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-[var(--secondary)] disabled:opacity-60"
          >
            <option value="">
              {t(
                "chooseCommittee"
              )}
            </option>

            {studentClubCategories.map(
              (category) => (
                <option
                  key={
                    category
                  }
                  value={
                    category
                  }
                >
                  {t(
                    `committees.${category}`
                  )}
                </option>
              )
            )}
          </select>
        </div>
      )}

      {/* Date + Image */}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-[var(--primary)]">
            {t("date")}
          </label>

          <input
            type="date"
            value={
              form.date
            }
            onChange={(
              event
            ) =>
              onChange(
                "date",
                event.target
                  .value
              )
            }
            required
            disabled={saving}
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[var(--secondary)] disabled:opacity-60"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-[var(--primary)]">
            {t("image")}
          </label>

          <label className="mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 px-4 py-6 text-sm font-semibold text-[var(--muted)] transition hover:border-[var(--secondary)] hover:text-[var(--secondary)]">
            <ImagePlus className="h-5 w-5" />

            {imageFile
              ? imageFile.name
              : t(
                  "chooseImage"
                )}

            <input
              type="file"
              accept="image/*"
              onChange={
                onImageChange
              }
              disabled={saving}
              className="hidden"
            />
          </label>

          {imagePreview && (
            <img
              src={
                imagePreview
              }
              alt={t(
                "imagePreview"
              )}
              className="mt-4 h-48 w-full rounded-xl object-cover"
            />
          )}
        </div>
      </div>

      {/* Submit */}

      <button
        type="submit"
        disabled={saving}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-4 font-semibold text-white transition hover:bg-[var(--primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Save className="h-5 w-5" />

        {saving
          ? t("saving")
          : submitLabel}
      </button>
    </form>
  );
}
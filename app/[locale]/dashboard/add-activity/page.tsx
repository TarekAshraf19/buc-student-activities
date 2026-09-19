"use client";

import Link from "next/link";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  useTranslations,
} from "next-intl";

import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import ActivityForm, {
  type ActivityFormData,
} from "@/components/dashboard/ActivityForm";

import {
  useAuth,
} from "@/hooks/useAuth";

import {
  useLocale,
} from "@/hooks/useLocale";

import {
  useCurrentEntity,
} from "@/hooks/useCurrentEntity";

import {
  useCollegePlanActivityOptions,
} from "@/hooks/useCollegePlanActivityOptions";

import {
  uploadActivityImage,
} from "@/services/storage.service";

import {
  createActivity,
} from "@/services/activity.service";

const initialForm:
  ActivityFormData = {
    titleEn: "",
    titleAr: "",

    descriptionEn: "",
    descriptionAr: "",

    categoryEn: "",
    categoryAr: "",

    date: "",

    subcategoryId: "",

    plannedItemId: "",
  };

export default function AddActivityPage() {
  const router =
    useRouter();

  const t =
    useTranslations(
      "AddActivity"
    );

  const {
    locale,
    isArabic,
  } =
    useLocale();

  /*
   * =========================================================
   * AUTH
   * =========================================================
   */

  const {
    user,
    loading:
      authLoading,
  } =
    useAuth();

  /*
   * =========================================================
   * CURRENT DASHBOARD USER
   * =========================================================
   */

  const {
    entity,
    loading:
      entityLoading,
    error:
      entityError,
  } =
    useCurrentEntity();

  /*
   * Both uploader and dean
   * are allowed to add activities.
   */

  const canAddActivity =
    entity?.role ===
      "uploader" ||
    entity?.role ===
      "dean";

  /*
   * =========================================================
   * SCHOOL PLAN
   * =========================================================
   */

  const isCollege =
    entity?.scopeType ===
    "college";

  const {
    items:
      plannedActivities,

    loading:
      plannedActivitiesLoading,
  } =
    useCollegePlanActivityOptions(
      isCollege
        ? entity.scopeId
        : undefined
    );

  /*
   * =========================================================
   * FORM STATE
   * =========================================================
   */

  const [
    form,
    setForm,
  ] =
    useState<ActivityFormData>(
      initialForm
    );

  const [
    imageFile,
    setImageFile,
  ] =
    useState<File | null>(
      null
    );

  const [
    imagePreview,
    setImagePreview,
  ] =
    useState("");

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const BackArrow =
    isArabic
      ? ArrowRight
      : ArrowLeft;

  const loading =
    authLoading ||
    entityLoading;

  /*
   * =========================================================
   * FORM CHANGE
   * =========================================================
   */

  const handleChange = (
    field:
      keyof ActivityFormData,

    value: string
  ) => {
    setForm(
      (current) => ({
        ...current,

        [field]:
          value,
      })
    );
  };

  /*
   * =========================================================
   * IMAGE
   * =========================================================
   */

  const handleImageChange = (
    event:
      React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target
        .files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      alert(
        t(
          "invalidImage"
        )
      );

      event.target.value =
        "";

      return;
    }

    setImageFile(
      file
    );

    const previewUrl =
      URL.createObjectURL(
        file
      );

    setImagePreview(
      previewUrl
    );
  };

  /*
   * =========================================================
   * SUBMIT
   * =========================================================
   */

  const handleSubmit = async (
    event:
      React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!user) {
      router.replace(
        `/${locale}/login`
      );

      return;
    }

    /*
     * Account must have a valid
     * dashboardUsers mapping.
     */

    if (
      !entity ||
      !canAddActivity
    ) {
      return;
    }

    /*
     * Image is required.
     */

    if (!imageFile) {
      alert(
        t(
          "imageRequired"
        )
      );

      return;
    }

    /*
     * Student Activities requires
     * a committee/category.
     */

    if (
      entity.scopeType ===
        "student-club" &&
      !form.subcategoryId
    ) {
      alert(
        t(
          "committeeRequired"
        )
      );

      return;
    }

    setSaving(
      true
    );

    try {
      /*
       * Upload image inside the
       * current entity scope.
       */

      const imageUrl =
        await uploadActivityImage(
          imageFile,
          entity.scopeId
        );

      /*
       * Activity is always created
       * inside the logged-in user's scope.
       *
       * createActivity() is responsible
       * for forcing status = "pending".
       */

      await createActivity(
        {
          title: {
            en:
              form.titleEn,

            ar:
              form.titleAr,
          },

          description: {
            en:
              form.descriptionEn,

            ar:
              form.descriptionAr,
          },

          category: {
            en:
              form.categoryEn,

            ar:
              form.categoryAr,
          },

          date:
            form.date,

          image:
            imageUrl,

          createdBy:
            user.uid,

          scopeType:
            entity.scopeType,

          scopeId:
            entity.scopeId,

          ...(entity.scopeType ===
            "student-club" &&
          form.subcategoryId
            ? {
                subcategoryId:
                  form.subcategoryId,
              }
            : {}),
        },

        /*
         * School activities can optionally
         * be linked to a planned activity.
         */

        entity.scopeType ===
          "college" &&
        form.plannedItemId
          ? form.plannedItemId
          : undefined
      );

      router.push(
        `/${locale}/dashboard`
      );
    } catch (error) {
      console.error(
        "Error adding activity:",
        error
      );

      alert(
        t(
          "error"
        )
      );
    } finally {
      setSaving(
        false
      );
    }
  };

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 pt-24">
        <p className="text-[var(--muted)]">
          {t(
            "loading"
          )}
        </p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  /*
   * =========================================================
   * INVALID DASHBOARD ACCOUNT
   * =========================================================
   */

  if (
    entityError ||
    !entity ||
    !canAddActivity
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 pt-24">
        <p className="text-[var(--muted)]">
          {t(
            "entityNotFound"
          )}
        </p>
      </main>
    );
  }

  /*
   * =========================================================
   * PAGE
   * =========================================================
   */

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 pb-20 pt-32">
      <div className="mx-auto max-w-4xl">

        <Link
          href={`/${locale}/dashboard`}
          className="group inline-flex items-center gap-2 text-sm font-bold text-[var(--primary)] transition hover:text-[var(--secondary)]"
        >
          <BackArrow
            className={`h-4 w-4 transition-transform ${
              isArabic
                ? "group-hover:translate-x-1"
                : "group-hover:-translate-x-1"
            }`}
          />

          {t(
            "back"
          )}
        </Link>

        <div className="mt-10">
          <p className="text-sm font-semibold tracking-[0.2em] text-[var(--secondary)]">
            {t(
              "eyebrow"
            )}
          </p>

          <h1 className="mt-4 text-4xl font-bold text-[var(--primary)] md:text-5xl">
            {t(
              "title"
            )}
          </h1>

          <p className="mt-4 text-lg text-[var(--muted)]">
            {t(
              "description"
            )}
          </p>
        </div>

        <ActivityForm
          form={
            form
          }

          onChange={
            handleChange
          }

          imageFile={
            imageFile
          }

          imagePreview={
            imagePreview
          }

          onImageChange={
            handleImageChange
          }

          onSubmit={
            handleSubmit
          }

          saving={
            saving
          }

          submitLabel={t(
            "submit"
          )}

          scopeType={
            entity.scopeType
          }

          plannedActivities={
            plannedActivities
          }

          plannedActivitiesLoading={
            plannedActivitiesLoading
          }
        />
      </div>
    </main>
  );
}
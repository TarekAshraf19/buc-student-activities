"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
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
  useEditActivity,
} from "@/hooks/useEditActivity";

import {
  uploadActivityImage,
} from "@/services/storage.service";

const emptyForm:
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

export default function EditActivityPage() {
  const router =
    useRouter();

  const params =
    useParams();

  const t =
    useTranslations(
      "EditActivity"
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
   *
   * هنا بنعرف:
   * - role
   * - scopeType
   * - scopeId
   *
   * عشان نسمح للـ Dean فقط بالـ Edit.
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
   * =========================================================
   * ACTIVITY ID
   * =========================================================
   */

  const activityId =
    typeof params.id ===
    "string"
      ? params.id
      : "";

  /*
   * =========================================================
   * ACTIVITY
   * =========================================================
   */

  const {
    activity,
    loading:
      activityLoading,
    saving,
    error:
      activityError,
    saveActivity,
  } =
    useEditActivity(
      activityId
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
      emptyForm
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
    uploading,
    setUploading,
  ] =
    useState(false);

  const BackArrow =
    isArabic
      ? ArrowRight
      : ArrowLeft;

  /*
   * =========================================================
   * PERMISSIONS
   * =========================================================
   */

  const isDean =
    entity?.role ===
    "dean";

  /*
   * لازم Activity تكون من نفس
   * الـ scope بتاع الـ Dean.
   *
   * مثال:
   * Business Dean
   * لا يستطيع تعديل Nursing Activity.
   */
  const belongsToCurrentEntity =
    Boolean(
      activity &&
        entity &&
        activity.scopeType ===
          entity.scopeType &&
        activity.scopeId ===
          entity.scopeId
    );

  /*
   * =========================================================
   * LOGIN PROTECTION
   * =========================================================
   */

  useEffect(() => {
    if (
      !authLoading &&
      !user
    ) {
      router.replace(
        `/${locale}/login`
      );
    }
  }, [
    authLoading,
    user,
    locale,
    router,
  ]);

  /*
   * =========================================================
   * ROLE PROTECTION
   * =========================================================
   *
   * Uploader ممنوع يدخل Edit
   * حتى لو كتب الـ URL بنفسه.
   */

  useEffect(() => {
    if (
      authLoading ||
      entityLoading
    ) {
      return;
    }

    if (!user) {
      return;
    }

    if (
      entityError ||
      !entity ||
      entity.role !==
        "dean"
    ) {
      router.replace(
        `/${locale}/dashboard`
      );
    }
  }, [
    authLoading,
    entityLoading,
    entityError,
    user,
    entity,
    locale,
    router,
  ]);

  /*
   * =========================================================
   * SCOPE PROTECTION
   * =========================================================
   *
   * حتى الـ Dean نفسه ممنوع يعدل
   * Activity تابعة لـ School أخرى.
   */

  useEffect(() => {
    if (
      authLoading ||
      entityLoading ||
      activityLoading
    ) {
      return;
    }

    if (
      !user ||
      !entity ||
      !activity
    ) {
      return;
    }

    if (
      activity.scopeType !==
        entity.scopeType ||
      activity.scopeId !==
        entity.scopeId
    ) {
      router.replace(
        `/${locale}/dashboard`
      );
    }
  }, [
    authLoading,
    entityLoading,
    activityLoading,
    user,
    entity,
    activity,
    locale,
    router,
  ]);

  /*
   * =========================================================
   * LOAD FORM
   * =========================================================
   */

  useEffect(() => {
    if (!activity) {
      return;
    }

    setForm({
      titleEn:
        activity.title.en,

      titleAr:
        activity.title.ar,

      descriptionEn:
        activity.description.en,

      descriptionAr:
        activity.description.ar,

      categoryEn:
        activity.category.en,

      categoryAr:
        activity.category.ar,

      date:
        activity.date,

      subcategoryId:
        activity.subcategoryId ??
        "",

      plannedItemId:
        "",
    });

    setImagePreview(
      activity.image
    );
  }, [activity]);

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

    /*
     * حماية على مستوى الصفحة نفسها.
     *
     * Firestore Rules هتكون الحماية
     * النهائية بعد كده.
     */
    if (
      !user ||
      !activity ||
      !entity ||
      !isDean ||
      !belongsToCurrentEntity
    ) {
      return;
    }

    if (
      activity.scopeType ===
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

    try {
      let imageUrl =
        activity.image;

      /*
       * Upload new image
       * only if Dean selected one.
       */
      if (imageFile) {
        setUploading(
          true
        );

        imageUrl =
          await uploadActivityImage(
            imageFile,
            activity.scopeId
          );
      }

      const success =
        await saveActivity({
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

          ...(activity.scopeType ===
            "student-club" &&
          form.subcategoryId
            ? {
                subcategoryId:
                  form.subcategoryId,
              }
            : {}),
        });

      if (!success) {
        alert(
          t(
            "error"
          )
        );

        return;
      }

      router.push(
        `/${locale}/dashboard`
      );
    } catch (error) {
      console.error(
        "Error updating activity:",
        error
      );

      alert(
        t(
          "error"
        )
      );
    } finally {
      setUploading(
        false
      );
    }
  };

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  const loading =
    authLoading ||
    entityLoading ||
    activityLoading;

  const isSaving =
    saving ||
    uploading;

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
   * UPLOADER / INVALID ACCOUNT
   * =========================================================
   *
   * redirect effect هيبعته Dashboard.
   */

  if (
    entityError ||
    !entity ||
    !isDean
  ) {
    return null;
  }

  /*
   * =========================================================
   * ACTIVITY NOT FOUND
   * =========================================================
   */

  if (
    activityError ||
    !activity
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[var(--primary)]">
            {t(
              "notFound"
            )}
          </h1>

          <Link
            href={`/${locale}/dashboard`}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white"
          >
            <BackArrow className="h-5 w-5" />

            {t(
              "back"
            )}
          </Link>
        </div>
      </main>
    );
  }

  /*
   * =========================================================
   * WRONG SCHOOL
   * =========================================================
   */

  if (
    !belongsToCurrentEntity
  ) {
    return null;
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
          form={form}
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
            isSaving
          }
          submitLabel={t(
            "submit"
          )}
          scopeType={
            activity.scopeType
          }
          showPlannedActivity={
            false
          }
        />
      </div>
    </main>
  );
}
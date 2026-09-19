"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import {
  useTranslations,
} from "next-intl";

import CollegePlanForm from "@/components/dashboard/CollegePlanForm";

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
  useCollegePlan,
} from "@/hooks/useCollegePlan";

import type {
  College,
} from "@/types/college";

import {
  getCollegeById,
} from "@/services/college.service";

export default function CollegePlanPage() {
  const router =
    useRouter();

  const t =
    useTranslations(
      "CollegePlan"
    );

  const {
    locale,
    isArabic,
  } =
    useLocale();

  const {
    user,
    loading:
      authLoading,
  } =
    useAuth();

  const {
    entity,
    loading:
      entityLoading,
    error:
      entityError,
  } =
    useCurrentEntity();

  const [
    college,
    setCollege,
  ] =
    useState<College | null>(
      null
    );

  const [
    collegeLoading,
    setCollegeLoading,
  ] =
    useState(true);

  /*
   * =========================================================
   * PERMISSIONS
   * =========================================================
   */

  const isCollege =
    entity?.scopeType ===
    "college";

  const isDean =
    entity?.role ===
    "dean";

  const readOnly =
    !isDean;

  /*
   * =========================================================
   * LOAD SCHOOL BY SCOPE ID
   * =========================================================
   */

  useEffect(() => {
    let cancelled =
      false;

    if (entityLoading) {
      return;
    }

    if (
      !entity ||
      entity.scopeType !==
        "college"
    ) {
      setCollege(null);
      setCollegeLoading(
        false
      );

      return;
    }

    async function loadCollege() {
      try {
        setCollegeLoading(
          true
        );

        const data =
          await getCollegeById(
            entity!.scopeId
          );

        if (!cancelled) {
          setCollege(
            data
          );
        }
      } catch (error) {
        console.error(
          "Error loading school:",
          error
        );

        if (!cancelled) {
          setCollege(
            null
          );
        }
      } finally {
        if (!cancelled) {
          setCollegeLoading(
            false
          );
        }
      }
    }

    loadCollege();

    return () => {
      cancelled =
        true;
    };
  }, [
    entity,
    entityLoading,
  ]);

  /*
   * =========================================================
   * PLAN
   * =========================================================
   */

  const {
    planName,
    planUrl,
    file,

    academicYear,
    semester,
    items,

    loadingPlan,
    saving,

    hasCurrentPlan,
    isStartingNewPlan,

    changePlanName,
    changeAcademicYear,
    changeSemester,

    selectFile,
    clearFile,

    addItem,
    removeItem,
    updateItem,

    startNewPlan,
    cancelNewPlan,
    savePlan,
  } =
    useCollegePlan(
      college
    );

  const BackArrow =
    isArabic
      ? ArrowRight
      : ArrowLeft;

  const loading =
    authLoading ||
    entityLoading ||
    collegeLoading ||
    loadingPlan;

  /*
   * =========================================================
   * AUTH PROTECTION
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
   * FILE
   * =========================================================
   */

  const handleFileChange = (
    event:
      React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!isDean) {
      return;
    }

    const selectedFile =
      event.target
        .files?.[0];

    if (!selectedFile) {
      return;
    }

    if (
      selectedFile.type !==
      "application/pdf"
    ) {
      alert(
        t(
          "invalidFile"
        )
      );

      event.target.value =
        "";

      clearFile();

      return;
    }

    selectFile(
      selectedFile
    );
  };

  /*
   * =========================================================
   * SAVE
   * =========================================================
   */

  const handleSave = async (
    event:
      React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!isDean) {
      return;
    }

    if (
      !planName.trim()
    ) {
      alert(
        t(
          "nameRequired"
        )
      );

      return;
    }

    if (
      !academicYear.trim()
    ) {
      alert(
        t(
          "academicYearRequired"
        )
      );

      return;
    }

    if (
      !file &&
      !planUrl
    ) {
      alert(
        t(
          "fileRequired"
        )
      );

      return;
    }

    const invalidItem =
      items.some(
        (item) =>
          !item.title.en.trim() ||
          !item.title.ar.trim() ||
          !item.category.en.trim() ||
          !item.category.ar.trim() ||
          !item.plannedDate
      );

    if (invalidItem) {
      alert(
        t(
          "plannedActivityRequired"
        )
      );

      return;
    }

    const success =
      await savePlan();

    if (!success) {
      alert(
        t(
          "saveError"
        )
      );

      return;
    }

    alert(
      t(
        "saveSuccess"
      )
    );
  };

  /*
   * =========================================================
   * START NEW PLAN
   * =========================================================
   */

  const handleStartNewPlan =
    () => {
      if (!isDean) {
        return;
      }

      const confirmed =
        window.confirm(
          t(
            "startNewSemesterConfirm"
          )
        );

      if (!confirmed) {
        return;
      }

      startNewPlan();
    };

  /*
   * =========================================================
   * CANCEL NEW PLAN
   * =========================================================
   */

  const handleCancelNewPlan =
    () => {
      if (!isDean) {
        return;
      }

      const confirmed =
        window.confirm(
          t(
            "cancelNewSemesterConfirm"
          )
        );

      if (!confirmed) {
        return;
      }

      cancelNewPlan();
    };

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6">
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
   * INVALID ACCOUNT / NOT A SCHOOL
   * =========================================================
   */

  if (
    entityError ||
    !entity ||
    !isCollege ||
    !college
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6">
        <p className="text-[var(--muted)]">
          {t(
            "collegeNotFound"
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

          <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
            {t(
              "description"
            )}
          </p>
        </div>

        <CollegePlanForm
          planName={
            planName
          }

          planUrl={
            planUrl
          }

          file={
            file
          }

          academicYear={
            academicYear
          }

          semester={
            semester
          }

          items={
            items
          }

          saving={
            saving
          }

          loadingPlan={
            loadingPlan
          }

          hasCurrentPlan={
            hasCurrentPlan
          }

          isStartingNewPlan={
            isStartingNewPlan
          }

          readOnly={
            readOnly
          }

          onPlanNameChange={
            changePlanName
          }

          onAcademicYearChange={
            changeAcademicYear
          }

          onSemesterChange={
            changeSemester
          }

          onFileChange={
            handleFileChange
          }

          onAddItem={
            addItem
          }

          onRemoveItem={
            removeItem
          }

          onUpdateItem={
            updateItem
          }

          onSave={
            handleSave
          }

          onStartNewPlan={
            handleStartNewPlan
          }

          onCancelNewPlan={
            handleCancelNewPlan
          }
        />
      </div>
    </main>
  );
}
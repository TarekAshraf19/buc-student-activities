"use client";

import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import { useTranslations } from "next-intl";

import CollegePlanForm from "@/components/dashboard/CollegePlanForm";

import { useAuth } from "@/hooks/useAuth";
import { useLocale } from "@/hooks/useLocale";
import { useCurrentCollege } from "@/hooks/useCurrentCollege";
import { useCollegePlan } from "@/hooks/useCollegePlan";

export default function CollegePlanPage() {
  const t =
    useTranslations("CollegePlan");

  const {
    locale,
    isArabic,
  } = useLocale();

  const {
    user,
    loading: authLoading,
  } = useAuth();

  const {
    college,
    loading: collegeLoading,
  } = useCurrentCollege(
    user?.uid
  );

  const {
    planName,
    planUrl,
    file,

    academicYear,
    semester,
    items,

    loadingPlan,
    saving,
    deleting,

    changePlanName,
    changeAcademicYear,
    changeSemester,

    selectFile,
    clearFile,

    addItem,
    removeItem,
    updateItem,

    savePlan,
    removePlan,
  } = useCollegePlan(college);

  const BackArrow =
    isArabic
      ? ArrowRight
      : ArrowLeft;

  const loading =
    authLoading ||
    collegeLoading ||
    loadingPlan;

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (
      selectedFile.type !==
      "application/pdf"
    ) {
      alert(
        t("invalidFile")
      );

      event.target.value = "";

      clearFile();

      return;
    }

    selectFile(selectedFile);
  };

  const handleSave = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!planName.trim()) {
      alert(
        t("nameRequired")
      );

      return;
    }

    if (!academicYear.trim()) {
      alert(
        t("academicYearRequired")
      );

      return;
    }

    if (
      !file &&
      !planUrl
    ) {
      alert(
        t("fileRequired")
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
        t("saveError")
      );

      return;
    }

    alert(
      t("saveSuccess")
    );
  };

  const handleDelete =
    async () => {
      const confirmed =
        window.confirm(
          t("deleteConfirm")
        );

      if (!confirmed) {
        return;
      }

      const success =
        await removePlan();

      if (!success) {
        alert(
          t("deleteError")
        );

        return;
      }

      alert(
        t("deleteSuccess")
      );
    };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6">
        <p className="text-[var(--muted)]">
          {t("loading")}
        </p>
      </main>
    );
  }

  if (!college) {
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

          {t("back")}
        </Link>

        <div className="mt-10">
          <p className="text-sm font-semibold tracking-[0.2em] text-[var(--secondary)]">
            {t("eyebrow")}
          </p>

          <h1 className="mt-4 text-4xl font-bold text-[var(--primary)] md:text-5xl">
            {t("title")}
          </h1>

          <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
            {t("description")}
          </p>
        </div>

        <CollegePlanForm
          planName={planName}
          planUrl={planUrl}
          file={file}

          academicYear={
            academicYear
          }

          semester={
            semester
          }

          items={items}

          saving={saving}
          deleting={deleting}

          loadingPlan={
            loadingPlan
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

          onDelete={
            handleDelete
          }
        />
      </div>
    </main>
  );
}
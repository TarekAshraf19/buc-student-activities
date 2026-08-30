"use client";

import { useTranslations } from "next-intl";

import SectionActivities from "@/components/activities/SectionActivities";

import { useActivities } from "@/hooks/useActivities";

export default function ActivitiesPage() {
  const t = useTranslations("ActivitiesPage");

  const {
    activities,
    loading,
    error,
  } = useActivities();

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 pb-20 pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold tracking-[0.2em] text-[var(--secondary)]">
            {t("eyebrow")}
          </p>

          <h1 className="text-4xl font-bold text-[var(--primary)] md:text-6xl">
            {t("title")}
          </h1>

          <p className="mt-6 text-lg leading-8 text-[var(--muted)]">
            {t("description")}
          </p>
        </div>

        <div className="mt-14">
          <SectionActivities
            activities={activities}
            loading={loading}
            error={error}
            loadingLabel={t("loading")}
            errorLabel={t("error")}
            emptyLabel={t("empty")}
            viewLabel={t("viewDetails")}
          />
        </div>
      </div>
    </main>
  );
}
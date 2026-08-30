"use client";

import { MapPinned } from "lucide-react";
import { useTranslations } from "next-intl";

import SectionActivities from "@/components/activities/SectionActivities";
import { useActivitiesByScope } from "@/hooks/useActivitiesByScope";

export default function LocalRegionalActivitiesPage() {
  const t = useTranslations(
    "LocalRegionalActivities"
  );

  const {
    activities,
    loading,
    error,
  } = useActivitiesByScope(
    "local-regional"
  );

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 pb-20 pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--secondary)]/10 text-[var(--secondary)]">
            <MapPinned className="h-7 w-7" />
          </div>

          <p className="mt-6 text-sm font-semibold tracking-[0.2em] text-[var(--secondary)]">
            {t("eyebrow")}
          </p>

          <h1 className="mt-4 text-4xl font-bold text-[var(--primary)] md:text-6xl">
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
            viewLabel={t("viewActivity")}
          />
        </div>
      </div>
    </main>
  );
}
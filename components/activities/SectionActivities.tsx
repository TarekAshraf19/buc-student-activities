import ActivityGrid from "@/components/activities/ActivityGrid";

import type { Activity } from "@/types/activity";

type SectionActivitiesProps = {
  activities: Activity[];
  loading: boolean;
  error: boolean | string | null;

  loadingLabel: string;
  errorLabel: string;
  emptyLabel: string;
  viewLabel: string;
};

export default function SectionActivities({
  activities,
  loading,
  error,
  loadingLabel,
  errorLabel,
  emptyLabel,
  viewLabel,
}: SectionActivitiesProps) {
  if (loading) {
    return (
      <div className="py-20 text-center text-[var(--muted)]">
        {loadingLabel}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-red-500">
        {errorLabel}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="py-20 text-center text-[var(--muted)]">
        {emptyLabel}
      </div>
    );
  }

  return (
    <ActivityGrid
      activities={activities}
      viewLabel={viewLabel}
    />
  );
}
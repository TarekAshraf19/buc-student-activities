import ActivityCard from "@/components/activities/ActivityCard";

import type { Activity } from "@/types/activity";

type ActivityGridProps = {
  activities: Activity[];
  viewLabel: string;
};

export default function ActivityGrid({
  activities,
  viewLabel,
}: ActivityGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {activities.map(
        (activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            viewLabel={viewLabel}
          />
        )
      )}
    </div>
  );
}
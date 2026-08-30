"use client";

import { useEffect, useState } from "react";

import { getActivitiesByScope } from "@/services/activity.service";

import type {
  Activity,
  ActivityScopeType,
} from "@/types/activity";

export function useActivitiesByScope(
  scopeType: ActivityScopeType
) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadActivities() {
      try {
        setLoading(true);
        setError(null);

        const data = await getActivitiesByScope(scopeType);

        if (isMounted) {
          setActivities(data);
        }
      } catch (error) {
        console.error("Failed to load activities by scope:", error);

        if (isMounted) {
          setError("Failed to load activities.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadActivities();

    return () => {
      isMounted = false;
    };
  }, [scopeType]);

  return {
    activities,
    loading,
    error,
  };
}
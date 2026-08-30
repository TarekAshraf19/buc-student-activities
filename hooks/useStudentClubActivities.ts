"use client";

import { useEffect, useState } from "react";

import { getStudentClubActivitiesByCategory } from "@/services/activity.service";

import type {
  Activity,
  StudentClubCategory,
} from "@/types/activity";

export function useStudentClubActivities(
  category: StudentClubCategory
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

        const data =
          await getStudentClubActivitiesByCategory(category);

        if (isMounted) {
          setActivities(data);
        }
      } catch (error) {
        console.error(
          "Failed to load student club activities:",
          error
        );

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
  }, [category]);

  return {
    activities,
    loading,
    error,
  };
}
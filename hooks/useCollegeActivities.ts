"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type { Activity } from "@/types/activity";

import {
  deleteActivity,
  getActivitiesByScopeId,
} from "@/services/activity.service";

export function useCollegeActivities(
  collegeId?: string
) {
  const [activities, setActivities] =
    useState<Activity[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const loadActivities = useCallback(
    async () => {
      if (!collegeId) {
        setActivities([]);
        setLoading(false);
        setError(false);

        return;
      }

      try {
        setLoading(true);
        setError(false);

        const data =
          await getActivitiesByScopeId(
            "college",
            collegeId
          );

        setActivities(data);
      } catch (error) {
        console.error(
          "Error loading college activities:",
          error
        );

        setActivities([]);
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [collegeId]
  );

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const removeActivity = async (
    activityId: string
  ): Promise<boolean> => {
    try {
      setDeletingId(activityId);

      await deleteActivity(
        activityId
      );

      setActivities(
        (currentActivities) =>
          currentActivities.filter(
            (activity) =>
              activity.id !==
              activityId
          )
      );

      return true;
    } catch (error) {
      console.error(
        "Error deleting activity:",
        error
      );

      return false;
    } finally {
      setDeletingId(null);
    }
  };

  return {
    activities,
    loading,
    error,
    deletingId,
    removeActivity,
    refreshActivities:
      loadActivities,
  };
}
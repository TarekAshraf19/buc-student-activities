"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type {
  Activity,
  ActivityScopeType,
} from "@/types/activity";

import {
  deleteActivity,
  getActivitiesByScopeId,
} from "@/services/activity.service";

export function useEntityActivities(
  scopeType?: ActivityScopeType,
  scopeId?: string
) {
  const [activities, setActivities] =
    useState<Activity[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const loadActivities =
    useCallback(async () => {
      if (!scopeType || !scopeId) {
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
            scopeType,
            scopeId
          );

        setActivities(data);
      } catch (error) {
        console.error(
          "Error loading entity activities:",
          error
        );

        setActivities([]);
        setError(true);
      } finally {
        setLoading(false);
      }
    }, [scopeType, scopeId]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const removeActivity = async (
    activityId: string
  ): Promise<boolean> => {
    try {
      setDeletingId(activityId);

      await deleteActivity(activityId);

      setActivities((current) =>
        current.filter(
          (activity) =>
            activity.id !== activityId
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
    refreshActivities: loadActivities,
  };
}
"use client";

import {
  useEffect,
  useState,
} from "react";

import type { Activity } from "@/types/activity";

import {
  getActivityById,
  updateActivity,
  type UpdateActivityData,
} from "@/services/activity.service";

export function useEditActivity(
  activityId: string
) {
  const [activity, setActivity] =
    useState<Activity | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!activityId) {
      setLoading(false);
      return;
    }

    async function loadActivity() {
      try {
        setLoading(true);
        setError(false);

        const data =
          await getActivityById(
            activityId
          );

        if (!isMounted) {
          return;
        }

        if (!data) {
          setActivity(null);
          setError(true);
          return;
        }

        setActivity(data);
      } catch (error) {
        console.error(
          "Error loading activity:",
          error
        );

        if (isMounted) {
          setActivity(null);
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadActivity();

    return () => {
      isMounted = false;
    };
  }, [activityId]);

  const saveActivity = async (
    data: UpdateActivityData
  ): Promise<boolean> => {
    if (!activityId) {
      return false;
    }

    try {
      setSaving(true);

      await updateActivity(
        activityId,
        data
      );

      setActivity((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          ...data,
        };
      });

      return true;
    } catch (error) {
      console.error(
        "Error updating activity:",
        error
      );

      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    activity,
    loading,
    saving,
    error,
    saveActivity,
  };
}
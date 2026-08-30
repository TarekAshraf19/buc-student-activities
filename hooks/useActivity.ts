"use client";

import { useEffect, useState } from "react";

import type { Activity } from "@/types/activity";
import { getActivityById } from "@/services/activity.service";

export function useActivity(
  activityId: string
) {
  const [activity, setActivity] =
    useState<Activity | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    if (!activityId) {
      setLoading(false);
      return;
    }

    const loadActivity = async () => {
      try {
        setLoading(true);
        setError(false);

        const data =
          await getActivityById(
            activityId
          );

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

        setActivity(null);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
  }, [activityId]);

  return {
    activity,
    loading,
    error,
  };
}
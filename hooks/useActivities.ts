"use client";

import { useEffect, useState } from "react";

import type { Activity } from "@/types/activity";
import { getActivities } from "@/services/activity.service";

export function useActivities() {
  const [activities, setActivities] =
    useState<Activity[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        setError(false);

        const data =
          await getActivities();

        setActivities(data);
      } catch (error) {
        console.error(
          "Error loading activities:",
          error
        );

        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  return {
    activities,
    loading,
    error,
  };
}
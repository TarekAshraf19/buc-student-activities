"use client";

import {
  useEffect,
  useState,
} from "react";

import type { College } from "@/types/college";
import type { Activity } from "@/types/activity";

import {
  getCollegeById,
} from "@/services/college.service";

import {
  getActivitiesByScopeId,
} from "@/services/activity.service";

export function useCollegeDetails(
  collegeId: string
) {
  const [college, setCollege] =
    useState<College | null>(null);

  const [activities, setActivities] =
    useState<Activity[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!collegeId) {
      setLoading(false);
      return;
    }

    async function loadCollegeDetails() {
      try {
        setLoading(true);
        setError(false);

        const [
          collegeData,
          activitiesData,
        ] = await Promise.all([
          getCollegeById(collegeId),

          getActivitiesByScopeId(
            "college",
            collegeId
          ),
        ]);

        if (!isMounted) {
          return;
        }

        if (!collegeData) {
          setCollege(null);
          setActivities([]);
          setError(true);

          return;
        }

        setCollege(collegeData);
        setActivities(activitiesData);
      } catch (error) {
        console.error(
          "Error loading college details:",
          error
        );

        if (isMounted) {
          setCollege(null);
          setActivities([]);
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCollegeDetails();

    return () => {
      isMounted = false;
    };
  }, [collegeId]);

  return {
    college,
    activities,
    loading,
    error,
  };
}
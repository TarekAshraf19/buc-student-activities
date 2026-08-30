"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  getStructuredCollegePlan,
} from "@/services/college-plan.service";

import type {
  CollegePlanItem,
} from "@/types/college-plan";

export function useCollegePlanActivityOptions(
  collegeId?: string
) {
  const [
    items,
    setItems,
  ] = useState<
    CollegePlanItem[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  useEffect(() => {
    let active = true;

    async function loadPlan() {
      if (!collegeId) {
        setItems([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const plan =
          await getStructuredCollegePlan(
            collegeId
          );

        if (!active) {
          return;
        }

        if (!plan) {
          setItems([]);
          return;
        }

        /*
         * Only activities that have
         * not been linked yet.
         */
        const availableItems =
          plan.items.filter(
            (item) =>
              !item.activityId &&
              item.status !==
                "cancelled"
          );

        setItems(
          availableItems
        );
      } catch (error) {
        console.error(
          "Failed to load college plan:",
          error
        );

        if (active) {
          setError(
            "Failed to load college plan"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPlan();

    return () => {
      active = false;
    };
  }, [collegeId]);

  return {
    items,
    loading,
    error,
  };
}
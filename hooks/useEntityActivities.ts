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
  approveActivity,
  declineActivity,
  deleteActivity,
  getDashboardActivitiesByScopeId,
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

  const [approvingId, setApprovingId] =
    useState<string | null>(null);

  const [decliningId, setDecliningId] =
    useState<string | null>(null);

  /*
   * =========================================================
   * LOAD DASHBOARD ACTIVITIES
   * =========================================================
   *
   * Dashboard لازم يشوف:
   * pending
   * approved
   * declined
   *
   * Firestore Rules هي اللي هتضمن
   * إن المستخدم يشوف scope بتاعه فقط.
   */

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
          await getDashboardActivitiesByScopeId(
            scopeType,
            scopeId
          );

        setActivities(data);
      } catch (error) {
        console.error(
          "Error loading dashboard activities:",
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

  /*
   * =========================================================
   * DELETE
   * =========================================================
   *
   * Dean فقط.
   *
   * الـ UI هيخفي الزر عن Uploader،
   * والـ Firestore Rules النهائية
   * هتمنع العملية نفسها.
   */

  const removeActivity = async (
    activityId: string
  ): Promise<boolean> => {
    try {
      setDeletingId(activityId);

      await deleteActivity(
        activityId
      );

      setActivities(
        (current) =>
          current.filter(
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

  /*
   * =========================================================
   * APPROVE
   * =========================================================
   *
   * Dean فقط.
   */

  const approve = async (
    activityId: string,
    reviewerId: string
  ): Promise<boolean> => {
    try {
      setApprovingId(
        activityId
      );

      await approveActivity(
        activityId,
        reviewerId
      );

      /*
       * نعمل refresh بعد الـ approval
       * عشان ناخد reviewedAt الحقيقي
       * من Firestore.
       */
      await loadActivities();

      return true;
    } catch (error) {
      console.error(
        "Error approving activity:",
        error
      );

      return false;
    } finally {
      setApprovingId(null);
    }
  };

  /*
   * =========================================================
   * DECLINE
   * =========================================================
   *
   * Dean فقط.
   */

  const decline = async (
    activityId: string,
    reviewerId: string,
    declineReason: string
  ): Promise<boolean> => {
    try {
      setDecliningId(
        activityId
      );

      await declineActivity(
        activityId,
        reviewerId,
        declineReason
      );

      await loadActivities();

      return true;
    } catch (error) {
      console.error(
        "Error declining activity:",
        error
      );

      return false;
    } finally {
      setDecliningId(null);
    }
  };

  return {
    activities,

    loading,
    error,

    deletingId,
    approvingId,
    decliningId,

    removeActivity,
    approveActivity: approve,
    declineActivity: decline,

    refreshActivities:
      loadActivities,
  };
}
"use client";

import { useEffect, useState } from "react";

import type { College } from "@/types/college";
import { getCollegeByUserId } from "@/services/college.service";

export function useCurrentCollege(
  userId?: string
) {
  const [college, setCollege] =
    useState<College | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    if (!userId) {
      setCollege(null);
      setLoading(false);
      return;
    }

    const loadCollege = async () => {
      try {
        setLoading(true);
        setError(false);

        const data =
          await getCollegeByUserId(
            userId
          );

        setCollege(data);
      } catch (error) {
        console.error(
          "Error loading current college:",
          error
        );

        setCollege(null);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadCollege();
  }, [userId]);

  return {
    college,
    loading,
    error,
  };
}
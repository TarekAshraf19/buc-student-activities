"use client";

import { useEffect, useState } from "react";

import type { College } from "@/types/college";
import { getColleges } from "@/services/college.service";

export function useHomeColleges(
  limit = 4
) {
  const [colleges, setColleges] =
    useState<College[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  useEffect(() => {
    const loadColleges = async () => {
      try {
        setLoading(true);
        setError(false);

        const data =
          await getColleges();

        setColleges(
          data.slice(0, limit)
        );
      } catch (error) {
        console.error(
          "Error loading home colleges:",
          error
        );

        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadColleges();
  }, [limit]);

  return {
    colleges,
    loading,
    error,
  };
}
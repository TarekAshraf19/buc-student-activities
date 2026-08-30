"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";

import {
  getCurrentEntity,
  type CurrentEntity,
} from "@/services/entity.service";

export function useCurrentEntity() {
  const { user, loading: authLoading } = useAuth();

  const [entity, setEntity] =
    useState<CurrentEntity | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadEntity() {
      if (authLoading) {
        return;
      }

      if (!user) {
        if (isMounted) {
          setEntity(null);
          setLoading(false);
        }

        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await getCurrentEntity(user.uid);

        if (isMounted) {
          setEntity(data);
        }
      } catch (error) {
        console.error(
          "Failed to load current entity:",
          error
        );

        if (isMounted) {
          setError("Failed to load user entity.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadEntity();

    return () => {
      isMounted = false;
    };
  }, [user, authLoading]);

  return {
    entity,
    loading: authLoading || loading,
    error,
  };
}
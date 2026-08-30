"use client";

import { useState } from "react";

import {
  AccountInactiveError,
  login,
} from "@/services/auth.service";

export function useLogin() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleLogin =
    async () => {
      try {
        setLoading(true);
        setError("");

        await login(
          email,
          password
        );

        return true;
      } catch (error) {
        console.error(
          "Login error:",
          error
        );

        if (
          error instanceof
          AccountInactiveError
        ) {
          setError(
            "accountInactive"
          );

          return false;
        }

        setError(
          "invalidCredentials"
        );

        return false;
      } finally {
        setLoading(false);
      }
    };

  return {
    email,
    password,
    loading,
    error,

    setEmail,
    setPassword,

    handleLogin,
  };
}
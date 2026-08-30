"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { useAuth } from "@/hooks/useAuth";
import { useLocale } from "@/hooks/useLocale";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const router = useRouter();
  const t = useTranslations("Dashboard");

  const { locale } = useLocale();

  const {
    user,
    loading,
  } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(
        `/${locale}/login`
      );
    }
  }, [
    loading,
    user,
    locale,
    router,
  ]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <p className="text-[var(--muted)]">
          {t("loading")}
        </p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { useLocale } from "@/hooks/useLocale";
import { useLogin } from "@/hooks/useLogin";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("Login");

  const { locale } = useLocale();

  const {
    email,
    password,
    loading,
    error,
    setEmail,
    setPassword,
    handleLogin,
  } = useLogin();

  const onSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const success = await handleLogin();

    if (!success) {
      return;
    }

    router.push(`/${locale}/dashboard`);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 py-32">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-xl md:p-10">
        {/* Header */}

        <div className="text-center">
          <p className="text-sm font-semibold tracking-[0.2em] text-[var(--secondary)]">
            BUC
          </p>

          <h1 className="mt-3 text-3xl font-bold text-[var(--primary)]">
            {t("title")}
          </h1>

          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            {t("description")}
          </p>
        </div>

        {/* Form */}

        <form
          onSubmit={onSubmit}
          className="mt-8 space-y-5"
        >
          {/* Email */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--primary)]">
              {t("emailLabel")}
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder={t("emailPlaceholder")}
              required
              disabled={loading}
              autoComplete="email"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[var(--primary)] outline-none transition focus:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary)]/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Password */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--primary)]">
              {t("passwordLabel")}
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="••••••••"
              required
              disabled={loading}
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-[var(--primary)] outline-none transition focus:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary)]/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Error */}

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
              {t(error)}
            </p>
          )}

          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[var(--primary)] px-5 py-3.5 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? t("loading")
              : t("submit")}
          </button>
        </form>

        {/* Back */}

        <div className="mt-7 text-center">
          <Link
            href={`/${locale}`}
            className="text-sm font-semibold text-[var(--secondary)] transition hover:opacity-70"
          >
            {t("backToWebsite")}
          </Link>
        </div>
      </div>
    </main>
  );
}
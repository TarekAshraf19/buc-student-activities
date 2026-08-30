"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { useLocale } from "@/hooks/useLocale";

export default function CTA() {
  const t = useTranslations("CTA");

  const {
    locale,
    isArabic,
  } = useLocale();

  const Arrow =
    isArabic
      ? ArrowLeft
      : ArrowRight;

  return (
    <section className="bg-[var(--background)] px-6 py-16 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-[var(--primary)] px-6 py-14 text-center sm:px-10 md:py-20">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[var(--secondary)]/20 blur-3xl" />

          <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
              <Sparkles className="h-6 w-6" />
            </div>

            <p className="text-xs font-semibold tracking-[0.2em] text-blue-300 md:text-sm">
              {t("eyebrow")}
            </p>

            <h2 className="mt-4 text-2xl font-bold leading-tight text-white md:text-4xl">
              {t("title")}
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/70 md:text-base">
              {t("description")}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href={`/${locale}/activities`}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[var(--primary)] transition duration-300 hover:scale-105 hover:bg-slate-100"
              >
                {t("primaryButton")}

                <Arrow className="h-4 w-4" />
              </Link>

              <Link
                href={`/${locale}/colleges`}
                className="inline-flex items-center rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-white/10"
              >
                {t("secondaryButton")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
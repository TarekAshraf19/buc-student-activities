"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { useLocale } from "@/hooks/useLocale";
import { useHomeColleges } from "@/hooks/useHomeColleges";

export default function Colleges() {
  const t = useTranslations("Colleges");

  const {
    locale,
    isArabic,
  } = useLocale();

  const {
    colleges,
    loading,
    error,
  } = useHomeColleges(4);

  const Arrow =
    isArabic
      ? ArrowLeft
      : ArrowRight;

  return (
    <section className="bg-white px-6 py-20 md:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}

        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--secondary)]/10 text-[var(--secondary)]">
              <GraduationCap className="h-6 w-6" />
            </div>
          </div>

          <p className="text-sm font-semibold tracking-[0.2em] text-[var(--secondary)]">
            {t("eyebrow")}
          </p>

          <h2 className="mt-4 text-3xl font-bold leading-tight text-[var(--primary)] md:text-5xl">
            {t("title")}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[var(--muted)] md:text-lg">
            {t("description")}
          </p>
        </div>

        {/* Loading */}

        {loading && (
          <div className="py-16 text-center text-[var(--muted)]">
            {t("loading")}
          </div>
        )}

        {/* Error */}

        {error && (
          <div className="py-16 text-center text-red-500">
            {t("error")}
          </div>
        )}

        {/* Colleges */}

        {!loading &&
          !error &&
          colleges.length > 0 && (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {colleges.map((college) => (
                <article
                  key={college.id}
                  className="group overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--background)] transition duration-300 hover:-translate-y-2 hover:border-transparent hover:shadow-xl"
                >
                  {/* Image */}

                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={college.image}
                      alt={college.name[locale]}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary)]/60 via-transparent to-transparent" />
                  </div>

                  {/* Content */}

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-[var(--primary)] transition group-hover:text-[var(--secondary)]">
                      {college.name[locale]}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--muted)]">
                      {college.description[locale]}
                    </p>

                    <Link
                      href={`/${locale}/colleges/${college.id}`}
                      className="group/link mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--primary)] transition hover:text-[var(--secondary)]"
                    >
                      {t("explore")}

                      <Arrow
                        className={`h-4 w-4 transition-transform ${
                          isArabic
                            ? "group-hover/link:-translate-x-1"
                            : "group-hover/link:translate-x-1"
                        }`}
                      />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

        {/* Empty */}

        {!loading &&
          !error &&
          colleges.length === 0 && (
            <div className="py-16 text-center text-[var(--muted)]">
              {t("empty")}
            </div>
          )}

        {/* View All */}

        {!loading &&
          !error &&
          colleges.length > 0 && (
            <div className="mt-12 flex justify-center">
              <Link
                href={`/${locale}/colleges`}
                className="group inline-flex items-center gap-2 rounded-xl border border-[var(--primary)] px-6 py-3 font-semibold text-[var(--primary)] transition duration-300 hover:bg-[var(--primary)] hover:text-white"
              >
                {t("viewAll")}

                <Arrow
                  className={`h-5 w-5 transition-transform ${
                    isArabic
                      ? "group-hover:-translate-x-1"
                      : "group-hover:translate-x-1"
                  }`}
                />
              </Link>
            </div>
          )}
      </div>
    </section>
  );
}
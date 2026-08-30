"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Building2,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { useColleges } from "@/hooks/useColleges";
import { useLocale } from "@/hooks/useLocale";

export default function CollegesPage() {
  const t = useTranslations("CollegesPage");

  const {
    locale,
    isArabic,
  } = useLocale();

  const Arrow =
    isArabic
      ? ArrowLeft
      : ArrowRight;

  const {
    colleges,
    loading,
    error,
  } = useColleges();

  return (
    <main className="min-h-screen bg-[var(--background)] px-6 pb-20 pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold tracking-[0.2em] text-[var(--secondary)]">
            {t("eyebrow")}
          </p>

          <h1 className="text-4xl font-bold text-[var(--primary)] md:text-6xl">
            {t("title")}
          </h1>

          <p className="mt-6 text-lg leading-8 text-[var(--muted)]">
            {t("description")}
          </p>
        </div>

        {loading && (
          <div className="py-20 text-center text-[var(--muted)]">
            {t("loading")}
          </div>
        )}

        {error && (
          <div className="py-20 text-center text-red-500">
            {t("error")}
          </div>
        )}

        {!loading &&
          !error &&
          colleges.length > 0 && (
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {colleges.map(
                (college) => (
                  <article
                    key={college.id}
                    className="group overflow-hidden rounded-[2rem] bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={college.image}
                        alt={
                          college.name[
                            locale
                          ]
                        }
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                      <div className="absolute bottom-5 left-5 flex items-center gap-2 text-white">
                        <Building2 className="h-5 w-5" />

                        <span className="text-sm font-semibold">
                          {t("college")}
                        </span>
                      </div>
                    </div>

                    <div className="p-7">
                      <h2 className="text-2xl font-bold text-[var(--primary)] transition group-hover:text-[var(--secondary)]">
                        {
                          college.name[
                            locale
                          ]
                        }
                      </h2>

                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-[var(--muted)]">
                        {
                          college
                            .description[
                            locale
                          ]
                        }
                      </p>

                      <Link
                        href={`/${locale}/colleges/${college.id}`}
                        className="group/link mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--primary)] transition hover:text-[var(--secondary)]"
                      >
                        {t(
                          "viewCollege"
                        )}

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
                )
              )}
            </div>
          )}

        {!loading &&
          !error &&
          colleges.length === 0 && (
            <div className="py-20 text-center text-[var(--muted)]">
              {t("empty")}
            </div>
          )}
      </div>
    </main>
  );
}
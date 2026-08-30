"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { useLocale } from "@/hooks/useLocale";

const categories = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1200&q=80",
    href: "/activities",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
    href: "/local-regional-activities",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    href: "/student-clubs",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=80",
    href: "/scientific-societies",
  },
];

export default function ExploreStudentLife() {
  const t = useTranslations(
    "ExploreStudentLife"
  );

  const {
    locale,
    isArabic,
  } = useLocale();

  const Arrow =
    isArabic
      ? ArrowLeft
      : ArrowRight;

  return (
    <section className="bg-white px-6 py-16 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
          <p className="mb-4 text-sm font-semibold tracking-[0.2em] text-[var(--secondary)]">
            {t("eyebrow")}
          </p>

          <h2 className="text-3xl font-bold leading-tight text-[var(--primary)] md:text-5xl">
            {t("title")}
          </h2>

          <p className="mt-5 text-base leading-7 text-[var(--muted)] md:text-lg">
            {t("description")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${locale}${category.href}`}
              className="group relative min-h-[280px] overflow-hidden rounded-[1.5rem]"
            >
              <img
                src={category.image}
                alt={t(
                  `items.${category.id}.title`
                )}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold">
                      {t(
                        `items.${category.id}.title`
                      )}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/80">
                      {t(
                        `items.${category.id}.description`
                      )}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[var(--primary)] transition duration-300 group-hover:scale-110">
                    <Arrow className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
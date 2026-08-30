"use client";

import {
  Trophy,
  Users,
  CalendarDays,
  Building2,
} from "lucide-react";
import { useTranslations } from "next-intl";

const stats = [
  {
    id: "students",
    icon: Users,
  },
  {
    id: "activities",
    icon: CalendarDays,
  },
  {
    id: "colleges",
    icon: Building2,
  },
  {
    id: "achievements",
    icon: Trophy,
  },
];

export default function Achievements() {
  const t = useTranslations("Achievements");

  return (
    <section className="relative overflow-hidden bg-[var(--primary)] px-6 py-20 md:py-24">
      <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-[var(--secondary)]/20 blur-3xl" />

      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold tracking-[0.2em] text-blue-300">
            {t("eyebrow")}
          </p>

          <h2 className="text-3xl font-bold leading-tight text-white md:text-5xl">
            {t("title")}
          </h2>

          <p className="mt-5 text-base leading-7 text-white/70 md:text-lg">
            {t("description")}
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.id}
                className="rounded-[1.75rem] border border-white/10 bg-white/5 p-7 text-center backdrop-blur-sm transition duration-300 hover:-translate-y-2 hover:bg-white/10"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
                  <Icon className="h-7 w-7" />
                </div>

                <p className="mt-6 text-4xl font-bold text-white md:text-5xl">
                  {t(`stats.${stat.id}.number`)}
                </p>

                <p className="mt-3 text-sm font-medium text-white/65">
                  {t(`stats.${stat.id}.label`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
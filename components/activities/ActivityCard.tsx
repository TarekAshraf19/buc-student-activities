"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
} from "lucide-react";

import { useLocale } from "@/hooks/useLocale";

import {
  getCollegeNameById,
} from "@/services/activity.service";

import type {
  Activity,
} from "@/types/activity";

type ActivityCardProps = {
  activity: Activity;
  viewLabel: string;
};

type CollegeName = {
  en: string;
  ar: string;
};

export default function ActivityCard({
  activity,
  viewLabel,
}: ActivityCardProps) {
  const {
    locale,
    isArabic,
  } = useLocale();

  const [
    collegeName,
    setCollegeName,
  ] =
    useState<CollegeName | null>(
      null
    );

  const Arrow =
    isArabic
      ? ArrowLeft
      : ArrowRight;

  useEffect(() => {
    if (
      activity.scopeType !==
        "college" ||
      !activity.scopeId
    ) {
      setCollegeName(null);
      return;
    }

    const loadCollegeName =
      async () => {
        try {
          const name =
            await getCollegeNameById(
              activity.scopeId
            );

          setCollegeName(name);
        } catch (error) {
          console.error(
            "Error loading college name:",
            error
          );

          setCollegeName(null);
        }
      };

    loadCollegeName();
  }, [
    activity.scopeType,
    activity.scopeId,
  ]);

  return (
    <article className="group overflow-hidden rounded-[2rem] bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="relative h-64 overflow-hidden">
        <img
          src={activity.image}
          alt={
            activity.title[
              locale
            ]
          }
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        <span className="absolute start-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-[var(--primary)] backdrop-blur-sm">
          {
            activity.category[
              locale
            ]
          }
        </span>
      </div>

      <div className="p-7">
        <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
          <CalendarDays className="h-4 w-4" />

          <span>
            {activity.date}
          </span>
        </div>

        {collegeName && (
          <p className="mt-2 text-sm font-semibold text-[var(--primary)]">
            {
              collegeName[
                locale
              ]
            }
          </p>
        )}

        <h2 className="mt-5 text-xl font-bold text-[var(--primary)]">
          {
            activity.title[
              locale
            ]
          }
        </h2>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--muted)]">
          {
            activity.description[
              locale
            ]
          }
        </p>

        <Link
          href={`/${locale}/activities/${activity.id}`}
          className="group/link mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--primary)] transition hover:text-[var(--secondary)]"
        >
          {viewLabel}

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
  );
}
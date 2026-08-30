"use client";

import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Layers3,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { useLocale } from "@/hooks/useLocale";
import { useActivities } from "@/hooks/useActivities";
import { useCalendar } from "@/hooks/useCalendar";

export default function UpcomingEvents() {
  const t = useTranslations(
    "UpcomingEvents"
  );

  const {
    locale,
    isArabic,
  } = useLocale();

  const {
    activities,
    loading,
    error,
  } = useActivities();

  const {
    calendarDays,
    eventsByDay,
    monthName,
    previousMonth,
    nextMonth,
    isToday,
  } = useCalendar(
    activities,
    locale
  );

  const weekDays = [
    t("sunday"),
    t("monday"),
    t("tuesday"),
    t("wednesday"),
    t("thursday"),
    t("friday"),
    t("saturday"),
  ];

  return (
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-[0.2em] text-[var(--secondary)]">
            {t("eyebrow")}
          </p>

          <h2 className="mt-4 text-4xl font-bold text-[var(--primary)] md:text-5xl">
            {t("title")}
          </h2>

          <p className="mt-5 text-lg leading-8 text-[var(--muted)]">
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

        {!loading && !error && (
          <div className="mx-auto mt-14 max-w-6xl overflow-hidden rounded-[2rem] border border-gray-100 bg-[var(--background)] p-4 shadow-sm md:p-8">
            <div className="mb-8 flex items-center justify-between">
              <button
                type="button"
                onClick={
                  isArabic
                    ? nextMonth
                    : previousMonth
                }
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[var(--primary)] shadow-sm transition hover:bg-[var(--primary)] hover:text-white"
                aria-label={t(
                  "previousMonth"
                )}
              >
                {isArabic ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronLeft className="h-5 w-5" />
                )}
              </button>

              <h3 className="text-xl font-bold text-[var(--primary)] md:text-3xl">
                {monthName}
              </h3>

              <button
                type="button"
                onClick={
                  isArabic
                    ? previousMonth
                    : nextMonth
                }
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[var(--primary)] shadow-sm transition hover:bg-[var(--primary)] hover:text-white"
                aria-label={t(
                  "nextMonth"
                )}
              >
                {isArabic ? (
                  <ChevronLeft className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="grid grid-cols-7 border-b border-gray-200">
              {weekDays.map(
                (day, index) => (
                  <div
                    key={`${day}-${index}`}
                    className="pb-4 text-center text-xs font-bold text-[var(--muted)] md:text-sm"
                  >
                    {day}
                  </div>
                )
              )}
            </div>

            <div className="grid grid-cols-7">
              {calendarDays.map(
                (day, index) => {
                  if (day === null) {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="min-h-[90px] border-b border-r border-gray-200 md:min-h-[130px]"
                      />
                    );
                  }

                  const dayEvents =
                    eventsByDay[day] ?? [];

                  return (
                    <div
                      key={day}
                      className="min-h-[90px] border-b border-r border-gray-200 p-2 md:min-h-[130px] md:p-3"
                    >
                      <div className="flex justify-center md:justify-start">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                            isToday(day)
                              ? "bg-[var(--primary)] text-white"
                              : "text-[var(--primary)]"
                          }`}
                        >
                          {day}
                        </span>
                      </div>

                      {dayEvents.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {dayEvents
                            .slice(0, 2)
                            .map(
                              (activity) => (
                                <Link
                                  key={activity.id}
                                  href={`/${locale}/activities/${activity.id}`}
                                  title={
                                    activity.title[
                                      locale
                                    ]
                                  }
                                  className="block truncate rounded-lg bg-[var(--secondary)]/10 px-2 py-1 text-[10px] font-semibold text-[var(--secondary)] transition hover:bg-[var(--secondary)] hover:text-white md:text-xs"
                                >
                                  {
                                    activity.title[
                                      locale
                                    ]
                                  }
                                </Link>
                              )
                            )}

                          {dayEvents.length >
                            2 && (
                            <span className="block px-1 text-[10px] font-semibold text-[var(--muted)]">
                              +
                              {dayEvents.length -
                                2}{" "}
                              {t("more")}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="mt-10 text-center">
            <Link
              href={`/${locale}/activities`}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)]"
            >
              <CalendarDays className="h-5 w-5" />

              {t("viewAll")}
            </Link>
          </div>
        )}

        {!loading &&
          !error &&
          activities.length > 0 && (
            <div className="mt-8 flex items-center justify-center gap-3 text-sm text-[var(--muted)]">
              <Layers3 className="h-4 w-4 text-[var(--secondary)]" />

              <span>
                {t("eventHint")}
              </span>
            </div>
          )}
      </div>
    </section>
  );
}
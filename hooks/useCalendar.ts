"use client";

import {
  useMemo,
  useState,
} from "react";

import type { Activity } from "@/types/activity";

type Locale = "en" | "ar";

export function useCalendar(
  activities: Activity[],
  locale: Locale
) {
  const [currentDate, setCurrentDate] =
    useState(() => {
      const today = new Date();

      return new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
    });

  const year =
    currentDate.getFullYear();

  const month =
    currentDate.getMonth();

  const firstDayOfMonth =
    new Date(
      year,
      month,
      1
    ).getDay();

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  const eventsByDay = useMemo(() => {
    const events: Record<
      number,
      Activity[]
    > = {};

    activities.forEach((activity) => {
      if (!activity.date) {
        return;
      }

      const activityDate =
        new Date(
          `${activity.date}T00:00:00`
        );

      if (
        Number.isNaN(
          activityDate.getTime()
        )
      ) {
        return;
      }

      if (
        activityDate.getFullYear() ===
          year &&
        activityDate.getMonth() ===
          month
      ) {
        const day =
          activityDate.getDate();

        if (!events[day]) {
          events[day] = [];
        }

        events[day].push(
          activity
        );
      }
    });

    return events;
  }, [
    activities,
    year,
    month,
  ]);

  const calendarDays =
    useMemo(() => {
      const days: (
        | number
        | null
      )[] = [];

      for (
        let i = 0;
        i < firstDayOfMonth;
        i++
      ) {
        days.push(null);
      }

      for (
        let day = 1;
        day <= daysInMonth;
        day++
      ) {
        days.push(day);
      }

      return days;
    }, [
      firstDayOfMonth,
      daysInMonth,
    ]);

  const previousMonth = () => {
    setCurrentDate(
      new Date(
        year,
        month - 1,
        1
      )
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(
        year,
        month + 1,
        1
      )
    );
  };

  const today = new Date();

  const isToday = (
    day: number
  ) => {
    return (
      today.getDate() === day &&
      today.getMonth() ===
        month &&
      today.getFullYear() ===
        year
    );
  };

  const monthName =
    currentDate.toLocaleDateString(
      locale === "ar"
        ? "ar-EG"
        : "en-US",
      {
        month: "long",
        year: "numeric",
      }
    );

  return {
    currentDate,
    year,
    month,

    calendarDays,
    eventsByDay,
    monthName,

    previousMonth,
    nextMonth,
    isToday,
  };
}
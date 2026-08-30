"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";
import { useTranslations } from "next-intl";

import { useLocale } from "@/hooks/useLocale";

const slides = [
  {
    id: 1,
    image: "/images/BUC-Hero1.png",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2000&q=80",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=2000&q=80",
  },
  {
    id: 4,
    image: "/images/BUC-Hero3.png",
  },
];

export default function Hero() {
  const t = useTranslations("Hero");

  const {
    locale,
    isArabic,
  } = useLocale();

  const [currentSlide, setCurrentSlide] =
    useState(0);

  const Arrow =
    isArabic
      ? ArrowLeft
      : ArrowRight;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(
        (previousSlide) =>
          (previousSlide + 1) %
          slides.length
      );
    }, 6000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const currentSlideId =
    slides[currentSlide].id;

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Slides */}

      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-[1500ms] ease-in-out ${
            index === currentSlide
              ? "scale-100 opacity-100"
              : "scale-110 opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={t(
              `slides.${slide.id}.title`
            )}
            className="h-full w-full object-cover"
          />
        </div>
      ))}

      {/* Overlay */}

      <div
        className={`absolute inset-0 ${
          isArabic
            ? "bg-[linear-gradient(270deg,rgba(5,15,30,0.88)_0%,rgba(5,15,30,0.68)_45%,rgba(5,15,30,0.25)_100%)]"
            : "bg-[linear-gradient(90deg,rgba(5,15,30,0.88)_0%,rgba(5,15,30,0.68)_45%,rgba(5,15,30,0.25)_100%)]"
        }`}
      />

      {/* Decorations */}

      <div className="absolute left-[10%] top-[20%] h-72 w-72 animate-pulse rounded-full bg-[var(--secondary)]/20 blur-3xl" />

      <div className="absolute bottom-[10%] right-[10%] h-96 w-96 animate-pulse rounded-full bg-[var(--accent)]/10 blur-3xl" />

      {/* Content */}

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 pb-24 pt-[72px]">
        <div className="max-w-3xl text-white">
          <div
            key={currentSlide}
            className="animate-in fade-in slide-in-from-bottom-6 duration-700"
          >
            <p className="mb-6 text-sm font-semibold tracking-[0.25em] text-blue-200 md:text-base">
              {t(
                `slides.${currentSlideId}.eyebrow`
              )}
            </p>

            <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
              {t(
                `slides.${currentSlideId}.title`
              )}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200 md:text-lg">
              {t(
                `slides.${currentSlideId}.description`
              )}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={`/${locale}/activities`}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-[var(--primary)] transition duration-300 hover:scale-105 hover:bg-slate-100"
              >
                {t("explore")}

                <Arrow className="h-5 w-5" />
              </Link>

              <Link
                href={`/${locale}/colleges`}
                className="rounded-xl border border-white/40 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur-sm transition duration-300 hover:bg-white/20"
              >
                {t("colleges")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() =>
              setCurrentSlide(index)
            }
            aria-label={t(
              "goToSlide",
              {
                number: index + 1,
              }
            )}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-10 bg-white"
                : "w-2.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      {/* Slide Counter */}

      <div
        className={`absolute bottom-8 z-20 hidden text-sm font-medium text-white/80 md:block ${
          isArabic
            ? "left-6"
            : "right-6"
        }`}
      >
        {String(
          currentSlide + 1
        ).padStart(2, "0")}{" "}
        /{" "}
        {String(
          slides.length
        ).padStart(2, "0")}
      </div>
    </section>
  );
}
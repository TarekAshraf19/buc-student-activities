"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { useLocale } from "@/hooks/useLocale";

export default function Footer() {
  const t = useTranslations("Footer");

  const { locale } = useLocale();

  return (
    <footer className="bg-[var(--primary)] px-6 pb-8 pt-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}

          <div>
            <Link
              href={`/${locale}`}
              className="flex items-center gap-3"
            >
              <Image
                src="/images/buc-logo.png"
                alt="BUC Logo"
                width={140}
                height={70}
                className="h-11 w-auto object-contain"
              />

              <span className="text-lg font-bold">
                {t("brand")}
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/65">
              {t("description")}
            </p>
          </div>

          {/* Quick Links */}

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              {t("quickLinks.title")}
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-white/65">
              <li>
                <Link
                  href={`/${locale}`}
                  className="transition hover:text-white"
                >
                  {t("quickLinks.home")}
                </Link>
              </li>

              <li>
                <Link
                  href={`/${locale}/activities`}
                  className="transition hover:text-white"
                >
                  {t("quickLinks.activities")}
                </Link>
              </li>

              <li>
                <Link
                  href={`/${locale}/colleges`}
                  className="transition hover:text-white"
                >
                  {t("quickLinks.colleges")}
                </Link>
              </li>

              <li>
                <Link
                  href={`/${locale}/achievements`}
                  className="transition hover:text-white"
                >
                  {t("quickLinks.achievements")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Activities */}

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              {t("activities.title")}
            </h3>

            <ul className="mt-5 space-y-3 text-sm text-white/65">
              <li>
                {t("activities.clubs")}
              </li>

              <li>
                {t("activities.events")}
              </li>

              <li>
                {t("activities.competitions")}
              </li>

              <li>
                {t("activities.workshops")}
              </li>
            </ul>
          </div>

          {/* Contact */}

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              {t("contact.title")}
            </h3>

            <div className="mt-5 space-y-3 text-sm text-white/65">
              <p>
                {t("contact.location")}
              </p>

              <p>
                {t("contact.email")}
              </p>

              <p>
                {t("contact.phone")}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            {t("copyright")}
          </p>

          <div className="flex gap-5">
            <Link
              href={`/${locale}/privacy`}
              className="transition hover:text-white"
            >
              {t("privacy")}
            </Link>

            <Link
              href={`/${locale}/terms`}
              className="transition hover:text-white"
            >
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
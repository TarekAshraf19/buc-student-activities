"use client";

import Image from "next/image";
import Link from "next/link";

import {
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  useTranslations,
} from "next-intl";

import {
  useLocale,
} from "@/hooks/useLocale";

import {
  useAuth,
} from "@/hooks/useAuth";

import {
  useCurrentEntity,
} from "@/hooks/useCurrentEntity";

import {
  logout,
} from "@/services/auth.service";

export default function Navbar() {
  const t =
    useTranslations(
      "Navbar"
    );

  const pathname =
    usePathname();

  const router =
    useRouter();

  const {
    locale,
    isArabic,
  } = useLocale();

  const {
    user,
  } = useAuth();

  const {
    entity,
    loading:
      entityLoading,
  } = useCurrentEntity();

  const [
    scrolled,
    setScrolled,
  ] = useState(false);

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const [
    accountMenuOpen,
    setAccountMenuOpen,
  ] = useState(false);

  /*
    ------------------------------------------
    LANGUAGE
    ------------------------------------------
  */

  const otherLocale =
    locale === "en"
      ? "ar"
      : "en";

  const pathWithoutLocale =
    pathname.replace(
      new RegExp(
        `^/${locale}`
      ),
      ""
    );

  const languageHref =
    `/${otherLocale}${pathWithoutLocale}`;

  /*
    ------------------------------------------
    TRANSPARENT PAGES
    ------------------------------------------
  */

  const pathParts =
    pathname
      .split("/")
      .filter(Boolean);

  const isHome =
    pathname ===
    `/${locale}`;

  const isCollegeDetails =
    pathParts.length === 3 &&
    pathParts[0] === locale &&
    pathParts[1] === "colleges";

  const isActivityDetails =
    pathParts.length === 3 &&
    pathParts[0] === locale &&
    pathParts[1] === "activities";

  const canBeTransparent =
    isHome ||
    isCollegeDetails ||
    isActivityDetails;

  const navbarWhite =
    scrolled ||
    !canBeTransparent;

  /*
    ------------------------------------------
    SCROLL
    ------------------------------------------
  */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(
        window.scrollY > 20
      );
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /*
    ------------------------------------------
    CLOSE MENUS AFTER ROUTE CHANGE
    ------------------------------------------
  */

  useEffect(() => {
    setMobileMenuOpen(
      false
    );

    setAccountMenuOpen(
      false
    );
  }, [pathname]);

  /*
    ------------------------------------------
    LOGOUT
    ------------------------------------------
  */

  const handleLogout =
    async () => {
      try {
        await logout();

        setAccountMenuOpen(
          false
        );

        setMobileMenuOpen(
          false
        );

        router.push(
          `/${locale}`
        );
      } catch (error) {
        console.error(
          "Logout error:",
          error
        );
      }
    };

  /*
    ------------------------------------------
    ACTIVE LINKS
    ------------------------------------------
  */

  const isActive = (
    href: string
  ) => {
    if (
      href ===
      `/${locale}`
    ) {
      return (
        pathname === href
      );
    }

    return pathname.startsWith(
      href
    );
  };

  /*
    ------------------------------------------
    CLASSES
    ------------------------------------------
  */

  const navLinkClass = (
    href: string
  ) => {
    const active =
      isActive(href);

    return `
      text-sm
      font-medium
      transition-colors
      duration-300
      ${
        active
          ? "text-[var(--secondary)]"
          : navbarWhite
            ? "text-[var(--primary)] hover:text-[var(--secondary)]"
            : "text-white hover:text-white/70"
      }
    `;
  };

  const mobileLinkClass = (
    href: string
  ) => {
    const active =
      isActive(href);

    return `
      block
      rounded-xl
      px-4
      py-3
      text-sm
      font-semibold
      transition
      ${
        active
          ? "bg-[var(--secondary)]/10 text-[var(--secondary)]"
          : "text-[var(--primary)] hover:bg-[var(--background)]"
      }
    `;
  };

  const actionTextClass =
    navbarWhite
      ? "text-[var(--primary)] hover:text-[var(--secondary)]"
      : "text-white hover:text-white/70";

  const loginClass =
    navbarWhite
      ? "border border-[var(--primary)] bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
      : "border border-white bg-white text-[var(--primary)] hover:bg-white/90";

  /*
    ------------------------------------------
    ENTITY LABEL
    ------------------------------------------
  */

  const entityLabel =
    entity
      ? entity.name?.[
          locale === "ar"
            ? "ar"
            : "en"
        ] ||
        entity.name?.en ||
        entity.name?.ar ||
        ""
      : "";

  const showAccount =
    Boolean(
      user &&
      entity
    );

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-500 ${
        navbarWhite
          ? "bg-white/95 shadow-lg shadow-black/5 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* ==============================
            BRAND
        ============================== */}

        <Link
          href={`/${locale}`}
          className="flex min-w-0 items-center gap-3"
        >
          <Image
            src="/images/buc-logo.png"
            alt="BUC Logo"
            width={160}
            height={80}
            priority
            className="h-10 w-auto shrink-0 object-contain sm:h-12"
          />

          <div className="hidden min-w-0 flex-col sm:flex">
            <span
              className={`truncate text-base font-bold leading-tight transition-colors duration-300 lg:text-xl ${
                navbarWhite
                  ? "text-[var(--primary)]"
                  : "text-white"
              }`}
            >
              {t(
                "brand"
              )}
            </span>

            <span
              className={`text-[9px] font-medium transition-colors duration-300 lg:text-[10px] ${
                navbarWhite
                  ? "text-[var(--muted)]"
                  : "text-white/60"
              } ${
                isArabic
                  ? "tracking-normal"
                  : "uppercase tracking-[0.16em]"
              }`}
            >
              {t(
                "subtitle"
              )}
            </span>
          </div>
        </Link>

        {/* ==============================
            DESKTOP NAV
        ============================== */}

        <nav className="hidden items-center gap-6 lg:flex">
          <Link
            href={`/${locale}`}
            className={navLinkClass(
              `/${locale}`
            )}
          >
            {t(
              "home"
            )}
          </Link>

          <Link
            href={`/${locale}/activities`}
            className={navLinkClass(
              `/${locale}/activities`
            )}
          >
            {t(
              "activities"
            )}
          </Link>

          <Link
            href={`/${locale}/colleges`}
            className={navLinkClass(
              `/${locale}/colleges`
            )}
          >
            {t(
              "colleges"
            )}
          </Link>

          <Link
            href={`/${locale}/local-regional-activities`}
            className={navLinkClass(
              `/${locale}/local-regional-activities`
            )}
          >
            {t(
              "localRegionalActivities"
            )}
          </Link>
        </nav>

        {/* ==============================
            DESKTOP ACTIONS
        ============================== */}

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href={
              languageHref
            }
            className={`text-sm font-semibold transition-colors duration-300 ${actionTextClass}`}
          >
            {locale ===
            "en"
              ? t(
                  "arabic"
                )
              : t(
                  "english"
                )}
          </Link>

          {user &&
          entityLoading ? (
            <div
              className={`h-10 w-28 animate-pulse rounded-xl ${
                navbarWhite
                  ? "bg-gray-100"
                  : "bg-white/10"
              }`}
            />
          ) : showAccount ? (
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setAccountMenuOpen(
                    (
                      current
                    ) =>
                      !current
                  )
                }
                className={`flex items-center gap-2 rounded-xl px-2 py-1.5 transition ${
                  navbarWhite
                    ? "hover:bg-black/5"
                    : "hover:bg-white/10"
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm">
                  <Image
                    src="/images/buc-logo.png"
                    alt="BUC"
                    width={40}
                    height={40}
                    className="h-full w-full object-contain p-1"
                  />
                </div>

                <div className="hidden max-w-[180px] text-start xl:block">
                  <p
                    className={`truncate text-sm font-bold ${
                      navbarWhite
                        ? "text-[var(--primary)]"
                        : "text-white"
                    }`}
                  >
                    {
                      entityLabel
                    }
                  </p>

                  <p
                    className={`text-xs ${
                      navbarWhite
                        ? "text-[var(--muted)]"
                        : "text-white/60"
                    }`}
                  >
                    {t(
                      "university"
                    )}
                  </p>
                </div>

                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    accountMenuOpen
                      ? "rotate-180"
                      : ""
                  } ${
                    navbarWhite
                      ? "text-[var(--primary)]"
                      : "text-white"
                  }`}
                />
              </button>

              {accountMenuOpen && (
                <div
                  className={`absolute top-full mt-2 w-52 overflow-hidden rounded-xl bg-white py-2 shadow-xl ${
                    isArabic
                      ? "left-0"
                      : "right-0"
                  }`}
                >
                  <Link
                    href={`/${locale}/dashboard`}
                    className="block px-4 py-3 text-sm font-medium text-[var(--primary)] transition hover:bg-[var(--background)]"
                  >
                    {t(
                      "dashboard"
                    )}
                  </Link>

                  <button
                    type="button"
                    onClick={
                      handleLogout
                    }
                    className="w-full px-4 py-3 text-start text-sm font-medium text-red-500 transition hover:bg-red-50"
                  >
                    {t(
                      "logout"
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href={`/${locale}/login`}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${loginClass}`}
            >
              {t(
                "login"
              )}
            </Link>
          )}
        </div>

        {/* ==============================
            MOBILE CONTROLS
        ============================== */}

        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href={
              languageHref
            }
            className={`px-2 text-sm font-bold transition ${actionTextClass}`}
          >
            {locale ===
            "en"
              ? "AR"
              : "EN"}
          </Link>

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                (
                  current
                ) =>
                  !current
              )
            }
            aria-label={
              mobileMenuOpen
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={
              mobileMenuOpen
            }
            className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
              navbarWhite
                ? "text-[var(--primary)] hover:bg-[var(--background)]"
                : "text-white hover:bg-white/10"
            }`}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* ==============================
          MOBILE MENU
      ============================== */}

      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 pb-5 pt-3 shadow-xl lg:hidden">
          <div className="mx-auto max-w-7xl">
            <nav className="space-y-1">
              <Link
                href={`/${locale}`}
                className={mobileLinkClass(
                  `/${locale}`
                )}
              >
                {t(
                  "home"
                )}
              </Link>

              <Link
                href={`/${locale}/activities`}
                className={mobileLinkClass(
                  `/${locale}/activities`
                )}
              >
                {t(
                  "activities"
                )}
              </Link>

              <Link
                href={`/${locale}/colleges`}
                className={mobileLinkClass(
                  `/${locale}/colleges`
                )}
              >
                {t(
                  "colleges"
                )}
              </Link>

              <Link
                href={`/${locale}/local-regional-activities`}
                className={mobileLinkClass(
                  `/${locale}/local-regional-activities`
                )}
              >
                {t(
                  "localRegionalActivities"
                )}
              </Link>
            </nav>

            <div className="mt-4 border-t border-gray-100 pt-4">
              {user &&
              entityLoading ? (
                <div className="px-3 py-3">
                  <div className="h-10 w-full animate-pulse rounded-xl bg-gray-100" />
                </div>
              ) : showAccount ? (
                <>
                  <div className="mb-3 flex items-center gap-3 px-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-white">
                      <Image
                        src="/images/buc-logo.png"
                        alt="BUC"
                        width={40}
                        height={40}
                        className="h-full w-full object-contain p-1"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[var(--primary)]">
                        {
                          entityLabel
                        }
                      </p>

                      <p className="text-xs text-[var(--muted)]">
                        {t(
                          "university"
                        )}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/${locale}/dashboard`}
                    className="block rounded-xl px-4 py-3 text-sm font-semibold text-[var(--primary)] transition hover:bg-[var(--background)]"
                  >
                    {t(
                      "dashboard"
                    )}
                  </Link>

                  <button
                    type="button"
                    onClick={
                      handleLogout
                    }
                    className="w-full rounded-xl px-4 py-3 text-start text-sm font-semibold text-red-500 transition hover:bg-red-50"
                  >
                    {t(
                      "logout"
                    )}
                  </button>
                </>
              ) : (
                <Link
                  href={`/${locale}/login`}
                  className="flex w-full items-center justify-center rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--primary-hover)]"
                >
                  {t(
                    "login"
                  )}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
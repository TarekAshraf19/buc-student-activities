import type { Metadata } from "next";
import {
  Cairo,
  Inter,
} from "next/font/google";
import {
  NextIntlClientProvider,
  hasLocale,
} from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing } from "@/i18n/routing";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cairo = Cairo({
  subsets: ["arabic"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "BUC Student Activities",
  description:
    "BUC Student Activities Platform",
};

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode;

  params: Promise<{
    locale: string;
  }>;
}>;

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } =
    await params;

  if (
    !hasLocale(
      routing.locales,
      locale
    )
  ) {
    notFound();
  }

  const messages =
    await getMessages();

  return (
    <html
      lang={locale}
      dir={
        locale === "ar"
          ? "rtl"
          : "ltr"
      }
    >
      <body
        className={`${inter.variable} ${cairo.variable} antialiased`}
      >
        <NextIntlClientProvider
          messages={messages}
        >
          <Navbar />

          <main>
            {children}
          </main>

          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
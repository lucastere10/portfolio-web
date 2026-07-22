import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Cormorant_Garamond, Geist, Geist_Mono, Syne } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { ThemeProvider } from "@wrksz/themes/next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { routing } from "@/i18n/routing";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-name-serif",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const ogLocale = locale === "pt-BR" ? "pt_BR" : "en_US";
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: {
      default: t("titleDefault"),
      template: t("titleTemplate"),
    },
    description: t("description"),
    openGraph: {
      type: "website",
      locale: ogLocale,
      siteName: "Lucas Caldas",
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} ${cormorantGaramond.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Suspense fallback={null}>
              <PageViewTracker />
            </Suspense>
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

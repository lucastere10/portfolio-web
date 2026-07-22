import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { LabsInsightsPanel } from "@/components/labs/labs-insights-panel";
import { getAnalyticsSnapshot } from "@/lib/analytics/store";
import { isInsightsAccessAllowed } from "@/lib/analytics/insights-access";
import { resolveLocaleParam } from "@/content/locales";
import { routing } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "Labs Insights",
  description: "Admin view for Labs interaction analytics.",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
};

export default async function LabsInsightsPage({ params, searchParams }: Props) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) notFound();
  setRequestLocale(resolveLocaleParam(localeParam));

  const { token } = await searchParams;
  if (!isInsightsAccessAllowed(token)) {
    notFound();
  }

  const initialSnapshot = getAnalyticsSnapshot();
  return (
    <LabsInsightsPanel
      initialSnapshot={initialSnapshot}
      accessToken={token ?? ""}
    />
  );
}

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getAllWork, WORK_DOMAINS } from "@/content/work";
import { WorkCatalog } from "@/components/work/work-catalog";
import { resolveLocaleParam } from "@/content/locales";
import { routing } from "@/i18n/routing";
import { ogForPath, pageAlternates } from "@/i18n/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocaleParam(localeParam);
  const t = await getTranslations({ locale, namespace: "work" });
  const title = t("title");
  const description = t("intro");
  return {
    title,
    description,
    alternates: pageAlternates(locale, "/work"),
    openGraph: ogForPath(locale, "/work", { title, description }),
  };
}

export default async function WorkPage({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) notFound();
  const locale = resolveLocaleParam(localeParam);
  setRequestLocale(locale);

  const items = getAllWork(locale);
  return <WorkCatalog items={items} domains={WORK_DOMAINS} />;
}

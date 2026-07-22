import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { LabDetailView } from "@/components/labs/lab-detail-view";
import { getLabBySlug, getLabSlugs } from "@/content/labs";
import { resolveLocaleParam } from "@/content/locales";
import { routing } from "@/i18n/routing";
import { ogForPath, pageAlternates } from "@/i18n/seo";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  const slugs = getLabSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = resolveLocaleParam(localeParam);
  const lab = getLabBySlug(slug, locale);
  const t = await getTranslations({ locale, namespace: "labs" });

  if (!lab) {
    return { title: t("notFound") };
  }

  const title = `${lab.title} | Labs`;
  const description = lab.summary;
  return {
    title,
    description,
    alternates: pageAlternates(locale, `/labs/${slug}`),
    openGraph: ogForPath(locale, `/labs/${slug}`, { title, description }),
  };
}

export default async function LabDetailPage({ params }: PageProps) {
  const { locale: localeParam, slug } = await params;
  if (!hasLocale(routing.locales, localeParam)) notFound();
  const locale = resolveLocaleParam(localeParam);
  setRequestLocale(locale);

  const lab = getLabBySlug(slug, locale);

  if (!lab) {
    notFound();
  }

  return <LabDetailView lab={lab} />;
}

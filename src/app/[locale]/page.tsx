import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getFeaturedWork, getWorkBySlug, getWorkSlugs } from "@/content/work";
import {
  getProjectBySlug,
  getProjectSlugs,
} from "@/content/projects";
import { getLabBySlug, getLabSlugs } from "@/content/labs";
import { getHomePage } from "@/content/pages";
import { resolveLocaleParam } from "@/content/locales";
import { routing } from "@/i18n/routing";
import { ogForPath, pageAlternates } from "@/i18n/seo";
import { HeroSection } from "@/components/hero-chat/hero-section";
import { DomainsSection } from "@/components/home/domains-section";
import { FeaturedSection } from "@/components/home/featured-section";
import { LabsSection } from "@/components/home/labs-section";
import { AboutCtaSection } from "@/components/home/about-cta-section";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocaleParam(localeParam);
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = t("titleDefault");
  const description = t("description");
  return {
    title: { absolute: title },
    description,
    alternates: pageAlternates(locale, "/"),
    openGraph: ogForPath(locale, "/", { title, description }),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) notFound();
  const locale = resolveLocaleParam(localeParam);
  setRequestLocale(locale);

  const featured = getFeaturedWork(locale);
  const home = getHomePage(locale);
  const workIndex = getWorkSlugs()
    .map((slug) => getWorkBySlug(slug, locale))
    .filter((w): w is NonNullable<typeof w> => Boolean(w));
  const projectIndex = getProjectSlugs()
    .map((slug) => getProjectBySlug(slug, locale))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const labIndex = getLabSlugs()
    .map((slug) => getLabBySlug(slug, locale))
    .filter((l): l is NonNullable<typeof l> => Boolean(l));

  const featuredLabs = home.featuredLabSlugs.map((slug) => {
    const lab = getLabBySlug(slug, locale);
    if (!lab) {
      throw new Error(`Home featured lab not found: ${slug}`);
    }
    return lab;
  });

  return (
    <>
      <HeroSection
        domains={home.domains}
        workIndex={workIndex}
        projectIndex={projectIndex}
        labIndex={labIndex}
      />

      <DomainsSection domains={home.domains} />
      <FeaturedSection items={featured} />
      <LabsSection
        title={home.labsTitle}
        body={home.labsBody}
        labs={featuredLabs}
      />
      <AboutCtaSection
        aboutBlurb={home.aboutBlurb}
        ctaTitle={home.ctaTitle}
        ctaBody={home.ctaBody}
      />
    </>
  );
}

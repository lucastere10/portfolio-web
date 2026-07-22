import type { Metadata } from "next";
import { ArrowRight, MoveRight } from "lucide-react";
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
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { ogForPath, pageAlternates } from "@/i18n/seo";
import { HeroSection } from "@/components/hero-chat/hero-section";

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

  const t = await getTranslations("home");
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

  return (
    <>
      <HeroSection
        domains={home.domains}
        workIndex={workIndex}
        projectIndex={projectIndex}
        labIndex={labIndex}
      />

      <section className="px-6 py-24 content-width-wide border-t border-border">
        <div className="content-width mb-12">
          <span className="section-label">{t("domainsLabel")}</span>
          <h2 className="font-display font-bold text-3xl tracking-tight mt-3 text-foreground">
            {t("domainsTitle")}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 content-width">
          {home.domains.map(({ title, description }) => (
            <div
              key={title}
              className="flex flex-col gap-2 p-5 rounded-xl border border-border transition-all hover:border-(--gold)/40"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: "var(--gold)" }}
                />
                <h3 className="text-sm font-semibold text-foreground">
                  {title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-4">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-24 content-width-wide border-t border-border">
        <div className="content-width mb-12 flex items-end justify-between">
          <div>
            <span className="section-label">{t("featuredLabel")}</span>
            <h2 className="font-display font-bold text-3xl tracking-tight mt-3 text-foreground">
              {t("featuredTitle")}
            </h2>
          </div>
          <Link
            href="/work"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 shrink-0"
          >
            {t("allProjects")} <MoveRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="content-width flex flex-col">
          {featured.map(({ slug, domain, name, tagline, stack }, i) => {
            return (
              <Link
                key={slug}
                href={`/work/${slug}`}
                className={`group flex flex-col sm:flex-row sm:items-start gap-4 py-8 transition-all hover:opacity-80 ${i < featured.length - 1 ? "border-b border-border" : ""}`}
              >
                <div className="sm:w-44 shrink-0">
                  <span className="badge-gold">{domain}</span>
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <h3 className="text-base font-semibold text-foreground leading-snug">
                    {name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tagline}
                  </p>
                </div>
                <div className="sm:w-52 shrink-0 flex flex-col gap-2 sm:items-end">
                  <div className="flex flex-wrap gap-1.5 sm:justify-end">
                    {stack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-mono text-[10px] text-muted-foreground border border-border rounded px-2 py-0.5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors inline-flex items-center gap-1">
                    {t("caseStudy")} <MoveRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="px-6 py-24 content-width-wide border-t border-border bg-surface">
        <div className="content-width">
          <span className="section-label">{t("labsLabel")}</span>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-10 items-start">
            <div className="flex flex-col gap-4">
              <h2 className="font-display font-bold text-2xl tracking-tight text-foreground">
                {home.labsTitle}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {home.labsBody}
              </p>
              <Link
                href="/labs"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-70 transition-opacity mt-2"
              >
                {t("exploreLabs")} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div
              className="rounded-lg border border-border bg-background p-6 text-xs text-muted-foreground leading-loose"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              <div className="text-foreground text-[10px] tracking-widest uppercase mb-4 opacity-60">
                {home.labsPipelineLabel}
              </div>
              {home.labsPipelineLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 content-width-wide border-t border-border">
        <div className="content-width grid grid-cols-1 sm:grid-cols-2 gap-12 items-start">
          <div className="flex flex-col gap-4">
            <span className="section-label">{t("aboutLabel")}</span>
            <p className="text-base text-muted-foreground leading-relaxed">
              {home.aboutBlurb}
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
            >
              {t("howIBuild")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div
            className="rounded-xl border p-8 flex flex-col gap-6"
            style={{
              backgroundColor: "var(--hero-bg)",
              borderColor: "var(--hero-border)",
            }}
          >
            <div>
              <h3
                className="font-display font-bold text-xl tracking-tight mb-2"
                style={{ color: "var(--hero-text)" }}
              >
                {home.ctaTitle}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--hero-muted)" }}
              >
                {home.ctaBody}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-85"
                style={{
                  backgroundColor: "var(--gold)",
                  color: "var(--hero-bg)",
                }}
              >
                {t("getInTouch")} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

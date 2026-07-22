import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { getWorkBySlug, getWorkSlugs } from "@/content/work";
import { resolveLocaleParam } from "@/content/locales";
import { routing } from "@/i18n/routing";
import { ogForPath, pageAlternates } from "@/i18n/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = resolveLocaleParam(localeParam);
  const resolved = getWorkBySlug(slug, locale);
  if (!resolved) return {};
  const title = resolved.name;
  const description = resolved.context.slice(0, 160);
  return {
    title,
    description,
    alternates: pageAlternates(locale, `/work/${slug}`),
    openGraph: ogForPath(locale, `/work/${slug}`, { title, description }),
  };
}

export function generateStaticParams() {
  const slugs = getWorkSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export default async function CaseStudyPage({ params }: Props) {
  const { locale: localeParam, slug } = await params;
  if (!hasLocale(routing.locales, localeParam)) notFound();
  const locale = resolveLocaleParam(localeParam);
  setRequestLocale(locale);

  const resolved = getWorkBySlug(slug, locale);
  if (!resolved) notFound();

  const t = await getTranslations("work");

  return (
    <div className="px-6 py-20 content-width-wide">
      <div className="content-width">
        <Link
          href="/work"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-12"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> {t("back")}
        </Link>

        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="badge-gold">{resolved.domain}</span>
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight mb-4">
            {resolved.name}
          </h1>
          <p className="text-base text-muted-foreground mb-8 max-w-[42rem] leading-relaxed">
            {resolved.tagline}
          </p>
          <div className="flex flex-wrap gap-2">
            {resolved.stack.map((tech) => (
              <span
                key={tech}
                className="text-mono text-xs text-muted-foreground border border-border rounded px-2.5 py-1"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {resolved.metrics && resolved.metrics.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-16 p-6 rounded-xl border border-border bg-[var(--color-surface)]">
            {resolved.metrics.map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-1">
                <span
                  className="text-mono text-lg font-bold"
                  style={{ color: "var(--gold)" }}
                >
                  {value}
                </span>
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-16">
          <section>
            <span className="section-label">{t("context")}</span>
            <p className="mt-5 text-base text-foreground leading-relaxed">
              {resolved.context}
            </p>
          </section>

          <div className="border-t border-border" />

          <section>
            <span className="section-label">{t("challenges")}</span>
            <ul className="mt-5 flex flex-col gap-3">
              {resolved.challenges.map((challenge, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-base text-muted-foreground leading-relaxed"
                >
                  <span className="text-mono text-xs text-muted-foreground/50 mt-1 shrink-0 w-5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{challenge}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="border-t border-border" />

          <section>
            <span className="section-label">{t("decisions")}</span>
            <div className="mt-6 flex flex-col gap-8">
              {resolved.decisions.map(({ title, reasoning }, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "var(--gold)" }}
                    />
                    <h3 className="text-sm font-semibold text-foreground">
                      {title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-4">
                    {reasoning}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <span className="section-label">{t("tradeoffs")}</span>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed">
              {resolved.tradeoffs}
            </p>
          </section>

          <div className="border-t border-border" />

          <section>
            <span className="section-label">{t("implementation")}</span>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed">
              {resolved.implementation}
            </p>
          </section>

          <div className="border-t border-border" />

          <section>
            <span className="section-label">{t("impact")}</span>
            <p className="mt-5 text-base text-foreground leading-relaxed font-medium">
              {resolved.impact}
            </p>
          </section>

          <div className="border-t border-border" />

          <section>
            <span className="section-label">{t("learnings")}</span>
            <ul className="mt-5 flex flex-col gap-3">
              {resolved.learnings.map((learning, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-base text-muted-foreground leading-relaxed"
                >
                  <span style={{ color: "var(--gold)" }} className="shrink-0">
                    ›
                  </span>
                  <span>{learning}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="border-t border-border mt-20 pt-10">
          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" /> {t("back")}
          </Link>
        </div>
      </div>
    </div>
  );
}

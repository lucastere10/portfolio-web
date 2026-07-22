import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getLabsByDomain } from "@/content/labs";
import { resolveLocaleParam } from "@/content/locales";
import { routing } from "@/i18n/routing";
import { ogForPath, pageAlternates } from "@/i18n/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocaleParam(localeParam);
  const t = await getTranslations({ locale, namespace: "labs" });
  const title = t("title");
  const description = t("metaDescription");
  return {
    title,
    description,
    alternates: pageAlternates(locale, "/labs"),
    openGraph: ogForPath(locale, "/labs", { title, description }),
  };
}

export default async function LabsPage({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) notFound();
  const locale = resolveLocaleParam(localeParam);
  setRequestLocale(locale);

  const t = await getTranslations("labs");
  const labsByDomain = getLabsByDomain(locale);

  return (
    <div className="px-6 py-20 content-width-wide">
      <div className="content-width-wide">
        <div className="mb-16">
          <span className="section-label">{t("eyebrow")}</span>
          <h1 className="font-display font-bold text-4xl tracking-tight mb-4 mt-3">
            {t("title")}
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
            {t("intro")}
          </p>
        </div>

        <div className="flex flex-col gap-10">
          {labsByDomain.map(({ domain, labs }) => (
            <section
              key={domain}
              className="rounded-xl border border-border bg-card/55 p-5 sm:p-6 labs-grid-bg"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">{domain}</h2>
                <span className="text-mono text-[10px] uppercase text-muted-foreground border border-border rounded px-2 py-1">
                  {t("labsCount", { count: labs.length })}
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {labs.map((lab) => (
                  <Link
                    key={lab.slug}
                    href={`/labs/${lab.slug}`}
                    className="group rounded-lg border border-border bg-background/90 p-4 transition-all hover:border-(--gold-border) hover:bg-(--gold-dim)"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-semibold text-foreground">
                        {lab.title}
                      </h3>
                      <ArrowRight className="w-4 h-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                      {lab.summary}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {lab.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-mono text-[10px] border border-border rounded px-1.5 py-0.5 text-muted-foreground uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 pt-10 border-t border-border flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground max-w-152">
            Want a guided walkthrough? I can explain the architecture decisions
            behind each interaction.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
            >
              Contact <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

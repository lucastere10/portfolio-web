import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getAboutPage } from "@/content/pages";
import { resolveLocaleParam } from "@/content/locales";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { ogForPath, pageAlternates } from "@/i18n/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocaleParam(localeParam);
  const page = getAboutPage(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  const title = t("eyebrow");
  const description = page.metaDescription ?? "";
  return {
    title,
    description,
    alternates: pageAlternates(locale, "/about"),
    openGraph: ogForPath(locale, "/about", { title, description }),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) notFound();
  const locale = resolveLocaleParam(localeParam);
  setRequestLocale(locale);

  const page = getAboutPage(locale);
  const t = await getTranslations("about");

  return (
    <div className="px-6 py-20 content-width-wide">
      <div className="content-width">
        <p className="text-mono text-xs tracking-widest uppercase text-muted-foreground mb-4">
          {t("eyebrow")}
        </p>
        <h1 className="font-display font-bold text-4xl tracking-tight mb-10">
          {page.title}
        </h1>

        <div className="flex flex-col gap-5 max-w-[38rem] mb-20">
          {page.intro.map((paragraph, index) => (
            <p
              key={paragraph.slice(0, 32)}
              className={
                index === 0
                  ? "text-base text-foreground leading-relaxed"
                  : "text-base text-muted-foreground leading-relaxed"
              }
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="border-t border-border mb-16" />

        <section className="mb-20">
          <span className="section-label">{t("focusAreas")}</span>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
            {page.focusAreas.map(({ title, detail }) => (
              <div key={title} className="flex flex-col gap-1.5">
                <h3 className="text-sm font-semibold text-foreground">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="border-t border-border mb-16" />

        <section>
          <span className="section-label">{t("links")}</span>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a
              href="https://linkedin.com/in/lucas-caldas50"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("linkedin")} <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://github.com/lucastere10"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("github")} <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
            >
              {t("contact")} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

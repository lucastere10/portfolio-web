import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";

import { ContactForm } from "@/components/contact-form";
import { getContactPage } from "@/content/pages";
import { resolveLocaleParam } from "@/content/locales";
import { routing } from "@/i18n/routing";
import { ogForPath, pageAlternates } from "@/i18n/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocaleParam(localeParam);
  const page = getContactPage(locale);
  const title = page.title;
  const description = page.metaDescription ?? "";
  return {
    title,
    description,
    alternates: pageAlternates(locale, "/contact"),
    openGraph: ogForPath(locale, "/contact", { title, description }),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) notFound();
  const locale = resolveLocaleParam(localeParam);
  setRequestLocale(locale);

  const page = getContactPage(locale);
  const t = await getTranslations("contact");

  return (
    <div className="px-6 py-20 content-width-wide">
      <div className="content-width">
        <p className="section-label">{t("eyebrow")}</p>

        <h1 className="font-display font-bold text-4xl tracking-tight mb-4 mt-3">
          {page.headline}
        </h1>
        <p className="text-base text-muted-foreground max-w-[34rem] leading-relaxed mb-16">
          {page.intro}
        </p>

        <ContactForm />

        <div className="mt-16 pt-10 border-t border-border">
          <p className="text-xs text-muted-foreground mb-4">
            {page.directReachLabel}
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://linkedin.com/in/lucas-caldas50"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("linkedin")}
            </a>
            <a
              href="https://github.com/lucastere10"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("github")}
            </a>
            <a
              href={`mailto:${page.email}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {page.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

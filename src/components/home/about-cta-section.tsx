import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type AboutCtaSectionProps = {
  aboutBlurb: string;
  ctaTitle: string;
  ctaBody: string;
};

export async function AboutCtaSection({
  aboutBlurb,
  ctaTitle,
  ctaBody,
}: AboutCtaSectionProps) {
  const t = await getTranslations("home");

  return (
    <section className="px-6 py-16 content-width-wide border-t border-border">
      <div className="content-width flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between sm:gap-16">
        <div className="flex flex-col gap-3 max-w-xl">
          <span className="section-label">{t("aboutLabel")}</span>
          <p className="text-base text-muted-foreground leading-relaxed">
            {aboutBlurb}
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-70 transition-opacity w-fit"
          >
            {t("howIBuild")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex flex-col gap-3 sm:items-end sm:text-right shrink-0">
          <h3 className="font-display font-bold text-xl tracking-tight text-foreground">
            {ctaTitle}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs sm:ml-auto">
            {ctaBody}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-85 w-fit"
            style={{
              backgroundColor: "var(--gold)",
              color: "var(--hero-bg)",
            }}
          >
            {t("getInTouch")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

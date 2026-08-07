import { MoveRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { WorkSummary } from "@/content/schemas";
import { Link } from "@/i18n/navigation";

type FeaturedSectionProps = {
  items: WorkSummary[];
};

export async function FeaturedSection({ items }: FeaturedSectionProps) {
  const t = await getTranslations("home");

  return (
    <section className="px-6 py-28 content-width-wide border-t border-border">
      <div className="content-width mb-14 flex items-end justify-between gap-6">
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
        {items.map(({ slug, domain, name, impact, stack }, i) => (
          <Link
            key={slug}
            href={`/work/${slug}`}
            className={`group flex flex-col sm:flex-row sm:items-start gap-4 py-10 transition-opacity hover:opacity-80 ${
              i < items.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div className="sm:w-44 shrink-0">
              <span className="badge-gold">{domain}</span>
            </div>
            <div className="flex-1 flex flex-col gap-1.5 min-w-0">
              <h3 className="text-base font-semibold text-foreground leading-snug">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {impact}
              </p>
            </div>
            <div className="sm:w-48 shrink-0 flex flex-col gap-2 sm:items-end">
              <div className="flex flex-wrap gap-1.5 sm:justify-end opacity-70 group-hover:opacity-100 transition-opacity">
                {stack.slice(0, 3).map((tech) => (
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
        ))}
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MoveRight } from "lucide-react";
import type { Domain, WorkSummary } from "@/content/schemas";

type WorkCatalogProps = {
  items: WorkSummary[];
  domains: Domain[];
};

export function WorkCatalog({ items, domains }: WorkCatalogProps) {
  const t = useTranslations("work");
  const [active, setActive] = useState<Domain | null>(null);

  const filtered = active
    ? items.filter((p) => p.domain === active)
    : items;

  return (
    <div className="px-6 py-20 content-width-wide">
      <div className="content-width">
        <div className="mb-12">
          <p className="text-mono text-xs tracking-widest uppercase text-muted-foreground mb-4">
            {t("eyebrow")}
          </p>
          <h1 className="font-display font-bold text-4xl tracking-tight mb-4">
            {t("title")}
          </h1>
          <p className="text-base text-muted-foreground max-w-[36rem] leading-relaxed">
            {t("intro")}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-12">
          <button
            onClick={() => setActive(null)}
            className={`text-mono text-xs px-3 py-1.5 rounded border transition-colors cursor-pointer ${
              active === null
                ? "border-[var(--gold)] bg-[var(--gold-dim)] text-[var(--gold)]"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
            }`}
          >
            {t("all")}
          </button>
          {domains.map((domain) => (
            <button
              key={domain}
              onClick={() => setActive(active === domain ? null : domain)}
              className={`text-mono text-xs px-3 py-1.5 rounded border transition-colors cursor-pointer ${
                active === domain
                  ? "border-[var(--gold)] bg-[var(--gold-dim)] text-[var(--gold)]"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
              }`}
            >
              {domain}
            </button>
          ))}
        </div>

        <div className="flex flex-col">
          {filtered.map(({ slug, domain, name, tagline, stack }, i) => (
            <Link
              key={slug}
              href={`/work/${slug}`}
              className={`group flex flex-col sm:flex-row sm:items-start gap-4 py-8 ${
                i < filtered.length - 1 ? "border-b border-border" : ""
              } hover:opacity-75 transition-opacity`}
            >
              <div className="sm:w-48 shrink-0">
                <span className="badge-gold">{domain}</span>
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <h2 className="text-base font-semibold text-foreground leading-snug">
                  {name}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tagline}
                </p>
              </div>

              <div className="sm:w-56 shrink-0 flex flex-col gap-2 sm:items-end">
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
          ))}

          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground py-12 text-center">
              {t("empty")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

import { ArrowRight, MoveRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { LabDefinition } from "@/content/schemas";
import { Link } from "@/i18n/navigation";

type LabsSectionProps = {
  title: string;
  body: string;
  labs: LabDefinition[];
};

export async function LabsSection({ title, body, labs }: LabsSectionProps) {
  const t = await getTranslations("home");

  return (
    <section className="px-6 py-20 content-width-wide border-t border-border bg-surface">
      <div className="content-width">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-12 lg:gap-16 items-start">
          <div className="flex flex-col gap-4">
            <span className="section-label">{t("labsLabel")}</span>
            <h2 className="font-display font-bold text-2xl tracking-tight text-foreground">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              {body}
            </p>
            <Link
              href="/labs"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-70 transition-opacity mt-1"
            >
              {t("exploreLabs")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex flex-col">
            {labs.map((lab, i) => (
              <Link
                key={lab.slug}
                href={`/labs/${lab.slug}`}
                className={`group flex flex-col gap-1.5 py-5 transition-opacity hover:opacity-80 ${
                  i < labs.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-sm font-semibold text-foreground leading-snug">
                    {lab.title}
                  </h3>
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors inline-flex items-center gap-1 shrink-0 mt-0.5">
                    {t("viewLab")} <MoveRight className="w-3 h-3" />
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {lab.summary}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

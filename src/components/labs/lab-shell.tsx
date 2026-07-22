import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { LabViewTracker } from "@/components/labs/lab-view-tracker";
import type { LabDefinition } from "@/content/schemas";

type LabShellProps = {
  lab: LabDefinition;
  children: ReactNode;
};

export async function LabShell({ lab, children }: LabShellProps) {
  const t = await getTranslations("labs");

  return (
    <div className="px-6 py-16 content-width-wide">
      <LabViewTracker labSlug={lab.slug} />
      <div className="content-width-wide flex flex-col gap-8">
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-3xl">
            <p className="section-label">{lab.domain}</p>
            <h1 className="font-display font-bold text-4xl tracking-tight mt-3">
              {lab.title}
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed mt-3 max-w-2xl">
              {lab.summary}
            </p>
            <p className="text-xs text-muted-foreground mt-4 text-mono tracking-wide uppercase">
              {t("prompt")}: {lab.interactionPrompt}
            </p>
          </div>
          <Link
            href="/labs"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-70 transition-opacity shrink-0"
          >
            <ArrowLeft className="w-4 h-4" /> {t("back")}
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
          <div className="rounded-xl border border-border bg-card/70 p-4 sm:p-6 labs-grid-bg">
            {children}
          </div>
          <aside className="rounded-xl border border-border bg-background/90 p-5 flex flex-col gap-6 sticky top-20">
            <div>
              <h2 className="text-sm font-semibold mb-3">{t("demonstrates")}</h2>
              <ul className="flex flex-wrap gap-2">
                {lab.demonstrates.map((item) => (
                  <li
                    key={item}
                    className="text-mono text-[10px] border border-border rounded px-2 py-1 uppercase text-muted-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold mb-3">{t("narrative")}</h2>
              <ol className="flex flex-col gap-3">
                {lab.narrative.map((line, index) => (
                  <li
                    key={line}
                    className="text-sm text-muted-foreground leading-relaxed"
                  >
                    <span className="text-mono text-[10px] text-foreground mr-2">
                      {index + 1}.
                    </span>
                    {line}
                  </li>
                ))}
              </ol>
            </div>
            <div className="pt-1 border-t border-border">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t("asideNote")}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 text-sm font-medium mt-3 hover:opacity-75 transition-opacity"
              >
                {t("walkthrough")} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

import { MoveRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { PageDomain } from "@/content/schemas";
import { Link } from "@/i18n/navigation";

type DomainsSectionProps = {
  domains: PageDomain[];
};

export async function DomainsSection({ domains }: DomainsSectionProps) {
  const t = await getTranslations("home");

  return (
    <section className="px-6 py-14 content-width-wide border-t border-border">
      <div className="content-width mb-8">
        <span className="section-label">{t("domainsLabel")}</span>
        <h2 className="font-display font-bold text-2xl tracking-tight mt-2 text-foreground">
          {t("domainsTitle")}
        </h2>
      </div>
      <div className="content-width grid grid-cols-1 sm:grid-cols-2 gap-x-12">
        {domains.map(({ title, description, proofHref }, i) => {
          const isLast = i === domains.length - 1;
          const isLastRowSm = i >= domains.length - 2;
          return (
            <div
              key={title}
              className={`flex flex-col gap-2 py-6 border-b border-border ${
                isLast ? "border-b-0" : ""
              } ${isLastRowSm ? "sm:border-b-0" : ""}`}
            >
              <div className="flex items-baseline gap-3">
                <span
                  className="text-mono text-[10px] tabular-nums shrink-0"
                  style={{ color: "var(--gold)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-sm font-semibold text-foreground">
                  {title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-8">
                {description}
              </p>
              <Link
                href={
                  proofHref as
                    | `/work/${string}`
                    | `/labs/${string}`
                }
                className="pl-8 mt-1 text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 w-fit"
              >
                {t("seeProof")} <MoveRight className="w-3 h-3" />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}

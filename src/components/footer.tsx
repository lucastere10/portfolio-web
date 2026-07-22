"use client";

import { useTranslations } from "next-intl";
import { trackLabsEvent } from "@/lib/analytics/labs-analytics";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border">
      <div className="content-width-wide px-6 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-foreground">
              {t("name")}
            </span>
            <span className="text-xs text-muted-foreground">{t("tagline")}</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/lucastere10"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackLabsEvent({
                  labSlug: "footer",
                  action: "external_link",
                  label: "github",
                })
              }
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("github")}
            </a>
            <a
              href="https://linkedin.com/in/lucas-caldas50"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackLabsEvent({
                  labSlug: "footer",
                  action: "external_link",
                  label: "linkedin",
                })
              }
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("linkedin")}
            </a>
            <Link
              href="/contact"
              onClick={() =>
                trackLabsEvent({
                  labSlug: "footer",
                  action: "nav_click",
                  label: "/contact",
                })
              }
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("contact")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

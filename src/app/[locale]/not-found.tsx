import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFoundPage() {
  const t = await getTranslations("notFound");

  return (
    <div className="px-6 py-24 content-width-wide">
      <div className="content-width flex flex-col gap-4 max-w-lg">
        <p className="section-label">404</p>
        <h1 className="font-display font-bold text-3xl tracking-tight">
          {t("title")}
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t("body")}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-70 transition-opacity mt-2"
        >
          {t("home")}
        </Link>
      </div>
    </div>
  );
}

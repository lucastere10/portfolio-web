import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getAllProjects } from "@/content/projects";
import { resolveLocaleParam } from "@/content/locales";
import { routing } from "@/i18n/routing";
import { ogForPath, pageAlternates } from "@/i18n/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocaleParam(localeParam);
  const t = await getTranslations({ locale, namespace: "projects" });
  const title = t("title");
  const description = t("metaDescription");
  return {
    title,
    description,
    alternates: pageAlternates(locale, "/projects"),
    openGraph: ogForPath(locale, "/projects", { title, description }),
  };
}

const DEFAULT_HERO_STYLE = {
  accent: "var(--gold)",
  background:
    "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
};

export default async function ProjectsPage({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) notFound();
  const locale = resolveLocaleParam(localeParam);
  setRequestLocale(locale);

  const t = await getTranslations("projects");
  const personalProjects = getAllProjects(locale);

  const statusLabels = {
    live: t("statusLive"),
    "in-progress": t("statusInProgress"),
    archived: t("statusArchived"),
  } as const;

  return (
    <div className="px-6 py-20 content-width-wide">
      <div className="content-width-wide">
        <div className="mb-16">
          <span className="section-label">{t("eyebrow")}</span>
          <h1 className="font-display font-bold text-4xl tracking-tight mb-4 mt-3">
            {t("title")}
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
            {t("intro")}
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {personalProjects.map((project) => {
            const hero = project.hero ?? {
              ...DEFAULT_HERO_STYLE,
              label: t("heroDefault"),
            };

            return (
              <article
                key={project.slug}
                className="group rounded-xl border border-border bg-card/55 overflow-hidden transition-all hover:border-(--gold-border) hover:bg-(--gold-dim)/30"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Visual strip */}
                  <div
                    className="relative lg:w-72 xl:w-80 shrink-0 min-h-[180px] lg:min-h-0 border-b lg:border-b-0 lg:border-r border-border"
                    style={{ background: hero.background }}
                  >
                    <div
                      className="absolute inset-0 opacity-35"
                      style={{
                        backgroundImage: `radial-gradient(circle at 30% 50%, ${hero.accent} 0%, transparent 55%)`,
                      }}
                    />
                    <div className="relative h-full flex flex-col justify-between p-6">
                      <p
                        className="text-mono text-[10px] uppercase tracking-[0.18em]"
                        style={{ color: hero.accent }}
                      >
                        {hero.label}
                      </p>
                      <div>
                        <p className="font-display font-bold text-2xl text-white/90 leading-tight">
                          {project.name}
                        </p>
                        {project.links.demo && (
                          <a
                            href={project.links.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-white/60 hover:text-white/90 transition-colors"
                          >
                            {t("openDemo")}
                            <ArrowUpRight className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 sm:p-8 flex flex-col gap-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="badge-gold">{project.domain}</span>
                        <span className="text-mono text-[10px] uppercase text-muted-foreground border border-border rounded px-2 py-0.5">
                          {statusLabels[project.status]}
                        </span>
                        {project.featured && (
                          <span className="text-mono text-[10px] uppercase text-(--gold) border border-(--gold-border) bg-(--gold-dim) rounded px-2 py-0.5">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 leading-snug">
                        {project.tagline}
                      </h2>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3">
                        {project.overview}
                      </p>
                    </div>

                    {project.highlights.length > 0 && (
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {project.highlights.slice(0, 2).map((highlight, i) => (
                          <li
                            key={i}
                            className="flex gap-2 text-sm text-muted-foreground leading-relaxed"
                          >
                            <span
                              className="shrink-0 mt-0.5"
                              style={{ color: "var(--gold)" }}
                            >
                              ›
                            </span>
                            <span className="line-clamp-2">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {project.metrics && project.metrics.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {project.metrics.map(({ label, value }) => (
                          <div
                            key={label}
                            className="rounded-lg border border-border bg-background/60 px-3 py-2.5"
                          >
                            <p
                              className="text-mono text-sm font-semibold leading-none"
                              style={{ color: "var(--gold)" }}
                            >
                              {value}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">
                              {label}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="text-mono text-[10px] border border-border rounded px-2 py-0.5 text-muted-foreground uppercase"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-1 mt-auto border-t border-border/60">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-foreground group-hover:text-(--gold) transition-colors"
                      >
                        View project
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                      {project.links.demo && (
                        <a
                          href={project.links.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {t("openDemo")}
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-16 pt-10 border-t border-border flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-muted-foreground max-w-md">
            Looking for professional case studies with full architecture
            breakdowns?
          </p>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
          >
            View work
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

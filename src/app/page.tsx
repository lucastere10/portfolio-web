import Link from "next/link";
import { ArrowRight, MoveRight } from "lucide-react";
import {
  getFeaturedProjects,
  getProjectBySlug,
  resolveLocale,
} from "@/lib/projects";
import { domains } from "@/lib/portfolio-content";
import { HeroSection } from "@/components/hero-chat/hero-section";

export default function HomePage() {
  const featured = getFeaturedProjects();

  return (
    <>
      <HeroSection />

      <section className="px-6 py-24 content-width-wide border-t border-border">
        <div className="content-width mb-12">
          <span className="section-label">Domains</span>
          <h2 className="font-display font-bold text-3xl tracking-tight mt-3 text-foreground">
            Areas of expertise
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 content-width">
          {domains.map(({ title, description }) => (
            <div
              key={title}
              className="flex flex-col gap-2 p-5 rounded-xl border border-border transition-all hover:border-(--gold)/40"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: "var(--gold)" }}
                />
                <h3 className="text-sm font-semibold text-foreground">
                  {title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-4">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-24 content-width-wide border-t border-border">
        <div className="content-width mb-12 flex items-end justify-between">
          <div>
            <span className="section-label">Selected Projects</span>
            <h2 className="font-display font-bold text-3xl tracking-tight mt-3 text-foreground">
              Featured work
            </h2>
          </div>
          <Link
            href="/work"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 shrink-0"
          >
            All projects <MoveRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="content-width flex flex-col">
          {featured.map(({ slug, domain }, i) => {
            const project = getProjectBySlug(slug);
            const resolved = project ? resolveLocale(project, "en") : null;
            const name = resolved?.name ?? "Project";
            const tagline = resolved?.tagline ?? "";
            const stack = resolved?.stack ?? [];

            return (
              <Link
                key={slug}
                href={`/work/${slug}`}
                className={`group flex flex-col sm:flex-row sm:items-start gap-4 py-8 transition-all hover:opacity-80 ${i < featured.length - 1 ? "border-b border-border" : ""}`}
              >
                <div className="sm:w-44 shrink-0">
                  <span className="badge-gold">{domain}</span>
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <h3 className="text-base font-semibold text-foreground leading-snug">
                    {name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tagline}
                  </p>
                </div>
                <div className="sm:w-52 shrink-0 flex flex-col gap-2 sm:items-end">
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
                    Case study <MoveRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="px-6 py-24 content-width-wide border-t border-border bg-surface">
        <div className="content-width">
          <span className="section-label">Labs</span>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-10 items-start">
            <div className="flex flex-col gap-4">
              <h2 className="font-display font-bold text-2xl tracking-tight text-foreground">
                Technical demos, live.
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Labs is where architecture becomes interactive. Agentic
                workflows, data pipelines, and system simulations shown as
                running systems, not slides.
              </p>
              <Link
                href="/labs"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-70 transition-opacity mt-2"
              >
                Explore Labs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div
              className="rounded-lg border border-border bg-background p-6 text-xs text-muted-foreground leading-loose"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              <div className="text-foreground text-[10px] tracking-widest uppercase mb-4 opacity-60">
                Agent Pipeline · ADK + MCP
              </div>
              {[
                "User Query",
                "  ↓  ADK Orchestrator",
                "  ↓  MCP Toolbox (Jira / Looker / BQ)",
                "  ↓  Vertex AI (Gemini)",
                "  ↓  Tool Call: [search, query, fetch]",
                "  ↓  Response + Citations",
              ].map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 content-width-wide border-t border-border">
        <div className="content-width grid grid-cols-1 sm:grid-cols-2 gap-12 items-start">
          <div className="flex flex-col gap-4">
            <span className="section-label">About</span>
            <p className="text-base text-muted-foreground leading-relaxed">
              I work at the intersection of software engineering, cloud
              infrastructure, and applied AI. My focus is building systems that
              perform in production and scale under real constraints.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
            >
              How I build <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div
            className="rounded-xl border p-8 flex flex-col gap-6"
            style={{
              backgroundColor: "var(--hero-bg)",
              borderColor: "var(--hero-border)",
            }}
          >
            <div>
              <h3
                className="font-display font-bold text-xl tracking-tight mb-2"
                style={{ color: "var(--hero-text)" }}
              >
                Let&apos;s talk
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--hero-muted)" }}
              >
                Available for senior engineering positions and architecture
                consulting.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-85"
                style={{
                  backgroundColor: "var(--gold)",
                  color: "var(--hero-bg)",
                }}
              >
                Get in touch <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

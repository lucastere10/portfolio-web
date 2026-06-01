import Link from "next/link";
import { ArrowRight, ChevronDown, MoveRight } from "lucide-react";
import {
  getFeaturedProjects,
  getProjectBySlug,
  resolveLocale,
} from "@/lib/projects";

const domains = [
  {
    title: "Backend Engineering",
    description:
      "Java, Python and .NET/C# services with resilient APIs, asynchronous workloads, and high-availability architecture.",
  },
  {
    title: "AI Agents & Automation",
    description:
      "Multi-agent workflows with ADK, Vertex AI, and MCP integrations to automate business operations end-to-end.",
  },
  {
    title: "Cloud Architecture / GCP",
    description:
      "Cloud Run, BigQuery, Pub/Sub, IAM, and serverless-first platform design that scales with predictable cost and reliability.",
  },
  {
    title: "MLOps & Data Pipelines",
    description:
      "Orchestrated pipelines with Airflow DAGs, model lifecycle operations, and production-ready ML systems that stay observable.",
  },
];

export default function HomePage() {
  const featured = getFeaturedProjects();

  return (
    <>
      <section
        className="relative w-full min-h-dvh flex flex-col overflow-hidden"
        style={{ background: "var(--hero-bg)" }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: "var(--gold)" }}
        />
        <div
          className="hero-grid-drift absolute inset-0 opacity-45 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--hero-grid-dot) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div
          className="animate-hero-orb-a absolute -top-24 -left-12 w-136 h-136 rounded-full blur-3xl pointer-events-none"
          style={{ background: "var(--hero-glow-1)" }}
        />
        <div
          className="animate-hero-orb-b absolute -bottom-24 -right-10 w-md h-112 rounded-full blur-3xl pointer-events-none"
          style={{ background: "var(--hero-glow-2)" }}
        />

        <div className="relative flex-1 content-width-wide mx-auto px-6 flex flex-col justify-center py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="flex flex-col gap-8">
              <div className="hero-fade-0 flex items-center gap-3">
                <span
                  className="animate-pulse-dot inline-block w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: "var(--status-green)" }}
                />
                <span
                  className="text-mono text-xs tracking-[0.22em] uppercase"
                  style={{ color: "var(--gold)" }}
                >
                  Backend Engineering · AI Automation · GCP
                </span>
              </div>
              <div className="hero-fade-1 flex flex-col gap-5">
                <h1
                  className="font-sans font-black uppercase tracking-[-0.02em] max-w-xl"
                  style={{
                    fontSize: "clamp(1.75rem, 4.2vw, 3.2rem)",
                    lineHeight: "1.05",
                    color: "var(--hero-text)",
                  }}
                >
                  Building reliable systems.
                  <br />
                  Solving complex problems.
                </h1>
                <p
                  className="text-mono text-[11px] leading-none tracking-[0.16em] uppercase"
                  style={{ color: "var(--hero-muted)" }}
                >
                  Lucas Caldas
                </p>
              </div>
              <p
                className="hero-fade-2 text-base leading-relaxed max-w-xl"
                style={{ color: "var(--hero-muted)" }}
              >
                I build with quality, earn trust through consistency, and solve
                hard problems with clear and reliable execution.
              </p>
              <div className="hero-fade-2 flex flex-wrap gap-2.5 max-w-xl">
                {domains.map((domain) => (
                  <span
                    key={domain.title}
                    className="text-mono text-[10px] tracking-[0.14em] uppercase px-3 py-1 rounded-full border"
                    style={{
                      color: "var(--hero-text)",
                      borderColor: "var(--hero-border)",
                      backgroundColor: "var(--hero-chip-bg)",
                    }}
                  >
                    {domain.title}
                  </span>
                ))}
              </div>
              <div className="hero-fade-3 flex items-center gap-4 flex-wrap">
                <Link
                  href="/work"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-opacity hover:opacity-85"
                  style={{
                    backgroundColor: "var(--gold)",
                    color: "var(--hero-bg)",
                  }}
                >
                  See Delivery Cases <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium border transition-all hover:border-(--gold)/60"
                  style={{
                    backgroundColor: "var(--hero-panel)",
                    borderColor: "var(--hero-border)",
                    color: "var(--hero-text)",
                  }}
                >
                  Architecture Approach
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div
                className="hero-panel-in hero-panel-float rounded-xl overflow-hidden border"
                style={{
                  backgroundColor: "var(--hero-panel)",
                  borderColor: "var(--hero-border)",
                }}
              >
                <div className="h-0.5" style={{ background: "var(--gold)" }} />
                <div
                  className="flex items-center justify-between px-5 py-4 border-b"
                  style={{ borderColor: "var(--hero-border)" }}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="animate-pulse-dot inline-block w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: "var(--status-green)" }}
                    />
                    <span
                      className="text-mono text-xs tracking-[0.14em] uppercase"
                      style={{ color: "var(--hero-text)" }}
                    >
                      Delivery Pipeline
                    </span>
                  </div>
                  <span
                    className="text-mono text-[10px] tracking-[0.12em] px-2.5 py-0.5 rounded-full uppercase border"
                    style={{
                      color: "var(--status-green)",
                      borderColor: "oklch(0.72 0.18 145 / 0.30)",
                      backgroundColor: "oklch(0.72 0.18 145 / 0.10)",
                    }}
                  >
                    ACTIVE
                  </span>
                </div>
                <div
                  className="px-5 py-4 border-b"
                  style={{ borderColor: "var(--hero-border)" }}
                >
                  <p
                    className="text-mono text-[10px] tracking-[0.16em] uppercase mb-3"
                    style={{ color: "var(--gold)" }}
                  >
                    Outcome Focus
                  </p>
                  <div className="flex flex-col gap-0.5">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--hero-text)" }}
                    >
                      Reliable backend systems and automated decision flows
                    </span>
                    <span
                      className="text-mono text-xs"
                      style={{ color: "var(--hero-muted)" }}
                    >
                      Architected for scale, observability, and fast iteration
                    </span>
                  </div>
                </div>
                <div
                  className="px-5 py-4 border-b"
                  style={{ borderColor: "var(--hero-border)" }}
                >
                  <p
                    className="text-mono text-[10px] tracking-[0.16em] uppercase mb-3"
                    style={{ color: "var(--gold)" }}
                  >
                    Core Expertise
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {domains.slice(0, 4).map((domain) => (
                      <li
                        key={domain.title}
                        className="flex items-center gap-2.5 text-sm"
                        style={{ color: "var(--hero-text)" }}
                      >
                        <span style={{ color: "var(--gold)" }}>›</span>
                        {domain.title}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-5 py-4">
                  <p
                    className="text-mono text-[10px] tracking-[0.16em] uppercase mb-3"
                    style={{ color: "var(--gold)" }}
                  >
                    Active Stack
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {[
                      "Python · C# · TypeScript",
                      "GCP · Vertex AI · ADK",
                      "MLOps · Airflow DAGs · Apache",
                    ].map((line) => (
                      <p
                        key={line}
                        className="text-mono text-xs"
                        style={{ color: "var(--hero-muted)" }}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className="hero-fade-4 rounded-xl border-2 p-4"
                style={{
                  backgroundColor: "var(--hero-panel)",
                  borderColor: "var(--gold)",
                  boxShadow:
                    "0 0 0 1px var(--hero-border), 0 10px 30px oklch(0.10 0.02 260 / 0.22)",
                }}
              >
                <label
                  htmlFor="hero-site-query"
                  className="text-mono text-[10px] tracking-[0.16em] uppercase mb-2 block"
                  style={{ color: "var(--gold)" }}
                >
                  What are you looking for?
                </label>
                <input
                  id="hero-site-query"
                  name="hero-site-query"
                  type="text"
                  placeholder="Ex: AI agent for operations, scalable backend, or MLOps pipeline"
                  className="w-full rounded-md border px-3 py-2 text-sm bg-transparent focus:outline-none focus:ring-2"
                  style={{
                    borderColor: "var(--hero-border)",
                    color: "var(--hero-text)",
                    boxShadow: "0 0 0 0 transparent",
                  }}
                />
                <p
                  className="text-mono text-[10px] tracking-[0.08em] mt-2"
                  style={{ color: "var(--hero-muted)" }}
                >
                  Describe your challenge and discover relevant solutions.
                </p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
            <span
              className="text-mono text-[9px] tracking-[0.22em] uppercase"
              style={{ color: "var(--hero-muted)" }}
            >
              Scroll
            </span>
            <ChevronDown
              className="animate-scroll-bounce w-4 h-4"
              style={{ color: "var(--hero-muted)" }}
            />
          </div>
        </div>
      </section>

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

      <section className="px-6 py-24 content-width-wide border-t border-border bg-(--color-surface)">
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

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import {
  getPersonalProjectBySlug,
  personalProjects,
  type PersonalProject,
  type PersonalProjectHero,
} from "@/lib/personal-projects";

type Props = { params: Promise<{ slug: string }> };

const DEFAULT_HERO: PersonalProjectHero = {
  label: "Personal Project",
  accent: "var(--gold)",
  background:
    "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getPersonalProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.overview.slice(0, 160),
  };
}

export function generateStaticParams() {
  return personalProjects.map((p) => ({ slug: p.slug }));
}

function ProjectHeroVisual({
  name,
  hero,
}: {
  name: string;
  hero: PersonalProjectHero;
}) {
  return (
    <div
      className="relative mb-16 aspect-[16/9] rounded-xl border border-border overflow-hidden"
      style={{ background: hero.background }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, ${hero.accent} 0%, transparent 40%), radial-gradient(circle at 80% 30%, ${hero.accent} 0%, transparent 35%)`,
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-6">
          <p
            className="text-mono text-xs uppercase tracking-[0.2em] mb-2"
            style={{ color: hero.accent }}
          >
            {hero.label}
          </p>
          <p className="font-display font-bold text-2xl sm:text-3xl text-white/90">
            {name}
          </p>
          <p className="text-sm text-white/50 mt-2 max-w-md mx-auto">
            Interactive preview — try the live demo for the full experience
          </p>
        </div>
      </div>
    </div>
  );
}

function ProjectLinks({ project }: { project: PersonalProject }) {
  return (
    <div className="flex flex-wrap gap-3">
      {project.links.demo && (
        <a
          href={project.links.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-opacity hover:opacity-85"
          style={{
            backgroundColor: "var(--gold)",
            color: "var(--background)",
          }}
        >
          Try live demo
          <ArrowUpRight className="w-4 h-4" />
        </a>
      )}
      {project.links.github && (
        <a
          href={project.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-[var(--color-surface)] transition-colors"
        >
          {project.links.repo ? "GitHub (Web)" : "GitHub"}
        </a>
      )}
      {project.links.repo && (
        <a
          href={project.links.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-[var(--color-surface)] transition-colors"
        >
          GitHub (API)
        </a>
      )}
    </div>
  );
}

export default async function PersonalProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getPersonalProjectBySlug(slug);
  if (!project) notFound();

  const hero = project.hero ?? DEFAULT_HERO;

  return (
    <div className="px-6 py-20 content-width-wide">
      <div className="content-width">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-12"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> All personal projects
        </Link>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="badge-gold">{project.domain}</span>
            <span className="text-mono text-[10px] uppercase text-muted-foreground border border-border rounded px-2 py-0.5">
              {project.status === "live" ? "Live" : project.status}
            </span>
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight mb-4">
            {project.name}
          </h1>
          <p className="text-base text-muted-foreground mb-8 max-w-[42rem] leading-relaxed">
            {project.tagline}
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="text-mono text-xs text-muted-foreground border border-border rounded px-2.5 py-1"
              >
                {tech}
              </span>
            ))}
          </div>

          <ProjectLinks project={project} />
        </div>

        <ProjectHeroVisual name={project.name} hero={hero} />

        {project.metrics && project.metrics.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16 p-6 rounded-xl border border-border bg-[var(--color-surface)]">
            {project.metrics.map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-1">
                <span
                  className="text-mono text-lg font-bold"
                  style={{ color: "var(--gold)" }}
                >
                  {value}
                </span>
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-16">
          <section>
            <span className="section-label">Overview</span>
            <p className="mt-5 text-base text-foreground leading-relaxed">
              {project.overview}
            </p>
          </section>

          <div className="border-t border-border" />

          <section>
            <span className="section-label">Highlights</span>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.highlights.map((highlight, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-[var(--color-surface)] p-4"
                >
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {highlight}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="border-t border-border" />

          <section>
            <span className="section-label">Features</span>
            <ul className="mt-5 flex flex-col gap-3">
              {project.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-base text-muted-foreground leading-relaxed"
                >
                  <span style={{ color: "var(--gold)" }} className="shrink-0">
                    ›
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="border-t border-border" />

          <section>
            <span className="section-label">Technical</span>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed">
              {project.technicalNotes}
            </p>
          </section>

          {project.learnings && project.learnings.length > 0 && (
            <>
              <div className="border-t border-border" />
              <section>
                <span className="section-label">Learnings</span>
                <ul className="mt-5 flex flex-col gap-3">
                  {project.learnings.map((learning, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-base text-muted-foreground leading-relaxed"
                    >
                      <span className="text-mono text-xs text-muted-foreground/50 mt-1 shrink-0 w-5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{learning}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}
        </div>

        <div className="border-t border-border mt-20 pt-10 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" /> All personal projects
          </Link>
          {project.links.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: "var(--gold)" }}
            >
              Open live demo
              <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

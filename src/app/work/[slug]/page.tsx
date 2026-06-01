import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getProjectBySlug, projects, resolveLocale } from "@/lib/projects";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cs = getProjectBySlug(slug);
  if (!cs) return {};
  const resolved = resolveLocale(cs, "en");
  return { title: resolved.name, description: resolved.context.slice(0, 160) };
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const cs = getProjectBySlug(slug);
  if (!cs) notFound();
  const resolved = resolveLocale(cs, "en");

  return (
    <div className="px-6 py-20 content-width-wide">
      <div className="content-width">
        <Link
          href="/work"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-12"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> All projects
        </Link>

        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="badge-gold">{resolved.domain}</span>
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl tracking-tight mb-4">
            {resolved.name}
          </h1>
          <p className="text-base text-muted-foreground mb-8 max-w-[42rem] leading-relaxed">
            {resolved.tagline}
          </p>
          <div className="flex flex-wrap gap-2">
            {resolved.stack.map((tech) => (
              <span
                key={tech}
                className="text-mono text-xs text-muted-foreground border border-border rounded px-2.5 py-1"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {resolved.metrics && resolved.metrics.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-16 p-6 rounded-xl border border-border bg-[var(--color-surface)]">
            {resolved.metrics.map(({ label, value }) => (
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
            <span className="section-label">Context</span>
            <p className="mt-5 text-base text-foreground leading-relaxed">
              {resolved.context}
            </p>
          </section>

          <div className="border-t border-border" />

          <section>
            <span className="section-label">Challenges</span>
            <ul className="mt-5 flex flex-col gap-3">
              {resolved.challenges.map((challenge, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-base text-muted-foreground leading-relaxed"
                >
                  <span className="text-mono text-xs text-muted-foreground/50 mt-1 shrink-0 w-5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{challenge}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="border-t border-border" />

          <section>
            <span className="section-label">Architecture Decisions</span>
            <div className="mt-6 flex flex-col gap-8">
              {resolved.decisions.map(({ title, reasoning }, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: "var(--gold)" }}
                    />
                    <h3 className="text-sm font-semibold text-foreground">
                      {title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-4">
                    {reasoning}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <span className="section-label">Trade-offs</span>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed">
              {resolved.tradeoffs}
            </p>
          </section>

          <div className="border-t border-border" />

          <section>
            <span className="section-label">Implementation</span>
            <p className="mt-5 text-base text-muted-foreground leading-relaxed">
              {resolved.implementation}
            </p>
          </section>

          <div className="border-t border-border" />

          <section>
            <span className="section-label">Impact</span>
            <p className="mt-5 text-base text-foreground leading-relaxed font-medium">
              {resolved.impact}
            </p>
          </section>

          <div className="border-t border-border" />

          <section>
            <span className="section-label">Learnings</span>
            <ul className="mt-5 flex flex-col gap-3">
              {resolved.learnings.map((learning, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-base text-muted-foreground leading-relaxed"
                >
                  <span style={{ color: "var(--gold)" }} className="shrink-0">
                    ›
                  </span>
                  <span>{learning}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="border-t border-border mt-20 pt-10">
          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" /> All projects
          </Link>
        </div>
      </div>
    </div>
  );
}

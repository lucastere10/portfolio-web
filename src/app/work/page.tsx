"use client";

import { useState } from "react";
import Link from "next/link";
import { MoveRight } from "lucide-react";
import {
  projects,
  resolveLocale,
  getProjectBySlug,
  type Domain,
} from "@/lib/projects";

const allDomains: Domain[] = [
  "AI Agents",
  "Cloud Architecture",
  "Backend Engineering",
  "Payment Systems",
  "Data Engineering",
  "Computer Vision",
];

export default function WorkPage() {
  const [active, setActive] = useState<Domain | null>(null);

  const filtered = active
    ? projects.filter((p) => p.domain === active)
    : projects;

  return (
    <div className="px-6 py-20 content-width-wide">
      <div className="content-width">
        {/* Header */}
        <div className="mb-12">
          <p className="text-mono text-xs tracking-widest uppercase text-muted-foreground mb-4">
            Work
          </p>
          <h1 className="font-display font-bold text-4xl tracking-tight mb-4">
            Projects
          </h1>
          <p className="text-base text-muted-foreground max-w-[36rem] leading-relaxed">
            Systems I designed and built: from backend and payment integrations
            to AI agents and cloud architecture. Each entry includes a detailed
            case study.
          </p>
        </div>

        {/* Domain filters */}
        <div className="flex flex-wrap gap-2 mb-12">
          <button
            onClick={() => setActive(null)}
            className={`text-mono text-xs px-3 py-1.5 rounded border transition-colors cursor-pointer ${
              active === null
                ? "border-[var(--gold)] bg-[var(--gold-dim)] text-[var(--gold)]"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
            }`}
          >
            All
          </button>
          {allDomains.map((domain) => (
            <button
              key={domain}
              onClick={() => setActive(active === domain ? null : domain)}
              className={`text-mono text-xs px-3 py-1.5 rounded border transition-colors cursor-pointer ${
                active === domain
                  ? "border-[var(--gold)] bg-[var(--gold-dim)] text-[var(--gold)]"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
              }`}
            >
              {domain}
            </button>
          ))}
        </div>

        {/* Project list */}
        <div className="flex flex-col">
          {filtered.map(({ slug, domain }, i) => {
            const project = getProjectBySlug(slug);
            const resolved = project ? resolveLocale(project, "en") : null;
            const name = resolved?.name ?? "Project";
            const tagline = resolved?.tagline ?? "";
            const stack = resolved?.stack ?? [];

            return (
              <Link
                key={slug}
                href={`/work/${slug}`}
                className={`group flex flex-col sm:flex-row sm:items-start gap-4 py-8 ${
                  i < filtered.length - 1 ? "border-b border-border" : ""
                } hover:opacity-75 transition-opacity`}
              >
                {/* Domain */}
                <div className="sm:w-48 shrink-0">
                  <span className="badge-gold">{domain}</span>
                </div>

                {/* Name + Tagline */}
                <div className="flex-1 flex flex-col gap-1">
                  <h2 className="text-base font-semibold text-foreground leading-snug">
                    {name}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tagline}
                  </p>
                </div>

                {/* Stack + arrow */}
                <div className="sm:w-56 shrink-0 flex flex-col gap-2 sm:items-end">
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

          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground py-12 text-center">
              No projects in this category yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

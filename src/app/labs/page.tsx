import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LABS_BY_DOMAIN } from "@/lib/labs";

export const metadata: Metadata = {
  title: "Labs",
  description:
    "Interactive technical demos with CI/CD, agents, cloud architecture, and MLOps simulations.",
};

export default function LabsPage() {
  return (
    <div className="px-6 py-20 content-width-wide">
      <div className="content-width-wide">
        <div className="mb-16">
          <span className="section-label">Labs</span>
          <h1 className="font-display font-bold text-4xl tracking-tight mb-4 mt-3">
            Interactive Technical Demos
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
            Enter a simulation, interact with the system, decode complex
            architecture decisions, and see technical depth through behavior.
          </p>
        </div>

        <div className="flex flex-col gap-10">
          {LABS_BY_DOMAIN.map(({ domain, labs }) => (
            <section
              key={domain}
              className="rounded-xl border border-border bg-card/55 p-5 sm:p-6 labs-grid-bg"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">{domain}</h2>
                <span className="text-mono text-[10px] uppercase text-muted-foreground border border-border rounded px-2 py-1">
                  {labs.length} labs
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {labs.map((lab) => (
                  <Link
                    key={lab.slug}
                    href={`/labs/${lab.slug}`}
                    className="group rounded-lg border border-border bg-background/90 p-4 transition-all hover:border-(--gold-border) hover:bg-(--gold-dim)"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-semibold text-foreground">
                        {lab.title}
                      </h3>
                      <ArrowRight className="w-4 h-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                      {lab.summary}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {lab.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-mono text-[10px] border border-border rounded px-1.5 py-0.5 text-muted-foreground uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 pt-10 border-t border-border flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground max-w-152">
            Want a guided walkthrough? I can explain the architecture decisions
            behind each interaction.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/labs/insights"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
            >
              Insights <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
            >
              Contact <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

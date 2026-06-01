import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "Software engineer focused on building reliable systems across backend, AI agents, cloud architecture, and MLOps.",
};

const focusAreas = [
  {
    title: "AI Agents & Automation",
    detail:
      "Multi-agent systems with ADK, Vertex AI, and MCP Toolbox. Agents that integrate Jira, Looker, and BigQuery autonomously.",
  },
  {
    title: "Cloud Architecture / GCP",
    detail:
      "Cloud Run, BigQuery, IAM, Pub/Sub, and serverless patterns. Infrastructure that scales without operational overhead.",
  },
  {
    title: "Payment Systems",
    detail:
      "Stripe and PIX integrations. Event-driven webhooks, mTLS authentication, and subscription lifecycle management.",
  },
  {
    title: "Backend Engineering",
    detail:
      "Python, .NET/C#, and TypeScript. Decoupled microservices, message queues, and high-reliability REST APIs.",
  },
];

export default function AboutPage() {
  return (
    <div className="px-6 py-20 content-width-wide">
      <div className="content-width">
        <p className="text-mono text-xs tracking-widest uppercase text-muted-foreground mb-4">
          About
        </p>
        <h1 className="font-display font-bold text-4xl tracking-tight mb-10">
          Lucas Caldas
        </h1>

        <div className="flex flex-col gap-5 max-w-[38rem] mb-20">
          <p className="text-base text-foreground leading-relaxed">
            I build reliable systems across backend engineering, AI agents, and
            cloud architecture. My work is centered on production-ready
            services, automation workflows, and platform decisions that hold
            under real operational pressure.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            I focus on clear execution: reducing complexity, improving
            reliability, and shipping systems that teams can trust in
            production.
          </p>
        </div>

        <div className="border-t border-border mb-16" />

        <section className="mb-20">
          <span className="section-label">Focus Areas</span>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
            {focusAreas.map(({ title, detail }) => (
              <div key={title} className="flex flex-col gap-1.5">
                <h3 className="text-sm font-semibold text-foreground">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="border-t border-border mb-16" />

        <section>
          <span className="section-label">Links</span>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="https://linkedin.com/in/lucas-caldas50"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              LinkedIn <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="https://github.com/lucastere10"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-70 transition-opacity"
            >
              Contact <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

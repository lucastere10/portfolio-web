import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Labs",
  description: "Technical demos with agentic workflows, data pipelines, and live system simulations.",
};

const entries = [
  {
    id: "agentic-workflow",
    domain: "AI Agents",
    name: "ADK Multi-Agent Workflow",
    description:
      "Interactive view of a multi-agent workflow with ADK + MCP Toolbox: memory, tool use, and reasoning steps.",
    status: "coming-soon",
  },
  {
    id: "data-pipeline-dag",
    domain: "Data Engineering",
    name: "Data Pipeline - DAG Viewer",
    description:
      "Live DAG viewer with run history, node expansion, and dependency graph.",
    status: "coming-soon",
  },
  {
    id: "cicd-flow",
    domain: "Cloud Architecture",
    name: "Cloud-Native CI/CD Pipeline",
    description:
      "CI/CD flow visualization: build, tests, security scan, staging, and promotion to production on GCP.",
    status: "coming-soon",
  },
  {
    id: "mcp-toolbox",
    domain: "AI Agents",
    name: "MCP Toolbox - Tool Integration",
    description:
      "Demo of MCP Toolbox connecting Vertex AI agents to data sources (BigQuery, Jira, Looker) through a standard protocol.",
    status: "coming-soon",
  },
];

export default function LabsPage() {
  return (
    <div className="px-6 py-20 content-width-wide">
      <div className="content-width">
        <div className="mb-16">
          <span className="section-label">Labs</span>
          <h1 className="font-display font-bold text-4xl tracking-tight mb-4 mt-3">Technical Demos</h1>
          <p className="text-base text-muted-foreground max-w-[38rem] leading-relaxed">
            Architecture as a running system, not a slide. Each entry is an interactive technical demonstration showing how the pieces connect in practice.
          </p>
        </div>

        <div className="flex flex-col gap-0">
          {entries.map(({ id, domain, name, description, status }, i) => (
            <div key={id} className={`flex flex-col sm:flex-row sm:items-start gap-4 py-8 ${i < entries.length - 1 ? "border-b border-border" : ""}`}>
              <div className="sm:w-52 shrink-0">
                <span className="text-mono text-xs text-muted-foreground">{domain}</span>
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <h3 className="text-base font-semibold text-foreground leading-snug">{name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[42rem]">{description}</p>
              </div>
              <div className="sm:w-36 shrink-0 sm:text-right">
                <span className="text-mono text-[10px] text-muted-foreground border border-border rounded px-2 py-1 uppercase">
                  {status === "coming-soon" ? "Coming soon" : status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-10 border-t border-border flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground max-w-[36rem]">
            If you want a live walkthrough of any of these demos, use the contact page.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-70 transition-opacity">
            Contact <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

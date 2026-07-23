"use client";

import { useState } from "react";
import { MetricCard } from "@/components/labs/metric-card";
import { NarrativeProgress } from "@/components/labs/narrative-progress";
import {
  SCENARIO_FACTORS,
  type ScenarioPreset,
  ScenarioPresetBar,
} from "@/components/labs/scenario-presets";
import { SimulationConsole } from "@/components/labs/simulation-console";
import { useLabAnalytics } from "@/components/labs/use-lab-analytics";
import type { LabDefinition } from "@/content/schemas";

const stages = ["Agent", "MCP Server", "GitHub", "Jira", "Database"];

const details: Record<
  string,
  { title: string; body: string; latency: string }
> = {
  Agent: {
    title: "Agent",
    body: "Plans the request and chooses tool intents based on context and policy.",
    latency: "31ms",
  },
  "MCP Server": {
    title: "MCP Server",
    body: "Normalizes tool contracts and routes calls with auth + capability guards.",
    latency: "24ms",
  },
  GitHub: {
    title: "GitHub",
    body: "Queries code artifacts and issue references as structured context.",
    latency: "63ms",
  },
  Jira: {
    title: "Jira",
    body: "Fetches delivery signals and ticket metadata for operational context.",
    latency: "57ms",
  },
  Database: {
    title: "Database",
    body: "Retrieves domain records for final synthesis and answer grounding.",
    latency: "42ms",
  },
};

export function McpExplorerDemo({ lab }: { lab: LabDefinition }) {
  const [preset, setPreset] = useState<ScenarioPreset>("happy");
  const [selected, setSelected] = useState(stages[0]);
  const track = useLabAnalytics(lab.slug);
  const factors = SCENARIO_FACTORS[preset];
  const selectedIndex = stages.indexOf(selected);
  const current = details[selected];

  const logs = stages
    .slice(0, selectedIndex + 1)
    .map((stage, idx) => `[trace-${idx + 1}] request reached ${stage}`);

  return (
    <div className="flex flex-col gap-4">
      <ScenarioPresetBar
        value={preset}
        onChange={(nextPreset) => {
          setPreset(nextPreset);
          track("preset_select", nextPreset);
        }}
      />
      <p className="text-sm text-muted-foreground">
        Click a stage to inspect request flow and protocol boundary details.
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {stages.map((stage, index) => (
          <button
            key={stage}
            type="button"
            onClick={() => {
              setSelected(stage);
              track("stage_select", stage);
            }}
            className={`rounded-md border px-3 py-1.5 text-sm transition-all cursor-pointer ${
              selected === stage
                ? "border-gold bg-(--gold-dim) text-foreground anim-flow-pulse"
                : "border-border bg-background text-muted-foreground hover:text-foreground"
            }`}
          >
            {stage}
            {index < stages.length - 1 && (
              <span className="ml-2 text-xs opacity-60">↓</span>
            )}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-background/80 p-4">
        <p className="text-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
          Current stage
        </p>
        <h3 className="text-lg font-semibold mt-1">{current.title}</h3>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          {current.body}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricCard
          label="Stage"
          value={`${selectedIndex + 1}/${stages.length}`}
          tone="neutral"
        />
        <MetricCard
          label="Hop latency"
          value={`${Math.round(Number.parseInt(current.latency, 10) / factors.speed)}ms`}
          tone="good"
        />
        <MetricCard
          label="Trace completeness"
          value={`${Math.round((selectedIndex + 1) * 20 * factors.reliability)}%`}
          tone={selectedIndex > 2 ? "good" : "warning"}
        />
      </div>

      <SimulationConsole lines={logs.map((line) => `${line} [${preset}]`)} />
      <NarrativeProgress
        items={lab.narrative}
        activeIndex={Math.min(selectedIndex, lab.narrative.length - 1)}
      />
    </div>
  );
}

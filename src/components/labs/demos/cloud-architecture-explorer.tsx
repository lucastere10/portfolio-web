"use client";

import { useState } from "react";
import { MetricCard } from "@/components/labs/metric-card";
import { NarrativeProgress } from "@/components/labs/narrative-progress";
import {
  SCENARIO_FACTORS,
  type ScenarioPreset,
  ScenarioPresetBar,
} from "@/components/labs/scenario-presets";
import { useLabAnalytics } from "@/components/labs/use-lab-analytics";
import type { LabDefinition } from "@/lib/labs";

const components = ["Cloud Run", "Pub/Sub", "Worker", "BigQuery"];

const catalog: Record<
  string,
  {
    responsibilities: string;
    tradeoffs: string;
    costs: string;
    scalability: string;
  }
> = {
  "Cloud Run": {
    responsibilities: "API ingress and lightweight request normalization.",
    tradeoffs: "Fast iteration, but requires strong cold-start tuning for p95.",
    costs: "Pay-per-use and efficient for bursty workloads.",
    scalability:
      "Horizontal scaling with concurrency and min-instances guardrails.",
  },
  "Pub/Sub": {
    responsibilities: "Decouple ingestion from processing and absorb spikes.",
    tradeoffs: "At-least-once semantics require idempotent consumers.",
    costs: "Low unit cost, but backlog growth impacts total spend.",
    scalability: "Massive fan-out and high throughput with queue partitioning.",
  },
  Worker: {
    responsibilities: "Run async business logic and enrichment workloads.",
    tradeoffs: "Needs retry policy and dead-letter strategy for poison events.",
    costs: "Compute cost scales with CPU/memory request profile.",
    scalability: "Parallel consumers with backpressure-aware autoscaling.",
  },
  BigQuery: {
    responsibilities: "Serve analytical workloads and ad hoc exploration.",
    tradeoffs: "Query patterns must be optimized to avoid waste.",
    costs: "Storage cheap; query costs depend on scanned bytes.",
    scalability: "Elastic analytics layer with near real-time ingestion.",
  },
};

export function CloudArchitectureExplorerDemo({ lab }: { lab: LabDefinition }) {
  const [preset, setPreset] = useState<ScenarioPreset>("happy");
  const [selected, setSelected] = useState(components[0]);
  const track = useLabAnalytics(lab.slug);
  const factors = SCENARIO_FACTORS[preset];
  const index = components.indexOf(selected);
  const data = catalog[selected];

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
        Interactive architecture canvas. Open each component for practical
        decision context.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {components.map((component) => (
          <button
            key={component}
            type="button"
            onClick={() => {
              setSelected(component);
              track("component_select", component);
            }}
            className={`rounded-lg border px-3 py-2 text-left cursor-pointer ${
              component === selected
                ? "border-gold bg-(--gold-dim) anim-flow-pulse"
                : "border-border bg-background"
            }`}
          >
            <span className="text-sm font-medium">{component}</span>
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-background/90 p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold">{selected}</h3>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            {data.responsibilities}
          </p>
        </div>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Tradeoffs:</strong>{" "}
            {data.tradeoffs}
          </p>
          <p>
            <strong className="text-foreground">Costs:</strong> {data.costs}
          </p>
          <p>
            <strong className="text-foreground">Scalability:</strong>{" "}
            {data.scalability}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricCard label="Depth index" value={`${index + 1}/4`} tone="good" />
        <MetricCard
          label="Complexity"
          value={`${Math.round((45 + index * 12) / factors.speed)}%`}
          tone={index > 1 ? "warning" : "neutral"}
        />
        <MetricCard
          label="Cost pressure"
          value={`${Math.round((22 + index * 9) * factors.cost)}%`}
          tone={index > 2 || preset !== "happy" ? "warning" : "neutral"}
        />
      </div>

      <NarrativeProgress
        items={lab.narrative}
        activeIndex={Math.min(index, lab.narrative.length - 1)}
      />
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { MetricCard } from "@/components/labs/metric-card";
import { NarrativeProgress } from "@/components/labs/narrative-progress";
import {
  SCENARIO_FACTORS,
  type ScenarioPreset,
  ScenarioPresetBar,
} from "@/components/labs/scenario-presets";
import { useLabAnalytics } from "@/components/labs/use-lab-analytics";
import type { LabDefinition } from "@/lib/labs";

const levels = [100, 1000, 10000] as const;

export function AutoscalingSimulatorDemo({ lab }: { lab: LabDefinition }) {
  const [preset, setPreset] = useState<ScenarioPreset>("happy");
  const [traffic, setTraffic] = useState<number>(1000);
  const track = useLabAnalytics(lab.slug);
  const factors = SCENARIO_FACTORS[preset];

  const state = useMemo(() => {
    const instances = Math.max(2, Math.round((traffic / 700) * factors.cost));
    const latency = Math.round((95 + traffic / 120) / factors.speed);
    const cost = ((traffic / 280) * factors.cost).toFixed(2);

    return { instances, latency, cost };
  }, [factors.cost, factors.speed, traffic]);

  const stage = traffic === 100 ? 1 : traffic === 1000 ? 2 : 3;

  return (
    <div className="flex flex-col gap-4">
      <ScenarioPresetBar
        value={preset}
        onChange={(nextPreset) => {
          setPreset(nextPreset);
          track("preset_select", nextPreset);
        }}
      />
      <div className="rounded-lg border border-border bg-background/90 p-4">
        <label htmlFor="traffic" className="text-sm font-medium block mb-3">
          Traffic pressure: <span className="text-mono">{traffic} req/s</span>
        </label>
        <input
          id="traffic"
          name="traffic"
          type="range"
          min={0}
          max={2}
          step={1}
          value={levels.indexOf(traffic as (typeof levels)[number])}
          onChange={(e) => {
            const nextTraffic = levels[Number(e.target.value)];
            setTraffic(nextTraffic);
            track("traffic_change", `${nextTraffic}`);
          }}
          className="w-full"
        />
        <div className="flex justify-between mt-2 text-mono text-xs text-muted-foreground">
          <span>100 req/s</span>
          <span>1000 req/s</span>
          <span>10000 req/s</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricCard
          label="Instances"
          value={`${state.instances}`}
          tone={state.instances > 8 ? "warning" : "good"}
        />
        <MetricCard
          label="Latency (p95)"
          value={`${state.latency}ms`}
          tone={state.latency > 150 ? "warning" : "good"}
        />
        <MetricCard
          label="Cost / hour"
          value={`$${state.cost}`}
          tone={traffic >= 10000 ? "warning" : "neutral"}
        />
      </div>

      <div className="rounded-lg border border-border p-3">
        <p className="text-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground mb-2">
          Autoscaling interpretation
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          At{" "}
          <span className="text-foreground font-medium">{traffic} req/s</span>,
          autoscaling expands to
          <span className="text-foreground font-medium">
            {" "}
            {state.instances} instances
          </span>{" "}
          to keep latency near SLO boundaries. The model helps explain cost
          versus responsiveness tradeoffs.
        </p>
      </div>

      <NarrativeProgress
        items={lab.narrative}
        activeIndex={Math.min(stage, lab.narrative.length - 1)}
      />
    </div>
  );
}

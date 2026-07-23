"use client";

import { useMemo, useState } from "react";
import { MetricCard } from "@/components/labs/metric-card";
import { NarrativeProgress } from "@/components/labs/narrative-progress";
import {
  type ScenarioPreset,
  ScenarioPresetBar,
} from "@/components/labs/scenario-presets";
import { useLabAnalytics } from "@/components/labs/use-lab-analytics";
import type { LabDefinition } from "@/content/schemas";

export function DataDriftDemo({ lab }: { lab: LabDefinition }) {
  const [preset, setPreset] = useState<ScenarioPreset>("happy");
  const [drift, setDrift] = useState(25);
  const track = useLabAnalytics(lab.slug);

  const metrics = useMemo(() => {
    const accuracy = Math.max(45, 96 - drift * 0.5);
    const precision = Math.max(38, 93 - drift * 0.58);
    const recall = Math.max(35, 91 - drift * 0.62);

    return { accuracy, precision, recall };
  }, [drift]);

  const retrain = drift > 55;
  const stage = retrain ? 3 : drift > 35 ? 2 : 1;

  function applyPreset(nextPreset: ScenarioPreset) {
    setPreset(nextPreset);
    track("preset_select", nextPreset);

    if (nextPreset === "happy") {
      setDrift(20);
    }
    if (nextPreset === "degraded") {
      setDrift(48);
    }
    if (nextPreset === "outage") {
      setDrift(82);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <ScenarioPresetBar value={preset} onChange={applyPreset} />
      <div className="rounded-lg border border-border bg-background/90 p-4">
        <label htmlFor="drift" className="text-sm font-medium block mb-3">
          Distribution drift level: <span className="text-mono">{drift}%</span>
        </label>
        <input
          id="drift"
          name="drift"
          type="range"
          min={0}
          max={100}
          value={drift}
          onChange={(e) => {
            const nextDrift = Number(e.target.value);
            setDrift(nextDrift);
            track("drift_change", `${Math.round(nextDrift / 10) * 10}`);
          }}
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricCard
          label="Accuracy"
          value={`${metrics.accuracy.toFixed(1)}%`}
          tone={metrics.accuracy < 70 ? "critical" : "good"}
        />
        <MetricCard
          label="Precision"
          value={`${metrics.precision.toFixed(1)}%`}
          tone={metrics.precision < 70 ? "critical" : "good"}
        />
        <MetricCard
          label="Recall"
          value={`${metrics.recall.toFixed(1)}%`}
          tone={metrics.recall < 70 ? "critical" : "good"}
        />
      </div>

      <div
        className={`rounded-lg border p-3 ${retrain ? "border-red-500/35 bg-red-500/10 anim-alert-flash" : "border-border bg-background/70"}`}
      >
        <p className="text-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground mb-1">
          Model health verdict
        </p>
        <p className="text-sm font-medium">
          {retrain ? "Retraining Required" : "Model still stable"}
        </p>
      </div>

      <NarrativeProgress
        items={lab.narrative}
        activeIndex={Math.min(stage, lab.narrative.length - 1)}
      />
    </div>
  );
}

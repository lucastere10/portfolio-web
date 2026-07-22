"use client";

import { useState } from "react";
import { ControlBar } from "@/components/labs/control-bar";
import { useStepPlayback } from "@/components/labs/demo-utils";
import { FlowChain } from "@/components/labs/flow-chain";
import { MetricCard } from "@/components/labs/metric-card";
import { NarrativeProgress } from "@/components/labs/narrative-progress";
import {
  SCENARIO_FACTORS,
  type ScenarioPreset,
  ScenarioPresetBar,
} from "@/components/labs/scenario-presets";
import { useLabAnalytics } from "@/components/labs/use-lab-analytics";
import type { LabDefinition } from "@/content/schemas";

const stages = [
  "Dataset",
  "Training",
  "Validation",
  "Deployment",
  "Monitoring",
];

export function MlPipelineSimulatorDemo({ lab }: { lab: LabDefinition }) {
  const [preset, setPreset] = useState<ScenarioPreset>("happy");
  const track = useLabAnalytics(lab.slug);
  const factors = SCENARIO_FACTORS[preset];
  const { step, running, run, pause, reset } = useStepPlayback(
    stages.length,
    Math.round(950 / factors.speed),
  );

  return (
    <div className="flex flex-col gap-4">
      <ScenarioPresetBar
        value={preset}
        onChange={(nextPreset) => {
          setPreset(nextPreset);
          track("preset_select", nextPreset);
        }}
      />
      <ControlBar
        isRunning={running}
        onRun={() => {
          track("control_run", preset);
          run();
        }}
        onPause={() => {
          track("control_pause", preset);
          pause();
        }}
        onReset={() => {
          track("control_reset", preset);
          reset();
        }}
        runLabel="Run pipeline"
      />

      <FlowChain steps={stages} activeIndex={step} orientation="horizontal" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricCard
          label="Model score"
          value={`${Math.max(0.31, (0.78 + step * 0.03) * factors.reliability).toFixed(2)}`}
          tone={step > 2 ? "good" : "neutral"}
        />
        <MetricCard
          label="Validation checks"
          value={`${Math.round(Math.min(100, 34 + step * 18) * factors.reliability)}%`}
          tone={step > 2 ? "good" : "warning"}
        />
        <MetricCard
          label="Monitoring coverage"
          value={`${Math.round((12 + step * 20) * factors.cost)}%`}
          tone={step === 4 ? "good" : "neutral"}
        />
      </div>

      <NarrativeProgress
        items={lab.narrative}
        activeIndex={Math.min(step, lab.narrative.length - 1)}
      />
    </div>
  );
}

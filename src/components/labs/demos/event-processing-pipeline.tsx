"use client";

import { useMemo, useState } from "react";
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
import { SimulationConsole } from "@/components/labs/simulation-console";
import { useLabAnalytics } from "@/components/labs/use-lab-analytics";
import type { LabDefinition } from "@/lib/labs";

const pipeline = [
  "Upload File",
  "Cloud Storage",
  "Pub/Sub",
  "Cloud Run",
  "BigQuery",
];

export function EventProcessingPipelineDemo({
  lab,
}: Readonly<{ lab: LabDefinition }>) {
  const [preset, setPreset] = useState<ScenarioPreset>("happy");
  const track = useLabAnalytics(lab.slug);
  const factors = SCENARIO_FACTORS[preset];
  const { step, running, run, pause, reset } = useStepPlayback(
    pipeline.length,
    Math.round(800 / factors.speed),
  );

  const throughput = useMemo(
    () => `${Math.max(70, Math.round(step * 310 * factors.speed))} ev/min`,
    [factors.speed, step],
  );

  const logs = [
    "file uploaded by user session",
    "object finalized in storage bucket",
    "pubsub topic dispatched event",
    "worker consumed and transformed payload",
    "analytics row committed into BigQuery",
  ].slice(0, step + 1);

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
        runLabel="Send file events"
      />

      <FlowChain steps={pipeline} activeIndex={step} orientation="horizontal" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricCard label="Throughput" value={throughput} tone="good" />
        <MetricCard
          label="Processing lag"
          value={`${Math.round(Math.max(22, 120 - step * 21) / factors.speed)}ms`}
          tone={step < 2 ? "warning" : "good"}
        />
        <MetricCard
          label="Delivery confidence"
          value={`${68 + step * 7}%`}
          tone={step > 2 ? "good" : "warning"}
        />
      </div>

      <SimulationConsole
        lines={logs.map(
          (line, index) => `[event-${index + 1}] ${line} [${preset}]`,
        )}
      />
      <NarrativeProgress
        items={lab.narrative}
        activeIndex={Math.min(step, lab.narrative.length - 1)}
      />
    </div>
  );
}

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
import type { LabDefinition } from "@/content/schemas";

const flow = ["Fail Payment Service", "Retry #1", "Retry #2", "DLQ", "Alert"];

const logs = [
  "[00:00] User injected failure on payment service",
  "[00:01] Retry policy engaged (attempt 1)",
  "[00:02] Retry policy engaged (attempt 2)",
  "[00:03] Message moved to dead-letter queue",
  "[00:04] Alert fired: payments.pipeline.dlq_threshold",
];

export function RetryFailureSimulatorDemo({ lab }: { lab: LabDefinition }) {
  const [preset, setPreset] = useState<ScenarioPreset>("happy");
  const track = useLabAnalytics(lab.slug);
  const factors = SCENARIO_FACTORS[preset];
  const { step, running, run, pause, reset } = useStepPlayback(
    flow.length,
    Math.round(850 / factors.speed),
  );

  const metrics = useMemo(() => {
    if (step <= 1) {
      return {
        retries: "1/2",
        dlq: "0",
        alert: "No",
        tone: "warning" as const,
      };
    }
    if (step <= 2) {
      return {
        retries: "2/2",
        dlq: "0",
        alert: "No",
        tone: "warning" as const,
      };
    }
    if (step <= 3) {
      return {
        retries: "2/2",
        dlq: "1",
        alert: "Pending",
        tone: "critical" as const,
      };
    }

    return {
      retries: preset === "outage" ? "4/4" : "2/2",
      dlq: preset === "happy" ? "1" : preset === "degraded" ? "4" : "9",
      alert: "Triggered",
      tone: "critical" as const,
    };
  }, [preset, step]);

  function handlePresetChange(nextPreset: ScenarioPreset) {
    setPreset(nextPreset);
    track("preset_select", nextPreset);
  }

  return (
    <div className="flex flex-col gap-4">
      <ScenarioPresetBar value={preset} onChange={handlePresetChange} />
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
        runLabel="Fail Payment Service"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4">
        <FlowChain steps={flow} activeIndex={step} />
        <div className="grid grid-cols-1 gap-3">
          <MetricCard
            label="Retries"
            value={metrics.retries}
            tone={metrics.tone}
          />
          <MetricCard
            label="DLQ messages"
            value={metrics.dlq}
            tone={step >= 3 ? "critical" : "neutral"}
          />
          <MetricCard
            label="Alert"
            value={metrics.alert}
            tone={step >= 4 ? "critical" : "warning"}
          />
        </div>
      </div>

      <SimulationConsole
        lines={logs.slice(0, step + 1).map((line) => `${line} [${preset}]`)}
      />
      <NarrativeProgress
        items={lab.narrative}
        activeIndex={Math.min(step, lab.narrative.length - 1)}
      />
    </div>
  );
}

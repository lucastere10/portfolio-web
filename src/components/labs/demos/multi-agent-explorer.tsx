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
import { useLabAnalytics } from "@/components/labs/use-lab-analytics";
import type { LabDefinition } from "@/lib/labs";

const traditional = [
  "Understand task",
  "Manual routing",
  "Sequential execution",
  "Manual synthesis",
  "Deliver result",
];
const agentic = [
  "Planner agent",
  "Task delegation",
  "Parallel tool use",
  "Critic verification",
  "Final response",
];

export function MultiAgentExplorerDemo({ lab }: { lab: LabDefinition }) {
  const [preset, setPreset] = useState<ScenarioPreset>("happy");
  const track = useLabAnalytics(lab.slug);
  const factors = SCENARIO_FACTORS[preset];
  const { step, running, run, pause, reset } = useStepPlayback(
    agentic.length,
    Math.round(1000 / factors.speed),
  );

  const comparison = useMemo(() => {
    const traditionalLead = Math.max(0, step - (preset === "happy" ? 1 : 0));
    return {
      traditionalLead,
      speedGain: `${Math.max(8, Math.round(step * 18 * factors.speed))}% faster`,
      parallelism: `${Math.max(1, Math.round(Math.min(1 + step, 5) * factors.reliability))} active threads`,
    };
  }, [factors.reliability, factors.speed, preset, step]);

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
        runLabel="Compare workflows"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="rounded-lg border border-border p-4 bg-background/80">
          <h3 className="font-semibold mb-3">Traditional Workflow</h3>
          <FlowChain
            steps={traditional}
            activeIndex={comparison.traditionalLead}
          />
        </section>
        <section className="rounded-lg border border-(--gold-border) p-4 bg-(--gold-dim)">
          <h3 className="font-semibold mb-3">Agentic Workflow</h3>
          <FlowChain steps={agentic} activeIndex={step} />
        </section>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <MetricCard
          label="Execution pace"
          value={comparison.speedGain}
          tone="good"
        />
        <MetricCard
          label="Parallelism"
          value={comparison.parallelism}
          tone="good"
        />
        <MetricCard
          label="Validation confidence"
          value={`${Math.max(44, Math.round((82 + step * 3) * factors.reliability))}%`}
          tone={step > 2 ? "good" : "neutral"}
        />
      </div>

      <NarrativeProgress
        items={lab.narrative}
        activeIndex={Math.min(step, lab.narrative.length - 1)}
      />
    </div>
  );
}

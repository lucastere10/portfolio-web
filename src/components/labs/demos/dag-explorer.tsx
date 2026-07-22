"use client";

import { useMemo, useState } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { MetricCard } from "@/components/labs/metric-card";
import { NarrativeProgress } from "@/components/labs/narrative-progress";
import {
  SCENARIO_FACTORS,
  type ScenarioPreset,
  ScenarioPresetBar,
} from "@/components/labs/scenario-presets";
import { useLabAnalytics } from "@/components/labs/use-lab-analytics";
import type { LabDefinition } from "@/content/schemas";

const taskOrder = ["extract", "transform", "validate", "load"] as const;

function statusColor(status: "idle" | "running" | "failed" | "done") {
  if (status === "running") return "#f59e0b";
  if (status === "failed") return "#ef4444";
  if (status === "done") return "#22c55e";
  return "#64748b";
}

export function DagExplorerDemo({ lab }: { lab: LabDefinition }) {
  const [preset, setPreset] = useState<ScenarioPreset>("happy");
  const [failedTask, setFailedTask] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const track = useLabAnalytics(lab.slug);
  const factors = SCENARIO_FACTORS[preset];

  const nodes: Node[] = useMemo(() => {
    return [
      {
        id: "extract",
        position: { x: 40, y: 80 },
        data: { label: "Extract" },
        style: {
          border: `2px solid ${statusColor(activeIndex === 0 ? "running" : activeIndex > 0 ? "done" : "idle")}`,
          borderRadius: 10,
          padding: 10,
        },
      },
      {
        id: "transform",
        position: { x: 260, y: 80 },
        data: { label: "Transform" },
        style: {
          border: `2px solid ${statusColor(failedTask === "transform" ? "failed" : activeIndex === 1 ? "running" : activeIndex > 1 ? "done" : "idle")}`,
          borderRadius: 10,
          padding: 10,
        },
      },
      {
        id: "validate",
        position: { x: 480, y: 80 },
        data: { label: "Validate" },
        style: {
          border: `2px solid ${statusColor(failedTask === "validate" ? "failed" : activeIndex === 2 ? "running" : activeIndex > 2 ? "done" : "idle")}`,
          borderRadius: 10,
          padding: 10,
        },
      },
      {
        id: "load",
        position: { x: 700, y: 80 },
        data: { label: "Load" },
        style: {
          border: `2px solid ${statusColor(activeIndex === 3 ? "running" : activeIndex > 3 ? "done" : "idle")}`,
          borderRadius: 10,
          padding: 10,
        },
      },
    ];
  }, [activeIndex, failedTask]);

  const edges: Edge[] = [
    { id: "e1", source: "extract", target: "transform", animated: true },
    { id: "e2", source: "transform", target: "validate", animated: true },
    { id: "e3", source: "validate", target: "load", animated: true },
  ];

  function failTask(task: "transform" | "validate") {
    setFailedTask(task);
    setActiveIndex(taskOrder.indexOf(task));
    track("task_fail", task);
  }

  function rerun() {
    if (failedTask) {
      setActiveIndex(
        taskOrder.indexOf(failedTask as (typeof taskOrder)[number]) + 1,
      );
      track("task_rerun", failedTask);
      setFailedTask(null);
      return;
    }

    setActiveIndex((prev) => (prev >= 3 ? 3 : prev + 1));
    track("task_advance", taskOrder[Math.min(activeIndex + 1, 3)]);
  }

  function reset() {
    setFailedTask(null);
    setActiveIndex(0);
    track("control_reset", preset);
  }

  return (
    <div className="flex flex-col gap-4">
      <ScenarioPresetBar
        value={preset}
        onChange={(nextPreset) => {
          setPreset(nextPreset);
          track("preset_select", nextPreset);
          if (nextPreset === "outage") {
            setFailedTask("transform");
            setActiveIndex(1);
          }
          if (nextPreset === "degraded") {
            setFailedTask(null);
            setActiveIndex(1);
          }
          if (nextPreset === "happy") {
            setFailedTask(null);
            setActiveIndex(0);
          }
        }}
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => failTask("transform")}
          className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted cursor-pointer"
        >
          Fail Transform
        </button>
        <button
          type="button"
          onClick={() => failTask("validate")}
          className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted cursor-pointer"
        >
          Fail Validate
        </button>
        <button
          type="button"
          onClick={rerun}
          className="rounded-md border border-(--gold-border) bg-(--gold-dim) px-3 py-1.5 text-sm cursor-pointer"
        >
          Rerun Next Task
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted cursor-pointer"
        >
          Reset
        </button>
      </div>

      <div className="h-70 rounded-lg border border-border overflow-hidden bg-background/95">
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <MiniMap pannable zoomable />
          <Controls />
          <Background gap={18} size={1} />
        </ReactFlow>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MetricCard
          label="Active task"
          value={taskOrder[Math.min(activeIndex, 3)] ?? "extract"}
          tone="neutral"
        />
        <MetricCard
          label="Retries"
          value={failedTask ? "1" : "0"}
          tone={failedTask ? "warning" : "good"}
        />
        <MetricCard
          label="Pipeline health"
          value={
            failedTask
              ? "Degraded"
              : preset === "outage"
                ? "Critical"
                : "Healthy"
          }
          tone={
            failedTask || preset === "outage"
              ? "critical"
              : factors.reliability < 0.8
                ? "warning"
                : "good"
          }
        />
      </div>

      <NarrativeProgress
        items={lab.narrative}
        activeIndex={Math.min(activeIndex, lab.narrative.length - 1)}
      />
    </div>
  );
}

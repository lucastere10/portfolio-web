import type { ComponentType } from "react";
import type { LabDefinition } from "@/content/schemas";
import { AutoscalingSimulatorDemo } from "@/components/labs/demos/autoscaling-simulator";
import { CloudArchitectureExplorerDemo } from "@/components/labs/demos/cloud-architecture-explorer";
import { DagExplorerDemo } from "@/components/labs/demos/dag-explorer";
import { DataDriftDemo } from "@/components/labs/demos/data-drift-demo";
import { EventProcessingPipelineDemo } from "@/components/labs/demos/event-processing-pipeline";
import { McpExplorerDemo } from "@/components/labs/demos/mcp-explorer";
import { MlPipelineSimulatorDemo } from "@/components/labs/demos/ml-pipeline-simulator";
import { MultiAgentExplorerDemo } from "@/components/labs/demos/multi-agent-explorer";
import { RetryFailureSimulatorDemo } from "@/components/labs/demos/retry-failure-simulator";

type DemoComponent = ComponentType<{ lab: LabDefinition }>;

export const LAB_DEMO_REGISTRY: Record<string, DemoComponent> = {
  "retry-failure-simulator": RetryFailureSimulatorDemo,
  "multi-agent-explorer": MultiAgentExplorerDemo,
  "mcp-explorer": McpExplorerDemo,
  "cloud-architecture-explorer": CloudArchitectureExplorerDemo,
  "autoscaling-simulator": AutoscalingSimulatorDemo,
  "event-processing-pipeline": EventProcessingPipelineDemo,
  "dag-explorer": DagExplorerDemo,
  "ml-pipeline-simulator": MlPipelineSimulatorDemo,
  "data-drift-demo": DataDriftDemo,
};

export type LabDomain =
  | "CI/CD"
  | "AI Agents & Automation"
  | "Cloud Architecture / GCP"
  | "MLOps & Data Pipelines";

export type LabDefinition = {
  slug: string;
  title: string;
  domain: LabDomain;
  summary: string;
  interactionPrompt: string;
  narrative: [string, string, string, string];
  demonstrates: string[];
  tags: string[];
};

export const LAB_DOMAIN_ORDER: LabDomain[] = [
  "CI/CD",
  "AI Agents & Automation",
  "Cloud Architecture / GCP",
  "MLOps & Data Pipelines",
];

export const LABS: LabDefinition[] = [
  {
    slug: "retry-failure-simulator",
    title: "Retry & Failure Simulator",
    domain: "CI/CD",
    summary:
      "Trigger payment failures and inspect retry policy, DLQ transitions, and alerting behavior.",
    interactionPrompt: "Fail Payment Service",
    narrative: [
      "Entered a production-like failure simulation.",
      "Triggered controlled failures and watched retries.",
      "Understood backoff, DLQ routing, and alert thresholds.",
      "Saw the operational depth in observability and resilience design.",
    ],
    demonstrates: ["Resilience", "Retry", "Dead Letter Queue", "Observability"],
    tags: ["payments", "queue", "sre", "incident-response"],
  },
  {
    slug: "multi-agent-explorer",
    title: "Multi-Agent Explorer",
    domain: "AI Agents & Automation",
    summary:
      "Compare traditional and agentic workflows solving the same task with different execution models.",
    interactionPrompt: "Compare workflows",
    narrative: [
      "Entered side-by-side workflow comparison.",
      "Interacted with both execution paths.",
      "Understood planning delegation and tool orchestration.",
      "Perceived system-level reasoning depth beyond linear automation.",
    ],
    demonstrates: [
      "Delegation",
      "Planning",
      "Tool orchestration",
      "Execution transparency",
    ],
    tags: ["agents", "adk", "orchestration", "automation"],
  },
  {
    slug: "mcp-explorer",
    title: "MCP Explorer",
    domain: "AI Agents & Automation",
    summary:
      "Inspect an agent request as it moves through MCP server integrations and external systems.",
    interactionPrompt: "Inspect each integration hop",
    narrative: [
      "Entered protocol-level architecture view.",
      "Clicked each hop and inspected payload flow.",
      "Understood abstraction boundaries and capability routing.",
      "Recognized the depth of interoperable agent infrastructure.",
    ],
    demonstrates: [
      "MCP protocol",
      "Tool abstraction",
      "System integration",
      "Traceability",
    ],
    tags: ["mcp", "github", "jira", "database"],
  },
  {
    slug: "cloud-architecture-explorer",
    title: "Cloud Architecture Explorer",
    domain: "Cloud Architecture / GCP",
    summary:
      "Interactive architecture canvas for modern event-driven systems on Cloud Run and BigQuery.",
    interactionPrompt: "Open component details",
    narrative: [
      "Entered architecture as an explorable system.",
      "Interacted with each component decision.",
      "Understood tradeoffs among cost, scale, and complexity.",
      "Saw technical depth in architectural rationale, not just diagrams.",
    ],
    demonstrates: [
      "System design",
      "Tradeoffs",
      "Cost awareness",
      "Scalability planning",
    ],
    tags: ["gcp", "cloud-run", "pubsub", "bigquery"],
  },
  {
    slug: "autoscaling-simulator",
    title: "Autoscaling Simulator",
    domain: "Cloud Architecture / GCP",
    summary:
      "Increase request volume and observe instance count, latency, and cost adapting in real time.",
    interactionPrompt: "Adjust traffic level",
    narrative: [
      "Entered a live autoscaling model.",
      "Interacted with load changes.",
      "Understood SLO-pressure behavior under scale.",
      "Perceived depth in capacity and cost engineering.",
    ],
    demonstrates: [
      "Autoscaling",
      "Latency management",
      "Cost-performance balance",
    ],
    tags: ["scaling", "slo", "cloud-run", "capacity"],
  },
  {
    slug: "event-processing-pipeline",
    title: "Event Processing Pipeline",
    domain: "Cloud Architecture / GCP",
    summary:
      "Follow real-time event movement from file upload to analytics sink with throughput tracking.",
    interactionPrompt: "Send file events",
    narrative: [
      "Entered an event-driven data path.",
      "Triggered events and tracked propagation.",
      "Understood asynchronous buffering and processing boundaries.",
      "Recognized depth in reliable high-volume ingestion design.",
    ],
    demonstrates: [
      "Event-driven architecture",
      "Streaming",
      "Backpressure visibility",
      "Analytics readiness",
    ],
    tags: ["events", "storage", "pubsub", "analytics"],
  },
  {
    slug: "dag-explorer",
    title: "DAG Explorer",
    domain: "MLOps & Data Pipelines",
    summary:
      "Explore task dependencies, force failures, and retry to understand orchestration behavior.",
    interactionPrompt: "Fail and rerun tasks",
    narrative: [
      "Entered a pipeline orchestration graph.",
      "Interacted with task state changes.",
      "Understood dependency propagation and recovery.",
      "Perceived depth in production data workflow control.",
    ],
    demonstrates: [
      "DAG dependencies",
      "Task lifecycle",
      "Retry strategy",
      "Pipeline observability",
    ],
    tags: ["airflow-inspired", "dag", "orchestration"],
  },
  {
    slug: "ml-pipeline-simulator",
    title: "ML Pipeline Simulator",
    domain: "MLOps & Data Pipelines",
    summary:
      "Watch ML lifecycle progression from dataset ingestion to monitoring with stage health status.",
    interactionPrompt: "Run pipeline",
    narrative: [
      "Entered the model lifecycle pipeline.",
      "Interacted with stage-by-stage execution.",
      "Understood how validation gates protect deployment quality.",
      "Recognized depth in end-to-end MLOps operations.",
    ],
    demonstrates: [
      "Training lifecycle",
      "Validation gates",
      "Deployment workflow",
      "Monitoring feedback",
    ],
    tags: ["mlops", "training", "deployment", "monitoring"],
  },
  {
    slug: "data-drift-demo",
    title: "Data Drift Demo",
    domain: "MLOps & Data Pipelines",
    summary:
      "Change feature distribution and watch model metrics degrade until retraining is required.",
    interactionPrompt: "Move drift sliders",
    narrative: [
      "Entered model health monitoring.",
      "Interacted with distribution shift controls.",
      "Understood drift impact on key quality metrics.",
      "Perceived depth in continuous model governance.",
    ],
    demonstrates: [
      "Data drift",
      "Model decay",
      "Metric governance",
      "Retraining triggers",
    ],
    tags: ["drift", "accuracy", "precision", "recall"],
  },
];

export const LABS_BY_DOMAIN = LAB_DOMAIN_ORDER.map((domain) => ({
  domain,
  labs: LABS.filter((lab) => lab.domain === domain),
}));

export function getLabBySlug(slug: string) {
  return LABS.find((lab) => lab.slug === slug);
}

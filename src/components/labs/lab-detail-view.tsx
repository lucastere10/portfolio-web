import { LabShell } from "@/components/labs/lab-shell";
import { LAB_DEMO_REGISTRY } from "@/components/labs/demo-registry";
import type { LabDefinition } from "@/lib/labs";

export function LabDetailView({ lab }: { lab: LabDefinition }) {
  const Demo = LAB_DEMO_REGISTRY[lab.slug];

  return <LabShell lab={lab}>{Demo ? <Demo lab={lab} /> : null}</LabShell>;
}

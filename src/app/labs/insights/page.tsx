import type { Metadata } from "next";
import { LabsInsightsPanel } from "@/components/labs/labs-insights-panel";

export const metadata: Metadata = {
  title: "Labs Insights",
  description: "Local analytics view for Labs interactions and demo attention.",
};

export default function LabsInsightsPage() {
  return <LabsInsightsPanel />;
}

import type { Metadata } from "next";
import { LabsInsightsPanel } from "@/components/labs/labs-insights-panel";
import { getAnalyticsSnapshot } from "@/lib/analytics-store";

export const metadata: Metadata = {
  title: "Labs Insights",
  description: "Admin view for Labs interaction analytics.",
  robots: { index: false, follow: false },
};

export default function LabsInsightsPage() {
  const initialSnapshot = getAnalyticsSnapshot();
  return <LabsInsightsPanel initialSnapshot={initialSnapshot} />;
}

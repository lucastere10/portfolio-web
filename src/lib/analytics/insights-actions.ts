"use server";

import { isInsightsAccessAllowed } from "@/lib/analytics/insights-access";
import { getAnalyticsSnapshot } from "@/lib/analytics/store";
import type { LabsAnalyticsSnapshot } from "@/lib/analytics/labs-analytics";

export async function refreshAnalyticsSnapshot(
  token?: string,
): Promise<LabsAnalyticsSnapshot> {
  if (!isInsightsAccessAllowed(token)) {
    throw new Error("Unauthorized");
  }
  return getAnalyticsSnapshot();
}

"use server";

import { getAnalyticsSnapshot } from "@/lib/analytics-store";
import type { LabsAnalyticsSnapshot } from "@/lib/labs-analytics";

export async function refreshAnalyticsSnapshot(): Promise<LabsAnalyticsSnapshot> {
  return getAnalyticsSnapshot();
}

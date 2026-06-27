export type LabsAnalyticsEvent = {
  labSlug: string;
  action: string;
  label?: string;
  value?: number;
  at: string;
};

export type LabsAnalyticsSnapshot = {
  totalEvents: number;
  topLabs: Array<{ labSlug: string; count: number }>;
  topActions: Array<{ action: string; count: number }>;
  events: LabsAnalyticsEvent[];
  recentEvents: LabsAnalyticsEvent[];
  updatedAt: string;
};

export function trackLabsEvent(event: Omit<LabsAnalyticsEvent, "at">) {
  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...event }),
    cache: "no-store",
  }).catch(() => {});
}

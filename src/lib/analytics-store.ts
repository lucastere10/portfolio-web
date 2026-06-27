import type { LabsAnalyticsEvent, LabsAnalyticsSnapshot } from "./labs-analytics";

type EventAggregate = {
  count: number;
  lastAt: string;
  labSlug: string;
  action: string;
  label: string;
};

type AnalyticsStore = {
  events: LabsAnalyticsEvent[];
  byKey: Record<string, EventAggregate>;
  updatedAt: string;
};

const MAX_EVENTS = 500;

const store: AnalyticsStore = {
  events: [],
  byKey: {},
  updatedAt: new Date().toISOString(),
};

export function appendAnalyticsEvent(
  event: Omit<LabsAnalyticsEvent, "at">,
): void {
  const at = new Date().toISOString();
  const normalizedLabel = event.label ?? "none";
  const key = `${event.labSlug}::${event.action}::${normalizedLabel}`;
  const existing = store.byKey[key];

  store.byKey[key] = {
    count: (existing?.count ?? 0) + 1,
    lastAt: at,
    labSlug: event.labSlug,
    action: event.action,
    label: normalizedLabel,
  };

  store.events.push({ ...event, at });
  if (store.events.length > MAX_EVENTS) {
    store.events = store.events.slice(-MAX_EVENTS);
  }
  store.updatedAt = at;
}

export function getAnalyticsSnapshot(): LabsAnalyticsSnapshot {
  const byLab: Record<string, number> = {};
  const byAction: Record<string, number> = {};

  Object.values(store.byKey).forEach((entry) => {
    byLab[entry.labSlug] = (byLab[entry.labSlug] ?? 0) + entry.count;
    const actionKey =
      entry.label !== "none" ? `${entry.action}:${entry.label}` : entry.action;
    byAction[actionKey] = (byAction[actionKey] ?? 0) + entry.count;
  });

  const topLabs = Object.entries(byLab)
    .map(([labSlug, count]) => ({ labSlug, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const topActions = Object.entries(byAction)
    .map(([action, count]) => ({ action, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  return {
    totalEvents: store.events.length,
    topLabs,
    topActions,
    events: store.events,
    recentEvents: [...store.events].reverse().slice(0, 25),
    updatedAt: store.updatedAt,
  };
}

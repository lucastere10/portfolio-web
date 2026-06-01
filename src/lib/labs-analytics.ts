export type LabsAnalyticsEvent = {
  labSlug: string;
  action: string;
  label?: string;
  value?: number;
  at: string;
};

type EventAggregate = {
  count: number;
  lastAt: string;
  labSlug: string;
  action: string;
  label: string;
};

type LabsAnalyticsStore = {
  byKey: Record<string, EventAggregate>;
  events: LabsAnalyticsEvent[];
  updatedAt: string;
};

export type LabsAnalyticsSnapshot = {
  totalEvents: number;
  topLabs: Array<{ labSlug: string; count: number }>;
  topActions: Array<{ action: string; count: number }>;
  events: LabsAnalyticsEvent[];
  recentEvents: LabsAnalyticsEvent[];
  updatedAt: string;
};

const STORAGE_KEY = "labs.analytics.v1";

function getEmptyStore(): LabsAnalyticsStore {
  return {
    byKey: {},
    events: [],
    updatedAt: new Date().toISOString(),
  };
}

function loadStore(): LabsAnalyticsStore {
  if (typeof window === "undefined") {
    return getEmptyStore();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return getEmptyStore();
  }

  try {
    return JSON.parse(raw) as LabsAnalyticsStore;
  } catch {
    return getEmptyStore();
  }
}

function saveStore(store: LabsAnalyticsStore) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function trackLabsEvent(event: Omit<LabsAnalyticsEvent, "at">) {
  const store = loadStore();
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
  if (store.events.length > 300) {
    store.events = store.events.slice(-300);
  }

  store.updatedAt = at;
  saveStore(store);
}

export function getLabsAnalyticsSnapshot(): LabsAnalyticsSnapshot {
  const store = loadStore();

  const byLab: Record<string, number> = {};
  const byAction: Record<string, number> = {};

  Object.values(store.byKey).forEach((entry) => {
    byLab[entry.labSlug] = (byLab[entry.labSlug] ?? 0) + entry.count;
    const actionKey = `${entry.action}${entry.label !== "none" ? `:${entry.label}` : ""}`;
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

export function clearLabsAnalytics() {
  saveStore(getEmptyStore());
}

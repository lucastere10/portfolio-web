"use client";

import { useEffect, useMemo, useState } from "react";
import {
  clearLabsAnalytics,
  getLabsAnalyticsSnapshot,
  type LabsAnalyticsEvent,
  type LabsAnalyticsSnapshot,
} from "@/lib/labs-analytics";

type PeriodFilter = "1h" | "24h" | "7d";

const PERIOD_OPTIONS: Array<{
  value: PeriodFilter;
  label: string;
  windowMs: number;
}> = [
  { value: "1h", label: "Last hour", windowMs: 60 * 60 * 1000 },
  { value: "24h", label: "Last 24h", windowMs: 24 * 60 * 60 * 1000 },
  { value: "7d", label: "Last 7d", windowMs: 7 * 24 * 60 * 60 * 1000 },
];

function useSnapshot() {
  const [snapshot, setSnapshot] = useState<LabsAnalyticsSnapshot>(() =>
    getLabsAnalyticsSnapshot(),
  );

  useEffect(() => {
    const refresh = () => setSnapshot(getLabsAnalyticsSnapshot());
    const interval = setInterval(refresh, 3000);

    function onStorage(event: StorageEvent) {
      if (!event.key || event.key.includes("labs.analytics")) {
        refresh();
      }
    }

    window.addEventListener("storage", onStorage);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return { snapshot, setSnapshot };
}

export function LabsInsightsPanel() {
  const { snapshot, setSnapshot } = useSnapshot();
  const [period, setPeriod] = useState<PeriodFilter>("24h");

  const filtered = useMemo(() => {
    const now = new Date(snapshot.updatedAt).getTime();
    const activeWindow =
      PERIOD_OPTIONS.find((option) => option.value === period)?.windowMs ??
      PERIOD_OPTIONS[1].windowMs;

    return snapshot.events.filter(
      (event) => now - new Date(event.at).getTime() <= activeWindow,
    );
  }, [period, snapshot.events, snapshot.updatedAt]);

  const filteredTopLabs = useMemo(() => aggregateByLab(filtered), [filtered]);
  const filteredTopActions = useMemo(
    () => aggregateByAction(filtered),
    [filtered],
  );
  const filteredRecent = useMemo(
    () => [...filtered].reverse().slice(0, 25),
    [filtered],
  );

  const hasData = useMemo(() => filtered.length > 0, [filtered.length]);

  function exportCsv() {
    if (filtered.length === 0) {
      return;
    }

    const header = ["at", "labSlug", "action", "label", "value"];
    const lines = filtered.map((event) => {
      const row = [
        event.at,
        event.labSlug,
        event.action,
        event.label ?? "",
        `${event.value ?? ""}`,
      ];
      return row.map(csvEscape).join(",");
    });

    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `labs-events-${period}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="px-6 py-20 content-width-wide">
      <div className="content-width-wide flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="section-label">Labs Analytics</span>
            <h1 className="font-display font-bold text-4xl tracking-tight mt-3">
              Interaction Insights
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-2xl mt-3">
              Lightweight local analytics to understand which demos and
              interactions receive the most attention.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportCsv}
              disabled={filtered.length === 0}
              className="rounded-md border border-(--gold-border) bg-(--gold-dim) px-3 py-2 text-sm hover:opacity-85 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => {
                clearLabsAnalytics();
                setSnapshot(getLabsAnalyticsSnapshot());
              }}
              className="rounded-md border border-border px-3 py-2 text-sm hover:bg-muted transition-colors cursor-pointer"
            >
              Clear data
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-background/85 p-3">
          <p className="text-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground mb-2">
            Time window
          </p>
          <div className="flex flex-wrap gap-2">
            {PERIOD_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPeriod(option.value)}
                className={`rounded-md border px-3 py-1.5 text-sm transition-colors cursor-pointer ${
                  period === option.value
                    ? "border-(--gold-border) bg-(--gold-dim) text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg border border-border p-4 bg-background/90">
            <p className="text-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
              Total events
            </p>
            <p className="text-3xl font-semibold mt-1">{filtered.length}</p>
          </div>
          <div className="rounded-lg border border-border p-4 bg-background/90">
            <p className="text-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
              Tracked labs
            </p>
            <p className="text-3xl font-semibold mt-1">
              {filteredTopLabs.length}
            </p>
          </div>
          <div className="rounded-lg border border-border p-4 bg-background/90">
            <p className="text-mono text-[10px] tracking-[0.14em] uppercase text-muted-foreground">
              Updated
            </p>
            <p className="text-sm font-medium mt-2">
              {new Date(snapshot.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>

        {!hasData && (
          <div className="rounded-lg border border-border p-6 bg-background/80">
            <p className="text-sm text-muted-foreground">
              No events yet. Open any demo in Labs, interact with controls,
              change scenarios, then come back here.
            </p>
          </div>
        )}

        {hasData && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-lg border border-border p-4 bg-background/80">
                <h2 className="font-semibold mb-3">
                  Most viewed/interacted demos
                </h2>
                <ul className="space-y-2">
                  {filteredTopLabs.map((item) => (
                    <li
                      key={item.labSlug}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="text-foreground">{item.labSlug}</span>
                      <span className="text-mono text-xs text-muted-foreground">
                        {item.count}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-border p-4 bg-background/80">
                <h2 className="font-semibold mb-3">Top interactions</h2>
                <ul className="space-y-2">
                  {filteredTopActions.map((item) => (
                    <li
                      key={item.action}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="text-foreground">{item.action}</span>
                      <span className="text-mono text-xs text-muted-foreground">
                        {item.count}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-lg border border-border p-4 bg-background/80">
              <h2 className="font-semibold mb-3">Recent events</h2>
              <div className="overflow-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground border-b border-border">
                      <th className="py-2 pr-3 font-medium">Time</th>
                      <th className="py-2 pr-3 font-medium">Lab</th>
                      <th className="py-2 pr-3 font-medium">Action</th>
                      <th className="py-2 font-medium">Label</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecent.map((event, index) => (
                      <tr
                        key={`${event.at}-${event.labSlug}-${index}`}
                        className="border-b border-border/60"
                      >
                        <td className="py-2 pr-3 text-muted-foreground">
                          {new Date(event.at).toLocaleTimeString()}
                        </td>
                        <td className="py-2 pr-3">{event.labSlug}</td>
                        <td className="py-2 pr-3">{event.action}</td>
                        <td className="py-2">{event.label ?? "none"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function aggregateByLab(events: LabsAnalyticsEvent[]) {
  const byLab: Record<string, number> = {};
  events.forEach((event) => {
    byLab[event.labSlug] = (byLab[event.labSlug] ?? 0) + 1;
  });

  return Object.entries(byLab)
    .map(([labSlug, count]) => ({ labSlug, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function aggregateByAction(events: LabsAnalyticsEvent[]) {
  const byAction: Record<string, number> = {};
  events.forEach((event) => {
    const key = `${event.action}${event.label ? `:${event.label}` : ""}`;
    byAction[key] = (byAction[key] ?? 0) + 1;
  });

  return Object.entries(byAction)
    .map(([action, count]) => ({ action, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);
}

function csvEscape(value: string) {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replaceAll('"', '""')}"`;
  }

  return value;
}

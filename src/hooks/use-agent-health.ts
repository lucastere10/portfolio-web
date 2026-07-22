"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { AgentHealthResponse, AgentHealthStatus } from "@/lib/agent/types";

const POLL_DELAYS_MS = [1_500, 2_000, 3_000, 3_000, 3_000, 3_000, 3_000, 3_000];
const MAX_POLL_WINDOW_MS = 45_000;

async function fetchAgentHealth(): Promise<AgentHealthResponse> {
  const res = await fetch("/api/agent/health", { cache: "no-store" });

  let body: AgentHealthResponse = { status: "unreachable" };
  try {
    body = (await res.json()) as AgentHealthResponse;
  } catch {
    // keep unreachable
  }

  if (res.status === 502 || res.status === 403) {
    return { ...body, status: "unreachable" };
  }

  return body;
}

function isTransientStatus(status: AgentHealthStatus): boolean {
  return status === "starting" || status === "unreachable";
}

export function useAgentHealth() {
  const [status, setStatus] = useState<AgentHealthStatus>("starting");
  const [error, setError] = useState<string | null>(null);
  const pollStartedAt = useRef<number | null>(null);
  const pollIndex = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPollTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const scheduleNextPoll = useCallback(
    (runCheck: () => void) => {
      clearPollTimeout();

      const startedAt = pollStartedAt.current ?? Date.now();
      pollStartedAt.current = startedAt;

      if (Date.now() - startedAt >= MAX_POLL_WINDOW_MS) {
        setStatus((current) => (current === "starting" ? "unreachable" : current));
        setError("Agent warmup timed out");
        return;
      }

      const delay =
        POLL_DELAYS_MS[Math.min(pollIndex.current, POLL_DELAYS_MS.length - 1)];
      pollIndex.current += 1;
      timeoutRef.current = setTimeout(runCheck, delay);
    },
    [clearPollTimeout]
  );

  useEffect(() => {
    let cancelled = false;

    const runCheck = async () => {
      try {
        const result = await fetchAgentHealth();
        if (cancelled) return;

        setStatus(result.status);
        setError(null);

        if (result.status === "ok") {
          clearPollTimeout();
          return;
        }

        if (isTransientStatus(result.status)) {
          scheduleNextPoll(runCheck);
          return;
        }

        if (result.status === "error") {
          setError("Agent failed to start");
        } else if (result.status === "degraded") {
          setError("Agent running without LLM credentials");
        }
      } catch {
        if (cancelled) return;
        setStatus("unreachable");
        setError("Could not reach agent health endpoint");
        scheduleNextPoll(runCheck);
      }
    };

    pollStartedAt.current = Date.now();
    pollIndex.current = 0;
    void runCheck();

    return () => {
      cancelled = true;
      clearPollTimeout();
    };
  }, [clearPollTimeout, scheduleNextPoll]);

  return {
    status,
    isReady: status === "ok",
    error,
  };
}

export type PipelineStatusDisplay = {
  dotColor: string;
  dotPulse: boolean;
  badgeLabel: string;
  badgeColor: string;
  badgeBorderColor: string;
  badgeBackgroundColor: string;
};

export function getPipelineStatusDisplay(
  status: AgentHealthStatus
): PipelineStatusDisplay {
  switch (status) {
    case "ok":
      return {
        dotColor: "var(--status-green)",
        dotPulse: true,
        badgeLabel: "ACTIVE",
        badgeColor: "var(--status-green)",
        badgeBorderColor: "oklch(0.72 0.18 145 / 0.30)",
        badgeBackgroundColor: "oklch(0.72 0.18 145 / 0.10)",
      };
    case "starting":
      return {
        dotColor: "var(--status-amber)",
        dotPulse: true,
        badgeLabel: "WARMING",
        badgeColor: "var(--status-amber)",
        badgeBorderColor: "oklch(0.72 0.145 75 / 0.35)",
        badgeBackgroundColor: "oklch(0.72 0.145 75 / 0.12)",
      };
    case "degraded":
      return {
        dotColor: "var(--status-amber)",
        dotPulse: false,
        badgeLabel: "DEGRADED",
        badgeColor: "var(--status-amber)",
        badgeBorderColor: "oklch(0.72 0.145 75 / 0.35)",
        badgeBackgroundColor: "oklch(0.72 0.145 75 / 0.12)",
      };
    case "error":
    case "unreachable":
    default:
      return {
        dotColor: "var(--status-offline)",
        dotPulse: false,
        badgeLabel: "OFFLINE",
        badgeColor: "var(--status-offline)",
        badgeBorderColor: "oklch(0.55 0.02 85 / 0.35)",
        badgeBackgroundColor: "oklch(0.55 0.02 85 / 0.12)",
      };
  }
}

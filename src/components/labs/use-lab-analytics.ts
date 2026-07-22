"use client";

import { useCallback } from "react";
import { trackLabsEvent } from "@/lib/analytics/labs-analytics";

export function useLabAnalytics(labSlug: string) {
  return useCallback(
    (action: string, label?: string, value?: number) => {
      trackLabsEvent({ labSlug, action, label, value });
    },
    [labSlug],
  );
}

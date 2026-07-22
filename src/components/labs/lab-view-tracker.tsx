"use client";

import { useEffect } from "react";
import { trackLabsEvent } from "@/lib/analytics/labs-analytics";

type LabViewTrackerProps = {
  labSlug: string;
};

export function LabViewTracker({ labSlug }: Readonly<LabViewTrackerProps>) {
  useEffect(() => {
    trackLabsEvent({
      labSlug,
      action: "view_lab",
      label: "page",
    });
  }, [labSlug]);

  return null;
}

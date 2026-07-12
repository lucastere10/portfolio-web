"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/labs-analytics";

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const qs = searchParams.toString();
    const path = qs ? `${pathname}?${qs}` : pathname;
    if (path === lastPath.current) return;
    lastPath.current = path;
    trackPageView(path, document.referrer || undefined);
  }, [pathname, searchParams]);

  return null;
}

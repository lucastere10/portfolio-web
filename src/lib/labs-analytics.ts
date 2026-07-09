const VISITOR_KEY = "portfolio_visitor_id";
const SESSION_KEY = "portfolio_agent_session_id";

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

type AnalyticsContext = {
  session_id?: string;
  visitor_id?: string;
};

type PageViewPayload = AnalyticsContext & {
  event: "page_view";
  path: string;
  referrer?: string;
};

type SiteInteractionPayload = AnalyticsContext & {
  event: "site_interaction";
  surface: string;
  action: string;
  label?: string;
  value?: number;
};

export type AnalyticsPayload = PageViewPayload | SiteInteractionPayload;

export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

export function getAgentSessionId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function sendAnalytics(payload: AnalyticsPayload): void {
  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      visitor_id: payload.visitor_id ?? getVisitorId(),
      session_id: payload.session_id ?? getAgentSessionId() ?? undefined,
    }),
    cache: "no-store",
  }).catch(() => {});
}

export function trackPageView(path: string, referrer?: string): void {
  sendAnalytics({
    event: "page_view",
    path,
    referrer,
  });
}

export function trackSiteInteraction(
  surface: string,
  action: string,
  options?: { label?: string; value?: number; session_id?: string },
): void {
  sendAnalytics({
    event: "site_interaction",
    surface,
    action,
    label: options?.label,
    value: options?.value,
    session_id: options?.session_id,
  });
}

/** @deprecated Use trackSiteInteraction — kept for existing call sites. */
export function trackLabsEvent(event: Omit<LabsAnalyticsEvent, "at">) {
  trackSiteInteraction(event.labSlug, event.action, {
    label: event.label,
    value: event.value,
  });
}

export function trackContentLinkClick(href: string, slug: string): void {
  trackSiteInteraction("hero-chat", "content_link_click", {
    label: slug,
    value: href.length,
  });
}

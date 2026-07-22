import type { NextRequest } from "next/server";
import { appendAnalyticsEvent } from "@/lib/analytics/store";
import { isAgentChatRequestAllowed } from "@/lib/agent/origin";
import { isAnalyticsRateLimited } from "@/lib/agent/rate-limit";
import { logPortfolioEvent } from "@/lib/analytics/structured-log";

const MAX_FIELD_LEN = 128;
const MAX_PATH_LEN = 256;

function trimField(value: unknown, maxLen = MAX_FIELD_LEN): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLen) : undefined;
}

function parseOptionalNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export async function POST(req: NextRequest) {
  if (!isAgentChatRequestAllowed(req)) {
    return new Response(null, { status: 403 });
  }

  if (isAnalyticsRateLimited(req)) {
    return new Response(null, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  const raw = body as Record<string, unknown>;
  const visitorId = trimField(raw.visitor_id);
  const sessionId = trimField(raw.session_id);

  // New unified schema: page_view
  if (raw.event === "page_view") {
    const path = trimField(raw.path, MAX_PATH_LEN);
    if (!path) {
      return new Response(null, { status: 400 });
    }

    const referrer = trimField(raw.referrer, MAX_PATH_LEN);

    logPortfolioEvent("page_view", {
      path,
      referrer,
      visitor_id: visitorId,
      session_id: sessionId,
    });

    appendAnalyticsEvent({
      labSlug: "site",
      action: "page_view",
      label: path,
    });

    return new Response(null, { status: 204 });
  }

  // New unified schema: site_interaction
  if (raw.event === "site_interaction") {
    const surface = trimField(raw.surface);
    const action = trimField(raw.action);
    if (!surface || !action) {
      return new Response(null, { status: 400 });
    }

    const label = trimField(raw.label);
    const value = parseOptionalNumber(raw.value);

    logPortfolioEvent("site_interaction", {
      surface,
      action,
      label,
      value,
      visitor_id: visitorId,
      session_id: sessionId,
    });

    appendAnalyticsEvent({ labSlug: surface, action, label, value });

    return new Response(null, { status: 204 });
  }

  // Legacy schema: labSlug + action (backward compatible)
  if (
    typeof raw.labSlug !== "string" ||
    !raw.labSlug.trim() ||
    typeof raw.action !== "string" ||
    !raw.action.trim()
  ) {
    return new Response(null, { status: 400 });
  }

  const labSlug = raw.labSlug.trim().slice(0, MAX_FIELD_LEN);
  const action = raw.action.trim().slice(0, MAX_FIELD_LEN);
  const label =
    typeof raw.label === "string"
      ? raw.label.trim().slice(0, MAX_FIELD_LEN) || undefined
      : undefined;
  const value = parseOptionalNumber(raw.value);

  logPortfolioEvent("site_interaction", {
    surface: labSlug,
    action,
    label,
    value,
    visitor_id: visitorId,
    session_id: sessionId,
  });

  appendAnalyticsEvent({ labSlug, action, label, value });

  return new Response(null, { status: 204 });
}

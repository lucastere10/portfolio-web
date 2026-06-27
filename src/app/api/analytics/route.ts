import type { NextRequest } from "next/server";
import { isAgentChatRequestAllowed } from "@/lib/agent-origin";
import { isAnalyticsRateLimited } from "@/lib/agent-rate-limit";
import { appendAnalyticsEvent } from "@/lib/analytics-store";

const MAX_FIELD_LEN = 64;

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
  const value =
    typeof raw.value === "number" && Number.isFinite(raw.value)
      ? raw.value
      : undefined;

  console.log(
    JSON.stringify({
      event: "lab_interaction",
      labSlug,
      action,
      label,
      value,
    }),
  );

  appendAnalyticsEvent({ labSlug, action, label, value });

  return new Response(null, { status: 204 });
}

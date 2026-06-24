import { NextRequest, NextResponse } from "next/server";

import { postToAgent } from "@/lib/agent-auth";
import { resolveAgentBaseUrl, resolveAgentTimeoutMs } from "@/lib/agent-config";
import { isAgentChatRequestAllowed } from "@/lib/agent-origin";
import { isAgentChatRateLimited } from "@/lib/agent-rate-limit";

// Allow this route up to 30 s on Vercel serverless (default is 10 s).
export const maxDuration = 30;

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!isAgentChatRequestAllowed(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (isAgentChatRateLimited(req)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const raw = body as Record<string, unknown>;

  if (typeof raw.message !== "string" || !raw.message.trim()) {
    return NextResponse.json(
      { error: "message is required and must be a non-empty string" },
      { status: 400 }
    );
  }

  const message = raw.message.slice(0, 1000).trim();
  const session_id =
    raw.session_id === null || raw.session_id === undefined
      ? null
      : typeof raw.session_id === "string"
        ? raw.session_id
        : null;

  try {
    const agentBaseUrl = resolveAgentBaseUrl();
    const agentRes = await postToAgent(
      agentBaseUrl,
      "/api/v1/chat",
      { message, session_id },
      resolveAgentTimeoutMs()
    );

    if (!agentRes.ok) {
      const errBody = agentRes.body as { error?: string; detail?: string } | null;
      const detail =
        errBody?.detail ?? errBody?.error ?? "Agent returned an error";
      const status = agentRes.status >= 500 ? 502 : agentRes.status;
      return NextResponse.json({ error: detail }, { status });
    }

    return NextResponse.json(agentRes.body);
  } catch (err) {
    console.error("Agent chat proxy failed:", err);
    const isTimeout =
      err instanceof DOMException && err.name === "TimeoutError";
    return NextResponse.json(
      {
        error: isTimeout ? "Agent request timed out" : "Agent unavailable",
      },
      { status: 502 }
    );
  }
}

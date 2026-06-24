import { NextRequest, NextResponse } from "next/server";

import { getAgentRequestHeaders } from "@/lib/agent-auth";
import { isAgentChatRequestAllowed } from "@/lib/agent-origin";
import { isAgentChatRateLimited } from "@/lib/agent-rate-limit";

// Allow this route up to 30 s on Vercel serverless (default is 10 s).
export const maxDuration = 30;

const AGENT_BASE_URL =
  process.env.PORTFOLIO_AGENT_BASE_URL ?? "http://localhost:8000";

const AGENT_TIMEOUT_MS = process.env.AGENT_REQUEST_TIMEOUT_MS
  ? parseInt(process.env.AGENT_REQUEST_TIMEOUT_MS, 10)
  : 30_000;

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
    const agentRes = await fetch(`${AGENT_BASE_URL}/api/v1/chat`, {
      method: "POST",
      headers: await getAgentRequestHeaders(AGENT_BASE_URL),
      body: JSON.stringify({ message, session_id }),
      signal: AbortSignal.timeout(AGENT_TIMEOUT_MS),
    });

    if (!agentRes.ok) {
      let detail = "Agent returned an error";
      try {
        const errBody = (await agentRes.json()) as { error?: string; detail?: string };
        detail = errBody.detail ?? errBody.error ?? detail;
      } catch {
        // ignore parse errors
      }
      const status = agentRes.status >= 500 ? 502 : agentRes.status;
      return NextResponse.json({ error: detail }, { status });
    }

    const data: unknown = await agentRes.json();
    return NextResponse.json(data);
  } catch (err) {
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

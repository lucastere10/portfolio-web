import { NextRequest, NextResponse } from "next/server";

import { getFromAgent } from "@/lib/agent/auth";
import {
  resolveAgentBaseUrl,
  resolveAgentHealthTimeoutMs,
} from "@/lib/agent/config";
import { isAgentChatRequestAllowed } from "@/lib/agent/origin";
import type { AgentHealthResponse, AgentHealthStatus } from "@/lib/agent/types";

function parseHealthStatus(body: unknown): AgentHealthStatus {
  if (body && typeof body === "object" && "status" in body) {
    const status = (body as { status: unknown }).status;
    if (
      status === "ok" ||
      status === "starting" ||
      status === "degraded" ||
      status === "error"
    ) {
      return status;
    }
  }
  return "unreachable";
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!isAgentChatRequestAllowed(req)) {
    return NextResponse.json({ status: "unreachable" satisfies AgentHealthStatus }, { status: 403 });
  }

  try {
    const agentBaseUrl = resolveAgentBaseUrl();
    const agentRes = await getFromAgent(
      agentBaseUrl,
      "/health",
      resolveAgentHealthTimeoutMs()
    );

    const status = parseHealthStatus(agentRes.body);
    const payload: AgentHealthResponse = {
      status,
      ...(agentRes.body &&
      typeof agentRes.body === "object" &&
      "llm_configured" in agentRes.body
        ? {
            llm_configured: Boolean(
              (agentRes.body as { llm_configured?: unknown }).llm_configured
            ),
          }
        : {}),
      ...(agentRes.body &&
      typeof agentRes.body === "object" &&
      "version" in agentRes.body &&
      typeof (agentRes.body as { version?: unknown }).version === "string"
        ? { version: (agentRes.body as { version: string }).version }
        : {}),
    };

    const httpStatus =
      status === "ok" ? 200 : status === "starting" ? 503 : agentRes.status >= 400 ? agentRes.status : 503;

    return NextResponse.json(payload, { status: httpStatus });
  } catch (err) {
    console.error("Agent health proxy failed:", err);
    return NextResponse.json(
      { status: "unreachable" satisfies AgentHealthStatus },
      { status: 502 }
    );
  }
}

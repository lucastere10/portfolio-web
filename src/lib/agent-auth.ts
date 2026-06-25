import { GoogleAuth } from "google-auth-library";

type IdTokenClient = Awaited<ReturnType<GoogleAuth["getIdTokenClient"]>>;

const idTokenClients = new Map<string, Promise<IdTokenClient>>();

function isLocalAgentUrl(baseUrl: string): boolean {
  try {
    const { hostname } = new URL(baseUrl);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return true;
  }
}

function normalizeAgentBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/$/, "");
}

function getIdTokenClient(audience: string): Promise<IdTokenClient> {
  const cached = idTokenClients.get(audience);
  if (cached) {
    return cached;
  }

  const clientPromise = new GoogleAuth().getIdTokenClient(audience);
  idTokenClients.set(audience, clientPromise);
  return clientPromise;
}

export type AgentRequestResult = {
  ok: boolean;
  status: number;
  body: unknown;
};

export type AgentPostResult = AgentRequestResult;

/**
 * POST JSON to the portfolio-agent.
 * In production, uses IdTokenClient.request() so Cloud Run receives a valid OIDC token.
 */
export async function postToAgent(
  agentBaseUrl: string,
  path: string,
  payload: unknown,
  timeoutMs: number
): Promise<AgentPostResult> {
  const base = normalizeAgentBaseUrl(agentBaseUrl);
  const url = `${base}${path}`;

  if (!agentBaseUrl || isLocalAgentUrl(agentBaseUrl)) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(timeoutMs),
    });

    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      // ignore parse errors
    }

    return { ok: res.ok, status: res.status, body };
  }

  const client = await getIdTokenClient(base);
  const response = await client.request({
    url,
    method: "POST",
    data: payload,
    headers: { "Content-Type": "application/json" },
    responseType: "json",
    validateStatus: () => true,
    timeout: timeoutMs,
  });

  return {
    ok: response.status >= 200 && response.status < 300,
    status: response.status,
    body: response.data,
  };
}

/**
 * GET from the portfolio-agent (e.g. /health).
 * In production, uses IdTokenClient.request() so Cloud Run receives a valid OIDC token.
 */
export async function getFromAgent(
  agentBaseUrl: string,
  path: string,
  timeoutMs: number
): Promise<AgentRequestResult> {
  const base = normalizeAgentBaseUrl(agentBaseUrl);
  const url = `${base}${path}`;

  if (!agentBaseUrl || isLocalAgentUrl(agentBaseUrl)) {
    const res = await fetch(url, {
      method: "GET",
      signal: AbortSignal.timeout(timeoutMs),
    });

    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      // ignore parse errors
    }

    return { ok: res.ok, status: res.status, body };
  }

  const client = await getIdTokenClient(base);
  const response = await client.request({
    url,
    method: "GET",
    responseType: "json",
    validateStatus: () => true,
    timeout: timeoutMs,
  });

  return {
    ok: response.status >= 200 && response.status < 300,
    status: response.status,
    body: response.data,
  };
}

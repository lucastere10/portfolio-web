import { GoogleAuth } from "google-auth-library";

function isLocalAgentUrl(baseUrl: string): boolean {
  try {
    const { hostname } = new URL(baseUrl);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return true;
  }
}

export async function getAgentRequestHeaders(
  agentBaseUrl: string
): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (!agentBaseUrl || isLocalAgentUrl(agentBaseUrl)) {
    return headers;
  }

  const auth = new GoogleAuth();
  const client = await auth.getIdTokenClient(agentBaseUrl);
  const authHeaders = await client.getRequestHeaders();

  for (const [key, value] of Object.entries(authHeaders)) {
    if (typeof value === "string") {
      headers[key] = value;
    }
  }

  return headers;
}

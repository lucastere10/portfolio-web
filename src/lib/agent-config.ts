const PRODUCTION_AGENT_URL =
  "https://portfolio-agent-399951936554.us-central1.run.app";

export function resolveAgentBaseUrl(): string {
  const configured = process.env.PORTFOLIO_AGENT_BASE_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, "");
  }

  // Cloud Run sets K_SERVICE automatically; avoid falling back to localhost in prod.
  if (process.env.K_SERVICE) {
    return PRODUCTION_AGENT_URL;
  }

  return "http://localhost:8000";
}

export function resolveAgentTimeoutMs(): number {
  const raw = process.env.AGENT_REQUEST_TIMEOUT_MS;
  if (!raw) {
    return 30_000;
  }

  const parsed = parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 30_000;
}

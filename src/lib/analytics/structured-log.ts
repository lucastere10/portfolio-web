type PortfolioEventFields = Record<
  string,
  string | number | boolean | null | undefined | string[]
>;

/**
 * Emits structured JSON logs that Cloud Run parses into jsonPayload fields.
 * @see docs/analytics-gcp.md
 */
export function logPortfolioEvent(
  event: string,
  fields: PortfolioEventFields = {},
): void {
  const payload: Record<string, unknown> = {
    severity: "INFO",
    message: "portfolio_event",
    event,
    service: "portfolio-web",
    timestamp: new Date().toISOString(),
  };

  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) {
      payload[key] = value;
    }
  }

  console.log(JSON.stringify(payload));
}

/**
 * Fail closed in production when INSIGHTS_ACCESS_TOKEN is unset.
 * In development, allow when env is unset; if set, require a matching token.
 */
export function isInsightsAccessAllowed(
  token: string | null | undefined,
): boolean {
  const expected = process.env.INSIGHTS_ACCESS_TOKEN;
  if (!expected) {
    return process.env.NODE_ENV !== "production";
  }
  return typeof token === "string" && token.length > 0 && token === expected;
}

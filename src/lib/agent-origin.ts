import type { NextRequest } from "next/server";

const DEFAULT_ALLOWED_ORIGINS = [
  "https://portfolio.caldasdev.com.br",
  "http://localhost:3000",
  "https://localhost:3000",
];

function parseAllowedOrigins(): string[] {
  const base = process.env.PORTFOLIO_WEB_BASE_URL?.trim();
  const origins = base ? [base.replace(/\/$/, ""), ...DEFAULT_ALLOWED_ORIGINS] : DEFAULT_ALLOWED_ORIGINS;
  return [...new Set(origins)];
}

function isLocalDev(): boolean {
  return process.env.NODE_ENV !== "production";
}

function extractOrigin(url: string): string | null {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return null;
  }
}

function isAllowedOrigin(origin: string, allowed: string[]): boolean {
  const normalized = origin.replace(/\/$/, "");
  return allowed.some((entry) => entry.replace(/\/$/, "") === normalized);
}

export function isAgentChatRequestAllowed(req: NextRequest): boolean {
  if (isLocalDev()) {
    return true;
  }

  const allowed = parseAllowedOrigins();
  const origin = req.headers.get("origin");
  if (origin && isAllowedOrigin(origin, allowed)) {
    return true;
  }

  const referer = req.headers.get("referer");
  if (referer) {
    const refererOrigin = extractOrigin(referer);
    if (refererOrigin && isAllowedOrigin(refererOrigin, allowed)) {
      return true;
    }
  }

  return false;
}

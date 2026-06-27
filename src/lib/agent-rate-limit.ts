const WINDOW_MS = 60_000;

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return req.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(
  req: Request,
  bucketPrefix: string,
  maxRequests: number,
): boolean {
  const ip = getClientIp(req);
  const key = `${bucketPrefix}:${ip}`;
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > maxRequests;
}

export function isAgentChatRateLimited(req: Request): boolean {
  return isRateLimited(req, "chat", 20);
}

export function isAnalyticsRateLimited(req: Request): boolean {
  return isRateLimited(req, "analytics", 120);
}

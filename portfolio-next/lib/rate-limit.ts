type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitEntry>();

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    forwardedFor ||
    "unknown"
  );
}

function buildRateLimitResponse(limit: number, resetAt: number) {
  const retryAfter = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));

  return Response.json(
    {
      message: "Too many requests. Please try again shortly."
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000))
      }
    }
  );
}

export function rateLimit(request: Request, options: RateLimitOptions) {
  const now = Date.now();
  const ip = getClientIp(request);
  const bucketKey = `${options.key}:${ip}`;
  const current = buckets.get(bucketKey);

  if (!current || current.resetAt <= now) {
    buckets.set(bucketKey, {
      count: 1,
      resetAt: now + options.windowMs
    });
    return null;
  }

  if (current.count >= options.limit) {
    return buildRateLimitResponse(options.limit, current.resetAt);
  }

  current.count += 1;
  buckets.set(bucketKey, current);

  if (buckets.size > 2000) {
    for (const [key, value] of buckets) {
      if (value.resetAt <= now) buckets.delete(key);
    }
  }

  return null;
}


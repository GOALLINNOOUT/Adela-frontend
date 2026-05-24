import type { NextRequest } from "next/server";
import { proxyGet } from "@/lib/api/proxy";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, { key: "preview:get", limit: 30, windowMs: 60 * 1000 });
  if (limited) return limited;

  return proxyGet("/api/preview", request.nextUrl.search, request.headers.get("authorization") || "");
}

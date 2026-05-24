import type { NextRequest } from "next/server";
import { proxyGet } from "@/lib/api/proxy";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, { key: "about-author:get", limit: 120, windowMs: 60 * 1000 });
  if (limited) return limited;

  return proxyGet("/api/about-author", request.nextUrl.search, request.headers.get("authorization") || "");
}

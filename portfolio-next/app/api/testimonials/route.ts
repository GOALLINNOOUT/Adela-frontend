import type { NextRequest } from "next/server";
import { proxyGet, proxyJson } from "@/lib/api/proxy";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, { key: "testimonials:get", limit: 120, windowMs: 60 * 1000 });
  if (limited) return limited;

  return proxyGet("/api/testimonials", request.nextUrl.search);
}

export async function POST(request: Request) {
  const limited = rateLimit(request, { key: "testimonials:post", limit: 3, windowMs: 10 * 60 * 1000 });
  if (limited) return limited;

  return proxyJson(request, "/api/testimonials");
}

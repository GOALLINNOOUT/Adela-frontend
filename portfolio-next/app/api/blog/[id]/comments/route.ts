import type { NextRequest } from "next/server";
import { proxyGet, proxyJson } from "@/lib/api/proxy";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const limited = rateLimit(request, { key: "comments:get", limit: 120, windowMs: 60 * 1000 });
  if (limited) return limited;

  const { id } = await context.params;
  return proxyGet(`/api/blog/${id}/comments`, request.nextUrl.search, request.headers.get("authorization") || "");
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const limited = rateLimit(request, { key: "comments:post", limit: 5, windowMs: 10 * 60 * 1000 });
  if (limited) return limited;

  const { id } = await context.params;
  return proxyJson(request, `/api/blog/${id}/comments`, { method: "POST" });
}

import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { proxyGet, proxyMultipart } from "@/lib/api/proxy";
import { rateLimit } from "@/lib/rate-limit";

function revalidateBlogSurfaces() {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
}

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, { key: "blog:get", limit: 180, windowMs: 60 * 1000 });
  if (limited) return limited;

  return proxyGet("/api/blog", request.nextUrl.search, request.headers.get("authorization") || "");
}

export async function POST(request: Request) {
  const limited = rateLimit(request, { key: "blog:post", limit: 20, windowMs: 60 * 1000 });
  if (limited) return limited;

  const response = await proxyMultipart(request, "/api/blog", "POST");
  if (response.ok) {
    revalidateBlogSurfaces();
  }
  return response;
}

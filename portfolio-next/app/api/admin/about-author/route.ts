import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { proxyJson } from "@/lib/api/proxy";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, { key: "admin:about-author:get", limit: 90, windowMs: 60 * 1000 });
  if (limited) return limited;

  return proxyJson(request, "/api/about-author");
}

export async function PUT(request: Request) {
  const limited = rateLimit(request, { key: "admin:about-author:put", limit: 20, windowMs: 60 * 1000 });
  if (limited) return limited;

  const response = await proxyJson(request, "/api/about-author", { method: "PUT" });
  if (response.ok) {
    revalidatePath("/blog");
    revalidatePath("/", "layout");
  }
  return response;
}

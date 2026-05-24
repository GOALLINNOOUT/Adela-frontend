import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { proxyGet, proxyMultipart } from "@/lib/api/proxy";
import { rateLimit } from "@/lib/rate-limit";

function revalidateBlogSurfaces(id: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${id}`);
  revalidatePath("/sitemap.xml");
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const limited = rateLimit(request, { key: "blog-detail:get", limit: 180, windowMs: 60 * 1000 });
  if (limited) return limited;

  const { id } = await context.params;
  return proxyGet(`/api/blog/${id}`, request.nextUrl.search, request.headers.get("authorization") || "");
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const limited = rateLimit(request, { key: "blog:put", limit: 20, windowMs: 60 * 1000 });
  if (limited) return limited;

  const { id } = await context.params;
  const response = await proxyMultipart(request, `/api/blog/${id}`, "PUT");
  if (response.ok) {
    revalidateBlogSurfaces(id);
  }
  return response;
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const limited = rateLimit(request, { key: "blog:delete", limit: 20, windowMs: 60 * 1000 });
  if (limited) return limited;

  const { id } = await context.params;
  const response = await fetch(
    `${process.env.BACKEND_URL || "https://portfolio-backend-ckqx.onrender.com"}/api/blog/${id}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: request.headers.get("authorization") || ""
      }
    }
  );

  const text = await response.text();
  if (response.ok) {
    revalidateBlogSurfaces(id);
  }
  return new Response(text, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") || "application/json"
    }
  });
}

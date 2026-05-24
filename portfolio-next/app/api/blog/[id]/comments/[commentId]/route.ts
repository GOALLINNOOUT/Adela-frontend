import type { NextRequest } from "next/server";
import { proxyJson } from "@/lib/api/proxy";
import { rateLimit } from "@/lib/rate-limit";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; commentId: string }> }
) {
  const limited = rateLimit(request, { key: "comments:delete", limit: 30, windowMs: 60 * 1000 });
  if (limited) return limited;

  const { id, commentId } = await context.params;
  return proxyJson(request, `/api/blog/${id}/comments/${commentId}`, {
    method: "DELETE",
    search: request.nextUrl.search
  });
}

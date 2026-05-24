import { proxyJson } from "@/lib/api/proxy";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request, context: { params: Promise<{ postId: string }> }) {
  const limited = rateLimit(request, { key: "reactions:post", limit: 30, windowMs: 60 * 1000 });
  if (limited) return limited;

  const { postId } = await context.params;
  return proxyJson(request, `/api/reactions/${postId}`, { method: "POST" });
}

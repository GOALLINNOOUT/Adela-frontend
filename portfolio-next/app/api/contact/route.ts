import { proxyJson } from "@/lib/api/proxy";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const limited = rateLimit(request, { key: "contact:post", limit: 5, windowMs: 10 * 60 * 1000 });
  if (limited) return limited;

  return proxyJson(request, "/api/contact");
}

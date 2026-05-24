import { rateLimit } from "@/lib/rate-limit";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const limited = rateLimit(request, { key: "admin:testimonials:approve", limit: 30, windowMs: 60 * 1000 });
  if (limited) return limited;

  const { id } = await context.params;
  const response = await fetch(
    `${process.env.BACKEND_URL || "https://portfolio-backend-ckqx.onrender.com"}/api/admin/testimonials/${id}/approve`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: request.headers.get("authorization") || ""
      }
    }
  );

  const text = await response.text();
  return new Response(text, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") || "application/json"
    }
  });
}

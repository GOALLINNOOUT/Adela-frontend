import { rateLimit } from "@/lib/rate-limit";

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const limited = rateLimit(request, { key: "admin:testimonials:delete", limit: 30, windowMs: 60 * 1000 });
  if (limited) return limited;

  const { id } = await context.params;
  const response = await fetch(
    `${process.env.BACKEND_URL || "https://portfolio-backend-ckqx.onrender.com"}/api/admin/testimonials/${id}`,
    {
      method: "DELETE",
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

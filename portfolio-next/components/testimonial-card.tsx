import type { Testimonial } from "@/lib/types";
import { formatDate } from "@/lib/utils";

function stars(count: number) {
  return Array.from({ length: 5 }, (_, index) => (index < count ? "★" : "☆")).join("");
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="h-full border-t border-[var(--border)] pt-6">
      <div className="space-y-4">
        <p className="text-sm tracking-[0.16em] text-[var(--accent-strong)]">{stars(testimonial.rating)}</p>
        <p className="text-base leading-8 text-[var(--foreground)]">"{testimonial.testimonial}"</p>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-[var(--foreground)]">{testimonial.name}</p>
          <p className="text-sm text-[var(--muted)]">{testimonial.position}</p>
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{formatDate(testimonial.createdAt)}</p>
        </div>
      </div>
    </article>
  );
}

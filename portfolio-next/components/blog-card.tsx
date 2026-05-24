import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import type { BlogPostSummary } from "@/lib/types";
import { formatDate, truncateText } from "@/lib/utils";

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 7.75v4.75l3 1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
      <path d="M5 12h13" strokeLinecap="round" />
      <path d="m13 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightText(text: string, query?: string): ReactNode {
  const trimmed = query?.trim();
  if (!trimmed) return text;

  const pattern = new RegExp(`(${escapeRegExp(trimmed)})`, "ig");
  const parts = text.split(pattern);
  const needle = trimmed.toLowerCase();

  return parts.map((part, index) =>
    part.toLowerCase() === needle ? (
      <mark key={`${part}-${index}`} className="rounded bg-[#f4d58d]/65 px-0.5 text-[var(--foreground)]">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function BlogCard({ post, query }: { post: BlogPostSummary; query?: string }) {
  const excerpt = truncateText(post.excerpt, 120);
  const image = post.image || "/images/hero.jpg";
  const isRemoteImage = image.startsWith("http");

  return (
    <article className="group h-full overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface-strong)] shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]">
      <Link href={`/blog/${post._id}`} className="flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--media-surface)]">
          <Image
            src={image}
            alt=""
            fill
            unoptimized={isRemoteImage}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="scale-110 object-cover object-center opacity-45 blur-2xl transition duration-700 group-hover:scale-125"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[var(--media-surface)]/45" />
          <Image
            src={image}
            alt={post.title}
            fill
            unoptimized={isRemoteImage}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-contain object-center p-3 transition duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/16 via-black/0 to-transparent" />
        </div>
        <div className="flex flex-1 flex-col gap-5 p-5 lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full bg-[color:var(--surface)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--accent-strong)]">
              {post.category}
            </span>
            <span className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{formatDate(post.createdAt)}</span>
          </div>
          <div className="flex-1 space-y-3">
            <h3 className="text-[1.35rem] font-semibold leading-tight tracking-tight text-[var(--foreground)] underline decoration-black/0 underline-offset-[0.18em] transition duration-300 group-hover:decoration-[var(--foreground)] lg:text-2xl">
              {highlightText(post.title, query)}
            </h3>
            <p className="text-sm leading-7 text-[var(--muted)]">{highlightText(excerpt, query)}</p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4 text-sm text-[var(--muted)]">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="inline-flex items-center gap-2">
                <ClockIcon />
                <span>{post.readTime}</span>
              </span>
              <span>{post.views} views</span>
            </div>
            <span className="inline-flex items-center gap-2 font-medium text-[var(--foreground)]">
              <span>Read article</span>
              <span className="transition duration-300 group-hover:translate-x-1">
                <ArrowIcon />
              </span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

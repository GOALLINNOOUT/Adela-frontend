"use client";

import { useState } from "react";

const fallbackBio =
  "ADELA writes about product decisions, web systems, and the practical lessons that show up while building useful digital experiences.";

export function AboutAuthorDisclosure({ author, bio }: { author: string; bio?: string }) {
  const [open, setOpen] = useState(false);
  const authorName = author || "ADELA";
  const authorBio = bio?.trim() || fallbackBio;

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex min-h-10 items-center gap-3 rounded-full border border-[var(--border)] bg-white/80 px-4 text-left text-[var(--foreground)] transition hover:border-[var(--foreground)] hover:bg-white"
        aria-expanded={open}
      >
        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">About author</span>
        <span className="relative h-3.5 w-3.5 shrink-0 text-[var(--foreground)]" aria-hidden="true">
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
          <span
            className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition duration-200 ${
              open ? "scale-y-0" : "scale-y-100"
            }`}
          />
        </span>
      </button>
      <div
        className={`grid max-w-3xl transition-[grid-template-rows] duration-300 ease-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-[var(--shadow-card)]">
            <p className="max-w-2xl text-sm leading-7 text-[var(--foreground)]">
              {authorBio.replace(/^ADELA\b/i, authorName)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

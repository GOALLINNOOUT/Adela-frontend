"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AboutAuthorDisclosure } from "@/components/about-author-disclosure";
import { BlogLinkPreviews } from "@/components/blog-link-previews";
import type { AboutAuthorProfile, BlogPostSummary } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type BlogPostPreviewModalProps = {
  open: boolean;
  post: BlogPostSummary;
  aboutAuthor?: AboutAuthorProfile;
  onClose: () => void;
};

function normalizeHtml(html: string) {
  if (/<[a-z][\s\S]*>/i.test(html)) {
    return html;
  }

  return html
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph.trim().replace(/\n/g, "<br />")}</p>`)
    .join("");
}

export function BlogPostPreviewModal({ open, post, aboutAuthor, onClose }: BlogPostPreviewModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const articleTargetId = `draft-preview-article-${post._id}`;

  useEffect(() => {
    if (!open) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      if (isFullscreen) {
        event.preventDefault();
        setIsFullscreen(false);
        return;
      }

      onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, onClose, open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className={`fixed inset-0 z-[90] grid h-dvh place-items-center overflow-hidden bg-black/45 backdrop-blur-sm transition-[padding] duration-300 ease-out ${
            isFullscreen ? "p-0" : "px-3 py-4 md:px-6"
          }`}
          onClick={onClose}
        >
          <motion.div
            layout
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, y: 26, scale: 0.96 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              width: isFullscreen ? "100vw" : "min(100%, 72rem)",
              height: isFullscreen ? "100dvh" : "94dvh",
              borderRadius: isFullscreen ? "0rem" : "1.5rem"
            }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 280, damping: 31, mass: 0.88 }}
            className="flex min-h-0 flex-col overflow-hidden border border-white/55 bg-[var(--surface)] shadow-[0_24px_90px_rgba(0,0,0,0.24)]"
          >
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[var(--border)] bg-white/92 px-5 py-4 md:px-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">Draft preview</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-[var(--foreground)]">Blog post page</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFullscreen((current) => !current)}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--foreground)] transition hover:border-[var(--foreground)]"
              aria-label={isFullscreen ? "Exit fullscreen preview" : "Open fullscreen preview"}
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              <span aria-hidden="true" className="relative h-4 w-4">
                {isFullscreen ? (
                  <>
                    <span className="absolute left-0 top-0 h-1.5 w-1.5 border-b border-r border-current" />
                    <span className="absolute right-0 top-0 h-1.5 w-1.5 border-b border-l border-current" />
                    <span className="absolute bottom-0 left-0 h-1.5 w-1.5 border-r border-t border-current" />
                    <span className="absolute bottom-0 right-0 h-1.5 w-1.5 border-l border-t border-current" />
                  </>
                ) : (
                  <>
                    <span className="absolute left-0 top-0 h-1.5 w-1.5 border-l border-t border-current" />
                    <span className="absolute right-0 top-0 h-1.5 w-1.5 border-r border-t border-current" />
                    <span className="absolute bottom-0 left-0 h-1.5 w-1.5 border-b border-l border-current" />
                    <span className="absolute bottom-0 right-0 h-1.5 w-1.5 border-b border-r border-current" />
                  </>
                )}
              </span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--foreground)] transition hover:border-[var(--foreground)]"
              aria-label="Close preview"
            >
              x
            </button>
          </div>
        </div>

        <motion.div
          layout
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 32, mass: 0.85 }}
          className="min-h-0 flex-1 overflow-y-auto bg-[var(--surface)]"
        >
          <div className="mx-auto max-w-6xl space-y-12 px-5 py-8 md:px-8 md:py-10">
            <div className="space-y-6 border-b border-[var(--border)] pb-10">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[var(--foreground)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white">
                  {post.category || "Uncategorized"}
                </span>
                <span className="text-sm text-[var(--muted)]">{formatDate(post.createdAt)}</span>
              </div>
              <h1 className="max-w-4xl font-sans text-[2.65rem] font-bold uppercase leading-[1.02] tracking-[-0.035em] text-[var(--foreground)] md:text-[4.1rem] md:leading-[0.98]">
                {post.title || "Untitled post"}
              </h1>
              <p className="max-w-3xl text-base leading-8 text-[var(--muted)] md:text-lg">
                {post.excerpt || "Your excerpt will appear here."}
              </p>
              <div className="flex flex-wrap items-center gap-4 rounded-[1.5rem] border border-[var(--border)] bg-white/70 p-4 text-sm text-[var(--muted)]">
                <div className="flex items-center gap-3 pr-2">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--foreground)] text-base font-semibold uppercase text-white">
                    {(post.author || "ADELA").charAt(0)}
                  </span>
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">{post.author || "ADELA"}</p>
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Author</p>
                  </div>
                </div>
                <span>{post.readTime}</span>
                <span>{post.views} views</span>
                <span>0 reactions</span>
              </div>
              {post.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[var(--border)] bg-white/80 px-3 py-1 text-xs font-medium text-[var(--foreground)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
              <AboutAuthorDisclosure author={aboutAuthor?.name || post.author || "ADELA"} bio={aboutAuthor?.bio} />
            </div>

            <article id={articleTargetId} className="min-w-0 space-y-12 overflow-hidden">
              <div className="relative aspect-[16/8.8] overflow-hidden bg-[var(--media-surface)]">
                <img src={post.image || "/images/hero.jpg"} alt={post.title || "Blog post preview"} className="h-full w-full object-cover" />
              </div>

              <div className="mx-auto min-w-0 max-w-4xl border-t border-[var(--border)] pt-8 md:pt-10">
                <div
                  className="rich-text"
                  dangerouslySetInnerHTML={{ __html: normalizeHtml(post.content || "<p>No content available.</p>") }}
                />
              </div>
              <BlogLinkPreviews key={`${articleTargetId}-${isFullscreen ? "fullscreen" : "modal"}-${post.content}`} targetId={articleTargetId} />
            </article>
          </div>
        </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

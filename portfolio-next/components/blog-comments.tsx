"use client";

import { type FormEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { BlogToast, ReplyIcon, SpinnerIcon, TrashIcon } from "@/components/blog-interaction-ui";
import { formatDate } from "@/lib/utils";

type BlogComment = {
  _id: string;
  author: string;
  content: string;
  createdAt: string;
  replyTo?: string | null;
  parentAuthor?: string | null;
  replies?: BlogComment[];
};

type Draft = {
  author: string;
  content: string;
};

type LinkPreview = {
  title?: string;
  description?: string;
  image?: string | null;
  url?: string;
  domain?: string;
  error?: string;
};

type BlogCommentsProps = {
  postId: string;
};

const commentUrlPattern = /(https?:\/\/[^\s]+)/g;

function extractUrls(text: string) {
  return Array.from(new Set(text.match(commentUrlPattern) || []));
}

function linkifyText(text: string): ReactNode[] {
  return text.split(commentUrlPattern).map((part, index) => {
    if (!part.startsWith("http://") && !part.startsWith("https://")) return part;

    return (
      <a
        key={`${part}-${index}`}
        href={part}
        target="_blank"
        rel="noreferrer"
        className="break-words font-medium underline underline-offset-4"
      >
        {part}
      </a>
    );
  });
}

function getCommentKeys(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem("commentKeys") || "{}");
  } catch {
    return {};
  }
}

function saveDeleteKey(commentId: string, deleteKey: string) {
  const commentKeys = getCommentKeys();
  commentKeys[commentId] = deleteKey;
  localStorage.setItem("commentKeys", JSON.stringify(commentKeys));
}

function CommentLinkPreviewCard({ url }: { url: string }) {
  const [preview, setPreview] = useState<LinkPreview | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let active = true;
    setHidden(false);
    setPreview(null);

    fetch(`/api/preview?url=${encodeURIComponent(url)}`)
      .then((response) => response.json())
      .then((data: LinkPreview) => {
        if (!active) return;
        if (!data || data.error) {
          setHidden(true);
          return;
        }
        setPreview(data);
      })
      .catch(() => {
        if (active) setHidden(true);
      });

    return () => {
      active = false;
    };
  }, [url]);

  if (hidden) return null;

  if (!preview) {
    return (
      <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-[var(--border)] bg-white/75 shadow-[var(--shadow-card)]">
        <div className="flex flex-col gap-4 p-4 sm:flex-row">
          <div className="aspect-[16/9] w-full shrink-0 animate-pulse rounded-xl bg-black/10 sm:h-16 sm:w-24" />
          <div className="min-w-0 flex-1 space-y-3 py-1">
            <div className="h-3 w-24 animate-pulse rounded-full bg-black/10" />
            <div className="h-4 w-4/5 animate-pulse rounded-full bg-black/10" />
            <div className="h-3 w-full animate-pulse rounded-full bg-black/10" />
          </div>
        </div>
      </div>
    );
  }

  const previewUrl = preview.url || url;
  const domain = preview.domain || new URL(previewUrl).hostname.replace(/^www\./, "");

  return (
    <a
      href={previewUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-4 flex flex-col gap-4 overflow-hidden rounded-[1.25rem] border border-[var(--border)] bg-white/75 p-4 text-[var(--foreground)] shadow-[var(--shadow-card)] transition hover:bg-white sm:flex-row md:items-center"
    >
      {preview.image ? (
        <img src={preview.image} alt={preview.title || domain} className="aspect-[16/9] w-full shrink-0 rounded-xl object-cover sm:h-16 sm:w-24" />
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">{domain}</p>
        <p className="mt-2 text-sm font-semibold leading-snug text-[var(--foreground)] group-hover:underline">
          {preview.title || domain || previewUrl}
        </p>
        {preview.description ? (
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--muted)]">{preview.description}</p>
        ) : null}
      </div>
    </a>
  );
}

function CommentLinkPreviews({ urls }: { urls: string[] }) {
  if (urls.length === 0) return null;

  return (
    <div>
      {urls.map((url) => (
        <CommentLinkPreviewCard key={url} url={url} />
      ))}
    </div>
  );
}

export function BlogComments({ postId }: BlogCommentsProps) {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [commentKeys, setCommentKeys] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState<Draft>({ author: "", content: "" });
  const [replyingTo, setReplyingTo] = useState<BlogComment | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const formRef = useRef<HTMLFormElement | null>(null);
  const contentInputRef = useRef<HTMLTextAreaElement | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 5000);
  };

  const fetchComments = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/blog/${postId}/comments`);
      if (!response.ok) throw new Error("Failed to load comments");
      const data = await response.json();
      setComments(Array.isArray(data) ? data : []);
    } catch {
      showToast("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCommentKeys(getCommentKeys());
    fetchComments();
  }, [postId]);

  function handleReplyClick(comment: BlogComment) {
    setReplyingTo(comment);

    window.setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      contentInputRef.current?.focus({ preventScroll: true });
    }, 80);
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.author.trim() || !draft.content.trim()) {
      showToast("Please add your name and comment");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/blog/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: draft.author.trim(),
          content: draft.content.trim(),
          replyTo: replyingTo?._id || null
        })
      });

      if (!response.ok) throw new Error("Failed to post comment");

      const comment = await response.json();
      if (comment?._id && comment?.deleteKey) {
        saveDeleteKey(comment._id, comment.deleteKey);
        setCommentKeys(getCommentKeys());
      }

      setDraft({ author: "", content: "" });
      setReplyingTo(null);
      await fetchComments();
      showToast("Comment posted");
    } catch {
      showToast("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (comment: BlogComment) => {
    const deleteKey = commentKeys[comment._id];
    if (!deleteKey) return;

    setDeletingCommentId(comment._id);

    try {
      const response = await fetch(
        `/api/blog/${postId}/comments/${comment._id}?deleteKey=${encodeURIComponent(deleteKey)}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Failed to delete comment");

      await fetchComments();
      showToast("Comment deleted");
    } catch {
      showToast("Failed to delete comment");
    } finally {
      setDeletingCommentId(null);
    }
  };

  const renderComment = (comment: BlogComment, depth = 0) => (
    <div key={comment._id} className={depth > 0 ? "ml-4 border-l border-[var(--border)] pl-4 md:ml-8 md:pl-6" : ""}>
      <article className="py-5">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--foreground)] text-sm font-semibold uppercase text-white">
            {comment.author.charAt(0) || "?"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-[var(--foreground)]">{comment.author}</p>
                <p className="text-xs text-[var(--muted)]">
                  {formatDate(comment.createdAt)}
                  {comment.parentAuthor ? ` - replied to ${comment.parentAuthor}` : ""}
                </p>
              </div>
              <div className="flex gap-2 text-xs font-medium text-[var(--muted)]">
                <button
                  type="button"
                  onClick={() => handleReplyClick(comment)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-transparent transition hover:border-[var(--border)] hover:bg-white hover:text-[var(--foreground)]"
                  aria-label={`Reply to ${comment.author}`}
                  title="Reply"
                >
                  <ReplyIcon />
                </button>
                {commentKeys[comment._id] ? (
                  <button
                    type="button"
                    onClick={() => handleDelete(comment)}
                    disabled={deletingCommentId === comment._id}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-transparent transition hover:border-[var(--border)] hover:bg-white hover:text-[var(--foreground)] disabled:cursor-wait disabled:opacity-50"
                    aria-label={`Delete comment from ${comment.author}`}
                    title="Delete"
                  >
                    {deletingCommentId === comment._id ? <SpinnerIcon /> : <TrashIcon />}
                  </button>
                ) : null}
              </div>
            </div>
            <p className="mt-3 whitespace-pre-line break-words text-sm leading-7 text-[var(--foreground)]">
              {linkifyText(comment.content)}
            </p>
            <CommentLinkPreviews urls={extractUrls(comment.content)} />
          </div>
        </div>
      </article>
      {comment.replies?.map((reply) => renderComment(reply, depth + 1))}
    </div>
  );

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">Comments</p>
        <h2 className="mt-2 font-serif text-3xl tracking-tight text-[var(--foreground)]">Join the thread</h2>
      </div>

      <form
        id="comment-form"
        ref={formRef}
        onSubmit={handleSubmit}
        className="scroll-mt-28 space-y-4 rounded-[1.5rem] border border-[var(--border)] bg-white/75 p-5"
      >
        {replyingTo ? (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-black/5 px-4 py-3 text-sm text-[var(--muted)]">
            <span>Replying to {replyingTo.author}</span>
            <button type="button" onClick={() => setReplyingTo(null)} className="font-medium text-[var(--foreground)]">
              Cancel
            </button>
          </div>
        ) : null}
        <input
          value={draft.author}
          onChange={(event) => setDraft((current) => ({ ...current, author: event.target.value }))}
          placeholder="Your name"
          className="min-h-12 w-full rounded-2xl border border-[var(--border)] bg-white px-4 text-sm outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--foreground)]"
          required
        />
        <textarea
          ref={contentInputRef}
          value={draft.content}
          onChange={(event) => setDraft((current) => ({ ...current, content: event.target.value }))}
          placeholder="Your comment"
          rows={4}
          className="w-full rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm leading-7 outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--foreground)]"
          required
        />
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--foreground)] px-5 text-sm font-medium text-white transition hover:bg-black disabled:cursor-wait disabled:opacity-60"
          >
            {submitting ? <SpinnerIcon /> : null}
            {submitting ? "Posting..." : replyingTo ? "Post reply" : "Post comment"}
          </button>
        </div>
      </form>

      <div className="divide-y divide-[var(--border)]">
        {loading ? <p className="py-8 text-sm text-[var(--muted)]">Loading comments...</p> : null}
        {!loading && comments.length === 0 ? (
          <p className="rounded-[1.5rem] border border-dashed border-[var(--border)] p-6 text-center text-sm text-[var(--muted)]">
            No comments yet. Be the first to comment.
          </p>
        ) : null}
        {!loading ? comments.map((comment) => renderComment(comment)) : null}
      </div>
      <BlogToast message={toast} onDismiss={() => setToast("")} />
    </section>
  );
}

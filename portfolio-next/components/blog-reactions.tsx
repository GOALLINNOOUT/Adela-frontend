"use client";

import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import {
  BlogToast,
  HeartIcon,
  LikeIcon,
  SadIcon,
  WowIcon
} from "@/components/blog-interaction-ui";

type ReactionType = "like" | "love" | "wow" | "sad";

type ReactionState = Record<ReactionType, string[]>;

type BlogReactionsProps = {
  postId: string;
  initialReactions?: Partial<ReactionState>;
};

const reactionOptions: Array<{ type: ReactionType; label: string; icon: ComponentType<{ className?: string }> }> = [
  { type: "like", label: "Like", icon: LikeIcon },
  { type: "love", label: "Love", icon: HeartIcon },
  { type: "wow", label: "Wow", icon: WowIcon },
  { type: "sad", label: "Sad", icon: SadIcon }
];

function normalizeReactions(reactions?: Partial<ReactionState>): ReactionState {
  return {
    like: reactions?.like || [],
    love: reactions?.love || [],
    wow: reactions?.wow || [],
    sad: reactions?.sad || []
  };
}

function getUserId() {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = `user_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    localStorage.setItem("userId", userId);
  }

  return userId;
}

export function BlogReactions({ postId, initialReactions }: BlogReactionsProps) {
  const [reactions, setReactions] = useState<ReactionState>(() => normalizeReactions(initialReactions));
  const [currentReaction, setCurrentReaction] = useState<ReactionType | null>(null);
  const [submitting, setSubmitting] = useState<ReactionType | null>(null);
  const [toast, setToast] = useState("");

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 5000);
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const activeReaction = reactionOptions.find(({ type }) => reactions[type].includes(userId))?.type || null;
    setCurrentReaction(activeReaction);
  }, [reactions]);

  const handleReaction = async (reactionType: ReactionType) => {
    setSubmitting(reactionType);

    try {
      const response = await fetch(`/api/reactions/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reactionType, userId: getUserId() })
      });

      if (!response.ok) {
        throw new Error("Failed to update reaction");
      }

      const data = await response.json();
      setReactions(normalizeReactions(data.reactions));
      showToast(currentReaction === reactionType ? "Reaction removed" : "Reaction saved");
    } catch {
      showToast("Could not update reaction");
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <section className="mx-auto w-full max-w-4xl border-y border-[var(--border)] py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">React</p>
          <h2 className="mt-2 font-serif text-2xl tracking-tight text-[var(--foreground)]">What did this spark?</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {reactionOptions.map(({ type, label, icon: ReactionIcon }) => {
            const active = currentReaction === type;
            const disabled = Boolean(submitting) || (Boolean(currentReaction) && !active);

            return (
              <button
                key={type}
                type="button"
                onClick={() => handleReaction(type)}
                disabled={disabled}
                aria-label={label}
                title={label}
                className={
                  active
                    ? "inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--foreground)] px-3.5 py-2 text-sm font-medium text-white shadow-[var(--shadow-card)] transition disabled:opacity-50"
                    : "inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--border)] bg-white px-3.5 py-2 text-sm font-medium text-[var(--foreground)] shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:border-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-45"
                }
              >
                <ReactionIcon />
                <span>{reactions[type].length}</span>
              </button>
            );
          })}
        </div>
      </div>
      <BlogToast message={toast} onDismiss={() => setToast("")} />
    </section>
  );
}

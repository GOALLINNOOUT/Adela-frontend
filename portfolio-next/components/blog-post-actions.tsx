"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, BlogToast, BookmarkIcon, IconButton, ShareIcon, SpinnerIcon } from "@/components/blog-interaction-ui";

type BlogPostActionsProps = {
  postId: string;
  title: string;
  excerpt: string;
};

export function BlogPostActions({ postId, title, excerpt }: BlogPostActionsProps) {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(false);
  const [toast, setToast] = useState("");
  const [sharing, setSharing] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);
  const [visible, setVisible] = useState(true);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 5000);
  };

  useEffect(() => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      setBookmarked(Array.isArray(bookmarks) && bookmarks.includes(postId));
    } catch {
      setBookmarked(false);
    }
  }, [postId]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let frameId = 0;

    const handleScroll = () => {
      if (frameId) return;

      frameId = window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const scrollingUp = currentScrollY < lastScrollY;
        const nearTop = currentScrollY < 80;

        setVisible(nearTop || scrollingUp);
        lastScrollY = currentScrollY;
        frameId = 0;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  const handleBookmark = () => {
    setBookmarking(true);

    try {
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
      const safeBookmarks = Array.isArray(bookmarks) ? bookmarks : [];
      const nextBookmarks = bookmarked
        ? safeBookmarks.filter((bookmarkId) => bookmarkId !== postId)
        : [...safeBookmarks, postId];

      localStorage.setItem("bookmarks", JSON.stringify(nextBookmarks));
      setBookmarked(!bookmarked);
      showToast(bookmarked ? "Removed from bookmarks" : "Saved to bookmarks");
    } catch {
      showToast("Bookmarking is not available in this browser");
    } finally {
      window.setTimeout(() => setBookmarking(false), 250);
    }
  };

  const handleShare = async () => {
    setSharing(true);

    const shareData = {
      title,
      text: excerpt,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        showToast("Shared successfully");
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard");
    } catch {
      showToast("Could not share this post");
    } finally {
      setSharing(false);
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/blog");
  };

  return (
    <div
      className={`sticky top-[5.85rem] z-40 mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-4 rounded-full border border-[var(--border)] bg-[var(--surface-strong)]/90 p-2 shadow-[var(--shadow-card)] backdrop-blur transition duration-300 lg:max-w-4xl ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-4 opacity-0"
      }`}
    >
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--foreground)] px-4 text-sm font-medium text-white transition hover:bg-black"
      >
        <ArrowLeftIcon />
        Back
      </button>

      <div className="flex items-center gap-2">
        <IconButton label={bookmarked ? "Remove bookmark" : "Bookmark this article"} active={bookmarked} disabled={bookmarking} onClick={handleBookmark}>
          {bookmarking ? <SpinnerIcon /> : <BookmarkIcon />}
        </IconButton>
        <IconButton label="Share this article" disabled={sharing} onClick={handleShare}>
          {sharing ? <SpinnerIcon /> : <ShareIcon />}
        </IconButton>
      </div>

      <BlogToast message={toast} onDismiss={() => setToast("")} />
    </div>
  );
}

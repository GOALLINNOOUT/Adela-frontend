"use client";

import { useEffect, useState } from "react";

type BlogReadingProgressProps = {
  postId: string;
  targetId: string;
};

type SavedProgress = {
  progress: number;
  scrollPosition: number;
  timestamp: number;
};

function getSavedProgress(postId: string): SavedProgress | null {
  try {
    const stored = JSON.parse(localStorage.getItem("readingProgress") || "{}");
    return stored[postId] || null;
  } catch {
    return null;
  }
}

function saveProgress(postId: string, progress: number, scrollPosition: number) {
  try {
    const stored = JSON.parse(localStorage.getItem("readingProgress") || "{}");
    stored[postId] = { progress, scrollPosition, timestamp: Date.now() };
    localStorage.setItem("readingProgress", JSON.stringify(stored));
  } catch {
    // Reading progress is a convenience feature, so storage failures can be ignored.
  }
}

export function BlogReadingProgress({ postId, targetId }: BlogReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const savedProgress = getSavedProgress(postId);
    if (savedProgress) {
      setProgress(savedProgress.progress);
      const timer = window.setTimeout(() => {
        window.scrollTo({ top: savedProgress.scrollPosition, behavior: "smooth" });
      }, 450);

      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [postId]);

  useEffect(() => {
    const handleScroll = () => {
      const target = document.getElementById(targetId);
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const contentAbove = -rect.top;
      const scrollableContent = Math.max(rect.height - window.innerHeight, 1);
      const nextProgress = Math.min(Math.max((contentAbove / scrollableContent) * 100, 0), 100);

      setProgress(nextProgress);
      saveProgress(postId, nextProgress, window.scrollY);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [postId, targetId]);

  return (
    <div className="fixed inset-x-0 top-[4.5rem] z-[55] bg-transparent md:top-[4.45rem]">
      <div className="reading-progress-track relative h-3 overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
        <div
          className="reading-progress-fill absolute inset-y-0 left-0 transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
        <div className="pointer-events-none absolute inset-y-0 right-2 z-10 flex items-center whitespace-nowrap text-[0.48rem] font-black uppercase tracking-[0.16em] text-white mix-blend-difference drop-shadow-[0_0_1px_rgba(0,0,0,0.65)]">
          Reading {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
}

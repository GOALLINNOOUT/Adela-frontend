"use client";

import { useEffect } from "react";

function getViewedPosts() {
  try {
    const viewedPosts = JSON.parse(localStorage.getItem("viewedPosts") || "[]");
    return Array.isArray(viewedPosts) ? viewedPosts : [];
  } catch {
    return [];
  }
}

function saveViewedPosts(viewedPosts: string[]) {
  localStorage.setItem("viewedPosts", JSON.stringify(viewedPosts));

  const expiry = new Date();
  expiry.setFullYear(expiry.getFullYear() + 1);
  document.cookie = `viewedPosts=${encodeURIComponent(JSON.stringify(viewedPosts))}; expires=${expiry.toUTCString()}; path=/`;
}

export function BlogViewLogger({ postId }: { postId: string }) {
  useEffect(() => {
    const viewedPosts = getViewedPosts();
    if (viewedPosts.includes(postId)) return;

    fetch(`/api/blog/${postId}?incrementView=true`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
      keepalive: true
    })
      .then((response) => {
        if (!response.ok) return;
        saveViewedPosts([...viewedPosts, postId]);
      })
      .catch(() => {
        // View logging should never interrupt reading the post.
      });
  }, [postId]);

  return null;
}

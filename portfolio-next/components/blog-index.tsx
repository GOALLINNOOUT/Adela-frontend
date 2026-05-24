"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatedReveal } from "@/components/animated-reveal";
import { BlogCard } from "@/components/blog-card";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { mapBlogSummary } from "@/lib/mappers";
import type { BlogPostSummary } from "@/lib/types";

function CategoryIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 7h16" strokeLinecap="round" />
      <path d="M8 12h8" strokeLinecap="round" />
      <path d="M11 17h2" strokeLinecap="round" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" aria-hidden="true">
      <path d="M7 7l10 10" strokeLinecap="round" />
      <path d="M17 7 7 17" strokeLinecap="round" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8" aria-hidden="true">
      <path d="M7 4.75h10a1 1 0 0 1 1 1v14l-6-3.5-6 3.5v-14a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
    </svg>
  );
}

function CardSkeleton() {
  return (
    <article className="h-full overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface-strong)] shadow-[var(--shadow-card)]">
      <div className="relative aspect-[16/10] animate-pulse overflow-hidden bg-[linear-gradient(135deg,#efe5d8,#f7f2ea)]" />
      <div className="space-y-5 p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="h-6 w-24 animate-pulse rounded-full bg-[var(--surface)]" />
          <div className="h-4 w-24 animate-pulse rounded bg-[var(--surface)]" />
        </div>
        <div className="space-y-3">
          <div className="h-8 w-full animate-pulse rounded bg-[var(--surface)]" />
          <div className="h-8 w-3/4 animate-pulse rounded bg-[var(--surface)]" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-[var(--surface)]" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-[var(--surface)]" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-[var(--surface)]" />
        </div>
        <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
          <div className="h-4 w-28 animate-pulse rounded bg-[var(--surface)]" />
          <div className="h-4 w-24 animate-pulse rounded bg-[var(--surface)]" />
        </div>
      </div>
    </article>
  );
}

export function BlogIndex() {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [bookmarkIds, setBookmarkIds] = useState<string[]>([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [filterBarVisible, setFilterBarVisible] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const categoryDropdownRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const limit = 9;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [searchQuery]);

  const loadPosts = useCallback(
    async (pageArg: number, replace = false) => {
      const controller = new AbortController();

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = controller;

      if (pageArg === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        setError("");

        const params = new URLSearchParams();
        params.set("page", String(pageArg));
        params.set("limit", String(limit));
        params.set("sortBy", "date");

        if (debouncedSearch) {
          params.set("search", debouncedSearch);
        }

        if (activeCategory !== "All") {
          params.set("category", activeCategory);
        }

        const response = await fetch(`/api/blog?${params.toString()}`, {
          signal: controller.signal,
          cache: "no-store"
        });

        if (!response.ok) {
          throw new Error("Failed to load blog posts.");
        }

        const data = await response.json();
        const nextPosts: BlogPostSummary[] = Array.isArray(data.posts) ? data.posts.map(mapBlogSummary) : [];
        const total = typeof data.total === "number" ? data.total : null;

        setAvailableCategories((current) => {
          const next = new Set(current);
          nextPosts.forEach((post) => {
            if (post.category) {
              next.add(post.category);
            }
          });
          return ["All", ...Array.from(next).filter((item) => item !== "All")];
        });

        setPosts((current) => {
          if (replace) return nextPosts;

          return [...current, ...nextPosts.filter((post) => !current.some((item) => item._id === post._id))];
        });

        if (typeof total === "number") {
          const fetched = (pageArg - 1) * limit + nextPosts.length;
          setHasMore(fetched < total);
        } else {
          setHasMore(nextPosts.length === limit);
        }

        setPage(pageArg + 1);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Failed to load blog posts.");
        setHasMore(false);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setLoadingMore(false);
        }

        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    [activeCategory, debouncedSearch]
  );

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    loadPosts(1, true);
  }, [loadPosts]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (!categoryOpen) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (categoryDropdownRef.current?.contains(target)) return;
      setCategoryOpen(false);
    }

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [categoryOpen]);

  useEffect(() => {
    function syncBookmarks() {
      try {
        const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
        setBookmarkIds(Array.isArray(bookmarks) ? bookmarks.filter((item) => typeof item === "string") : []);
      } catch {
        setBookmarkIds([]);
      }
    }

    syncBookmarks();
    window.addEventListener("storage", syncBookmarks);
    window.addEventListener("focus", syncBookmarks);
    return () => {
      window.removeEventListener("storage", syncBookmarks);
      window.removeEventListener("focus", syncBookmarks);
    };
  }, []);

  useEffect(() => {
    if (!bookmarkedOnly || bookmarkIds.length === 0) return;

    const missingIds = bookmarkIds.filter((id) => !posts.some((post) => post._id === id));
    if (missingIds.length === 0) return;

    let cancelled = false;

    async function loadBookmarkedPosts() {
      setLoadingBookmarks(true);

      try {
        const results = await Promise.all(
          missingIds.map(async (id) => {
            const response = await fetch(`/api/blog/${id}`, { cache: "no-store" });
            if (!response.ok) return null;
            const data = await response.json();
            return mapBlogSummary(data);
          })
        );

        if (cancelled) return;

        setPosts((current) => {
          const nextPosts = results.filter((post): post is BlogPostSummary => Boolean(post));
          return [...current, ...nextPosts.filter((post) => !current.some((item) => item._id === post._id))];
        });
      } finally {
        if (!cancelled) {
          setLoadingBookmarks(false);
        }
      }
    }

    loadBookmarkedPosts();

    return () => {
      cancelled = true;
    };
  }, [bookmarkIds, bookmarkedOnly, posts]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let frameId = 0;

    const handleScroll = () => {
      if (frameId) return;

      frameId = window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const scrollingUp = currentScrollY < lastScrollY;
        const nearTop = currentScrollY < 120;

        setFilterBarVisible(nearTop || scrollingUp);
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

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || loading || loadingMore || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadPosts(page);
        }
      },
      {
        root: null,
        rootMargin: "220px",
        threshold: 0.1
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadPosts, loading, loadingMore, page]);

  const categories = useMemo(() => availableCategories, [availableCategories]);
  const featuredPost = posts[0];
  const activeQuery = debouncedSearch || searchQuery.trim();
  const categoryLabel = activeCategory === "All" ? "Categories" : activeCategory;
  const heroImage = "/images/hero.jpg";
  const visiblePosts = useMemo(() => {
    const query = activeQuery.toLowerCase();

    return posts.filter((post) => {
      const matchesBookmark = !bookmarkedOnly || bookmarkIds.includes(post._id);
      const matchesCategory = activeCategory === "All" || post.category === activeCategory;
      const matchesQuery =
        !query ||
        [post.title, post.excerpt, post.category, ...(post.tags || [])].some((value) => value.toLowerCase().includes(query));

      return matchesBookmark && matchesCategory && matchesQuery;
    });
  }, [activeCategory, activeQuery, bookmarkIds, bookmarkedOnly, posts]);

  return (
    <Section>
      <Container className="space-y-12">
        <AnimatedReveal className="grid gap-10 border-b border-[var(--border)] pb-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-5">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">Blog</p>
            <h1 className="max-w-4xl font-sans text-[3rem] font-bold leading-[0.96] tracking-[-0.045em] text-[var(--foreground)] md:text-[4.8rem] md:leading-[0.92]">
              Blog & Insight
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[var(--muted)] md:text-lg">
              Notes from shipping, rebuilding, and learning how products become clearer when structure and interface
              decisions are treated together.
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-md lg:mr-0">
            <div className="absolute -left-4 top-8 h-16 w-24 rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-strong)] shadow-[var(--shadow-card)]" />
            <div className="absolute -right-3 bottom-8 h-20 w-28 rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-strong)] shadow-[var(--shadow-card)]" />
            <div className="relative aspect-[16/11] overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--media-surface)] shadow-[var(--shadow-soft)]">
              <Image
                src={heroImage}
                alt="Blog insight visual"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-contain object-center"
              />
            </div>
          </div>
        </AnimatedReveal>

        <motion.div
          className="pointer-events-none sticky top-[5.85rem] z-[90] mx-auto max-w-3xl"
          initial={false}
          animate={{ opacity: filterBarVisible ? 1 : 0, y: filterBarVisible ? 0 : -16 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
            className={`grid w-full grid-cols-[1fr_auto] items-center gap-2 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-strong)] p-2 shadow-[var(--shadow-card)] backdrop-blur sm:flex sm:flex-row sm:rounded-full ${
              filterBarVisible ? "pointer-events-auto" : "pointer-events-none"
            }`}
          >
            <label className="relative col-span-2 min-w-0 sm:col-span-1 sm:flex-1">
              <span className="sr-only">Search articles</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search articles"
                className="min-h-11 w-full rounded-[1.1rem] bg-transparent px-4 pr-12 text-base text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] sm:rounded-full sm:text-sm"
              />
              {searchQuery ? (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setSearchQuery("");
                    setDebouncedSearch("");
                  }}
                  className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[var(--muted)] transition duration-200 hover:scale-105 hover:text-[var(--foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--foreground)]"
                >
                  <ClearIcon />
                </button>
              ) : null}
            </label>

            <div ref={categoryDropdownRef} className="relative z-[100] min-w-0 sm:w-56">
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={categoryOpen}
                onClick={() => setCategoryOpen((current) => !current)}
                className="flex min-h-11 w-full items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 text-left text-sm text-[var(--foreground)] outline-none transition duration-300 hover:border-[var(--foreground)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--foreground)]"
              >
                <CategoryIcon />
                <span className="truncate">{categoryLabel}</span>
              </button>
              <AnimatePresence>
                {categoryOpen ? (
                  <motion.div
                    role="listbox"
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute right-0 top-[calc(100%+0.5rem)] z-[120] max-h-72 w-full overflow-y-auto rounded-[1.1rem] border border-[var(--border)] bg-[var(--surface-strong)] p-1 shadow-[var(--shadow-soft)]"
                  >
                    {categories.map((category) => {
                      const selected = activeCategory === category;

                      return (
                        <button
                          key={category}
                          type="button"
                          role="option"
                          aria-selected={selected}
                          onClick={() => {
                            setActiveCategory(category);
                            setCategoryOpen(false);
                          }}
                          className={`w-full rounded-[0.9rem] px-3 py-2.5 text-left text-sm transition duration-200 ${
                            selected
                              ? "bg-[var(--foreground)] text-[var(--background)]"
                              : "text-[var(--foreground)] hover:bg-[var(--surface)]"
                          }`}
                        >
                          {category === "All" ? "All categories" : category}
                        </button>
                      );
                    })}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <button
              type="button"
              aria-label={bookmarkedOnly ? "Show all articles" : "Show bookmarked articles"}
              aria-pressed={bookmarkedOnly}
              onClick={() => setBookmarkedOnly((current) => !current)}
              className={`inline-flex min-h-11 w-12 items-center justify-center rounded-full border transition duration-300 sm:w-11 ${
                bookmarkedOnly
                  ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--foreground)]"
              }`}
            >
              <BookmarkIcon />
            </button>
          </div>
        </motion.div>

        {loading ? (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface-strong)] p-8">
            <p className="text-lg text-[var(--foreground)]">{error}</p>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Try refreshing the page. If the issue continues, the blog API may be temporarily unavailable.
            </p>
          </div>
        ) : visiblePosts.length === 0 ? (
          <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface-strong)] p-8">
            <p className="text-lg text-[var(--foreground)]">
              {bookmarkedOnly ? "No bookmarked posts match this filter yet." : "No posts match your search right now."}
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Adjust the category or try a different keyword to explore more writing.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
                Latest writing
              </p>
              <h2 className="font-sans text-[2.2rem] font-bold leading-[0.98] tracking-[-0.04em] text-[var(--foreground)] md:text-[3rem]">
                Ideas, builds, and implementation notes.
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visiblePosts.map((post, index) => (
                <AnimatedReveal key={post._id} className="h-full" delay={index * 0.05}>
                  <BlogCard post={post} query={activeQuery} />
                </AnimatedReveal>
              ))}
            </div>
            <div ref={sentinelRef} />
            {loadingMore ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <CardSkeleton key={`loading-more-${index}`} />
                ))}
              </div>
            ) : null}
            {!hasMore && visiblePosts.length > 0 ? (
              <p className="text-center text-sm text-[var(--muted)]">You&apos;ve reached the end of the archive.</p>
            ) : null}
          </div>
        )}
      </Container>
    </Section>
  );
}

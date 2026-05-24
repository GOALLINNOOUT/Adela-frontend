"use client";

import dynamic from "next/dynamic";
import { BlogPostPreviewModal } from "@/components/admin/blog-post-preview-modal";
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BlogToast, SpinnerIcon } from "@/components/blog-interaction-ui";
import { mapBlogSummary, mapContactRecord, mapTestimonial } from "@/lib/mappers";
import type {
  AboutAuthorProfile,
  AdminLoginInput,
  BlogPayload,
  BlogPostSummary,
  ContactRecord,
  Testimonial
} from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

type Tab = "blog" | "testimonials" | "contacts";

const fallbackAboutAuthor: AboutAuthorProfile = {
  name: "ADELA",
  bio: "ADELA writes about product decisions, web systems, and the practical lessons that show up while building useful digital experiences."
};

const BlogContentEditor = dynamic(
  () => import("@/components/admin/blog-content-editor").then((module) => module.BlogContentEditor),
  {
    ssr: false,
    loading: () => (
      <div className="grid min-h-[22rem] place-items-center rounded-[1.25rem] border border-[var(--border)] bg-white">
        <SpinnerIcon className="h-6 w-6 text-[var(--foreground)]" />
      </div>
    )
  }
);

type ConfirmAction = {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
} | null;

const loginInitialState: AdminLoginInput = {
  username: "",
  password: ""
};

const postInitialState: BlogPayload = {
  title: "",
  excerpt: "",
  content: "",
  category: "",
  tags: [],
  author: "ADELA",
  readTime: "1 min read",
  image: null
};

const defaultCategories = ["Technology", "Development", "Design", "Career", "Product", "Healthtech", "General"];
const maxImageSizeBytes = 5 * 1024 * 1024;
const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
const blogDraftStoragePrefix = "adela-admin-blog-draft";

type StoredBlogDraft = {
  editingPostId: string | null;
  form: Omit<BlogPayload, "image">;
  editingPostImageUrl: string;
  editingPostCreatedAt: string;
  savedAt: string;
};

function computeReadTime(content: string) {
  const words = content.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function getPostDraftKey(postId: string | null) {
  return `${blogDraftStoragePrefix}:${postId || "new"}`;
}

function readPostDraft(postId: string | null): StoredBlogDraft | null {
  try {
    const stored = window.localStorage.getItem(getPostDraftKey(postId));
    if (!stored) return null;
    return JSON.parse(stored) as StoredBlogDraft;
  } catch {
    return null;
  }
}

function deletePostDraft(postId: string | null) {
  try {
    window.localStorage.removeItem(getPostDraftKey(postId));
  } catch {
    // Local draft storage can be blocked in private browsing modes.
  }
}

function hasPostDraftContent(form: BlogPayload) {
  return Boolean(
    form.title.trim() ||
      form.excerpt.trim() ||
      form.content.replace(/<[^>]*>/g, " ").trim() ||
      form.category.trim() ||
      form.tags.length > 0
  );
}

function getPostDraftSnapshot(form: BlogPayload, imageUrl = "", createdAt = "") {
  return JSON.stringify({
    title: form.title,
    excerpt: form.excerpt,
    content: form.content,
    category: form.category,
    tags: form.tags,
    author: form.author,
    readTime: computeReadTime(form.content),
    imageUrl,
    createdAt
  });
}

function AdminLoadingState({ message = "Loading admin workspace..." }: { message?: string }) {
  return (
    <div className="grid min-h-[44vh] place-items-center border-y border-[var(--border)] bg-white/65 px-6 py-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <SpinnerIcon className="h-9 w-9 text-[var(--foreground)]" />
        <div>
          <p className="text-sm font-medium text-[var(--foreground)]">{message}</p>
          <p className="mt-2 text-sm text-[var(--muted)]">Fetching posts, testimonials, and contact messages.</p>
        </div>
      </div>
    </div>
  );
}

function AdminErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="border-y border-[var(--border)] bg-white/75 px-6 py-10">
      <p className="text-lg font-semibold text-[var(--foreground)]">Could not load admin data.</p>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--foreground)] px-5 text-sm font-medium text-white transition hover:bg-black"
      >
        Retry
      </button>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="border-y border-dashed border-[var(--border)] bg-white/55 px-6 py-10 text-center">
      <p className="text-lg font-semibold text-[var(--foreground)]">{title}</p>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--muted)]">{description}</p>
    </div>
  );
}

function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

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
  }, [locked]);
}

function AdminModal({
  title,
  description,
  children,
  onClose
}: {
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[80] grid h-dvh place-items-center overflow-hidden bg-black/45 p-3 backdrop-blur-sm md:p-6"
      onClick={onClose}
    >
      <motion.div
        onClick={(event) => event.stopPropagation()}
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 330, damping: 32, mass: 0.85 }}
        className="max-h-[calc(100dvh-1.5rem)] w-full max-w-5xl overflow-hidden rounded-[1.5rem] border border-white/55 bg-[var(--surface)] shadow-[0_24px_90px_rgba(0,0,0,0.24)] md:max-h-[calc(100dvh-3rem)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] bg-white/92 px-5 py-5 md:px-7">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">Blog editor</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">{title}</h2>
            {description ? <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--foreground)] transition hover:border-[var(--foreground)]"
            aria-label="Close modal"
          >
            x
          </button>
        </div>
        <div className="max-h-[calc(100dvh-9.375rem)] overflow-y-auto pb-5 md:max-h-[calc(100dvh-10.875rem)]">{children}</div>
      </motion.div>
    </motion.div>
  );
}

function ConfirmModal({
  action,
  busy,
  onClose
}: {
  action: ConfirmAction;
  busy: boolean;
  onClose: () => void;
}) {
  if (!action) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[85] grid h-dvh place-items-center overflow-hidden bg-black/45 p-4 backdrop-blur-sm"
      onClick={busy ? undefined : onClose}
    >
      <motion.div
        onClick={(event) => event.stopPropagation()}
        initial={{ opacity: 0, y: 18, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 14, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 380, damping: 30, mass: 0.8 }}
        className="w-full max-w-md rounded-[1.5rem] border border-[var(--border)] bg-white p-6 shadow-[0_24px_90px_rgba(0,0,0,0.24)]"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">Confirm action</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--foreground)]">{action.title}</h2>
        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{action.description}</p>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] px-5 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--foreground)] disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={action.onConfirm}
            disabled={busy}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--foreground)] px-5 text-sm font-medium text-white transition hover:bg-black disabled:opacity-60"
          >
            {busy ? <SpinnerIcon /> : null}
            {busy ? "Working..." : action.confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function AdminDashboard() {
  const [token, setToken] = useState<string>("");
  const [checkingSession, setCheckingSession] = useState(true);
  const [loginForm, setLoginForm] = useState<AdminLoginInput>(loginInitialState);
  const [loginError, setLoginError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<Tab>("blog");
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [postPage, setPostPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [postForm, setPostForm] = useState<BlogPayload>(postInitialState);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [toast, setToast] = useState<string>("");
  const [isBusy, setIsBusy] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [actionKey, setActionKey] = useState<string | null>(null);
  const [postEditorOpen, setPostEditorOpen] = useState(false);
  const [postPreviewOpen, setPostPreviewOpen] = useState(false);
  const [authorEditorOpen, setAuthorEditorOpen] = useState(false);
  const [aboutAuthor, setAboutAuthor] = useState<AboutAuthorProfile>(fallbackAboutAuthor);
  const [aboutAuthorForm, setAboutAuthorForm] = useState<AboutAuthorProfile>(fallbackAboutAuthor);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [sectionBarVisible, setSectionBarVisible] = useState(true);
  const [tagDraft, setTagDraft] = useState("");
  const [availablePostDraft, setAvailablePostDraft] = useState<StoredBlogDraft | null>(null);
  const [autoDraftStatus, setAutoDraftStatus] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [editingPostImageUrl, setEditingPostImageUrl] = useState("");
  const [editingPostCreatedAt, setEditingPostCreatedAt] = useState("");
  const toastTimerRef = useRef<number | null>(null);
  const activeSectionRef = useRef<HTMLDivElement | null>(null);
  const editorBaselineRef = useRef(getPostDraftSnapshot(postInitialState));
  useBodyScrollLock(postEditorOpen || postPreviewOpen || authorEditorOpen || Boolean(confirmAction));

  function showToast(message: string) {
    setToast(message);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(""), 5000);
  }

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  useEffect(() => {
    const storedToken = window.localStorage.getItem("adela-admin-token");
    if (storedToken) {
      setToken(storedToken);
    }
    setCheckingSession(false);
  }, []);

  useEffect(() => {
    if (!token) return;

    void loadAdminData(token);
  }, [token]);

  useEffect(() => {
    if (!postEditorOpen) return;

    const currentSnapshot = getPostDraftSnapshot(postForm, editingPostImageUrl, editingPostCreatedAt);
    if (currentSnapshot === editorBaselineRef.current || !hasPostDraftContent(postForm)) {
      return;
    }

    setAutoDraftStatus("Saving draft...");
    const timer = window.setTimeout(() => {
      try {
        const draft: StoredBlogDraft = {
          editingPostId,
          form: {
            title: postForm.title,
            excerpt: postForm.excerpt,
            content: postForm.content,
            category: postForm.category,
            tags: postForm.tags,
            author: postForm.author || "ADELA",
            readTime: computeReadTime(postForm.content)
          },
          editingPostImageUrl,
          editingPostCreatedAt,
          savedAt: new Date().toISOString()
        };

        window.localStorage.setItem(getPostDraftKey(editingPostId), JSON.stringify(draft));
        setAvailablePostDraft(draft);
        setAutoDraftStatus(postForm.image ? "Draft saved. Re-select image before publishing." : "Draft saved locally.");
      } catch {
        setAutoDraftStatus("Draft could not be saved.");
      }
    }, 900);

    return () => window.clearTimeout(timer);
  }, [editingPostCreatedAt, editingPostId, editingPostImageUrl, postEditorOpen, postForm]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let frameId = 0;

    const handleScroll = () => {
      if (frameId) return;

      frameId = window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const scrollingUp = currentScrollY < lastScrollY;
        const nearTop = currentScrollY < 120;

        setSectionBarVisible(nearTop || scrollingUp);
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

  const tabs = useMemo(
    () => [
      { key: "blog" as const, label: "Blog posts" },
      { key: "testimonials" as const, label: "Testimonials" },
      { key: "contacts" as const, label: "Contacts" }
    ],
    []
  );

  function changeActiveTab(tab: Tab) {
    if (tab === activeTab) return;

    setActiveTab(tab);
    window.setTimeout(() => {
      activeSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 70);
  }

  const categoryOptions = useMemo(() => {
    const next = new Set(defaultCategories);
    posts.forEach((post) => {
      if (post.category) next.add(post.category);
    });
    if (postForm.category) next.add(postForm.category);
    return Array.from(next);
  }, [postForm.category, posts]);

  const draftPreviewPost = useMemo<BlogPostSummary>(
    () => ({
      _id: editingPostId || "draft-preview",
      title: postForm.title || "Untitled post",
      excerpt: postForm.excerpt || "Your excerpt will appear here.",
      content: postForm.content || "<p>No content available.</p>",
      image: imagePreviewUrl || editingPostImageUrl || "/images/hero.jpg",
      category: postForm.category || "Uncategorized",
      tags: postForm.tags,
      author: postForm.author || "ADELA",
      readTime: computeReadTime(postForm.content),
      views: 0,
      createdAt: editingPostCreatedAt || new Date().toISOString()
    }),
    [editingPostCreatedAt, editingPostId, editingPostImageUrl, imagePreviewUrl, postForm]
  );

  function addTags(values: string[]) {
    const nextTags = values.map((value) => value.trim()).filter(Boolean);
    if (nextTags.length === 0) return;

    setPostForm((current) => {
      const existing = new Set(current.tags.map((tag) => tag.toLowerCase()));
      const merged = [...current.tags];

      nextTags.forEach((tag) => {
        if (!existing.has(tag.toLowerCase())) {
          merged.push(tag);
          existing.add(tag.toLowerCase());
        }
      });

      return { ...current, tags: merged };
    });
    setTagDraft("");
  }

  function removeTag(tag: string) {
    setPostForm((current) => ({
      ...current,
      tags: current.tags.filter((item) => item !== tag)
    }));
  }

  function handlePostImageChange(file?: File | null) {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl("");
    }

    if (!file) {
      setPostForm((current) => ({ ...current, image: null }));
      return;
    }

    if (!allowedImageTypes.includes(file.type)) {
      showToast("Use JPG, JPEG, PNG, GIF, SVG, or WEBP images only.");
      setPostForm((current) => ({ ...current, image: null }));
      return;
    }

    if (file.size > maxImageSizeBytes) {
      showToast("Image must be 5MB or smaller.");
      setPostForm((current) => ({ ...current, image: null }));
      return;
    }

    setPostForm((current) => ({ ...current, image: file }));
    setImagePreviewUrl(URL.createObjectURL(file));
  }

  async function authorizedFetch(path: string, init?: RequestInit) {
    return fetch(path, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        Authorization: `Bearer ${token}`
      }
    });
  }

  async function loadPosts(currentToken = token, page = 1, append = false) {
    if (page > 1) {
      setLoadingMorePosts(true);
    }

    try {
    const limit = 6;
    const response = await fetch(`/api/blog?page=${page}&limit=${limit}&sortBy=date`, {
      headers: currentToken ? { Authorization: `Bearer ${currentToken}` } : undefined
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Could not load blog posts.");
    }
    const nextPosts: BlogPostSummary[] = Array.isArray(data.posts) ? data.posts.map(mapBlogSummary) : [];
    setPosts((current) => {
      if (!append) return nextPosts;
      return [...current, ...nextPosts.filter((post) => !current.some((item) => item._id === post._id))];
    });

    const total = typeof data.total === "number" ? data.total : null;
    const currentPage = typeof data.page === "number" ? data.page : page;
    const currentLimit = typeof data.limit === "number" ? data.limit : limit;

    setPostPage(currentPage);
    setHasMorePosts(typeof total === "number" ? currentPage * currentLimit < total : nextPosts.length === limit);
    } finally {
      setLoadingMorePosts(false);
    }
  }

  async function loadTestimonials(currentToken = token) {
    const response = await fetch("/api/admin/testimonials", {
      headers: currentToken ? { Authorization: `Bearer ${currentToken}` } : undefined
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Could not load testimonials.");
    }
    setTestimonials(Array.isArray(data) ? data.map(mapTestimonial) : []);
  }

  async function loadContacts(currentToken = token) {
    const response = await fetch("/api/admin/contacts", {
      headers: currentToken ? { Authorization: `Bearer ${currentToken}` } : undefined
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Could not load contacts.");
    }
    setContacts(Array.isArray(data) ? data.map(mapContactRecord) : []);
  }

  async function loadAboutAuthor(currentToken = token) {
    const response = await fetch("/api/admin/about-author", {
      headers: currentToken ? { Authorization: `Bearer ${currentToken}` } : undefined
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Could not load author profile.");
    }

    const profile = {
      _id: data?._id,
      name: data?.name || fallbackAboutAuthor.name,
      bio: data?.bio || fallbackAboutAuthor.bio,
      updatedAt: data?.updatedAt
    };

    setAboutAuthor(profile);
    setAboutAuthorForm(profile);
  }

  async function loadAdminData(currentToken = token) {
    setInitialLoading(true);
    setLoadError("");

    try {
      setPostPage(1);
      setHasMorePosts(true);
      await Promise.all([
        loadPosts(currentToken, 1, false),
        loadTestimonials(currentToken),
        loadContacts(currentToken),
        loadAboutAuthor(currentToken)
      ]);
      showToast("Admin data loaded.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not load admin data.";
      setLoadError(message);
      showToast(message);
      if (error instanceof Error && /401|403|token|auth/i.test(error.message)) {
        signOut();
      }
    } finally {
      setInitialLoading(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setActionKey("login");
    setLoginError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginForm)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Login failed");
      }

      window.localStorage.setItem("adela-admin-token", data.token);
      setToken(data.token);
      setLoginForm(loginInitialState);
      showToast("Signed in successfully.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      setLoginError(message);
      showToast(message);
    } finally {
      setIsBusy(false);
      setActionKey(null);
    }
  }

  function beginEdit(post: BlogPostSummary) {
    const savedDraft = readPostDraft(post._id);
    const nextForm = {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content || "",
      category: post.category,
      tags: post.tags || [],
      author: post.author || "ADELA",
      readTime: post.readTime,
      image: null
    };
    setEditingPostId(post._id);
    setEditingPostImageUrl(post.image || "");
    setEditingPostCreatedAt(post.createdAt || "");
    setPostForm(nextForm);
    editorBaselineRef.current = getPostDraftSnapshot(nextForm, post.image || "", post.createdAt || "");
    setTagDraft("");
    setAvailablePostDraft(savedDraft);
    setAutoDraftStatus(savedDraft ? "Local draft available." : "");
    setImagePreviewUrl("");
    setPostPreviewOpen(false);
    setActiveTab("blog");
    setPostEditorOpen(true);
  }

  function resetEditor() {
    setEditingPostId(null);
    setPostForm(postInitialState);
    editorBaselineRef.current = getPostDraftSnapshot(postInitialState);
    setTagDraft("");
    setAvailablePostDraft(readPostDraft(null));
    setAutoDraftStatus("");
    setImagePreviewUrl("");
    setEditingPostImageUrl("");
    setEditingPostCreatedAt("");
    setPostPreviewOpen(false);
  }

  function beginCreatePost() {
    resetEditor();
    setAvailablePostDraft(readPostDraft(null));
    editorBaselineRef.current = getPostDraftSnapshot(postInitialState);
    setActiveTab("blog");
    setPostEditorOpen(true);
  }

  function beginEditAuthor() {
    setAboutAuthorForm(aboutAuthor);
    setAuthorEditorOpen(true);
  }

  function closePostEditor() {
    if (isBusy) return;
    setPostEditorOpen(false);
    resetEditor();
  }

  function closeAuthorEditor() {
    if (isBusy) return;
    setAuthorEditorOpen(false);
    setAboutAuthorForm(aboutAuthor);
  }

  async function handleLoadMorePosts() {
    try {
      await loadPosts(token, postPage + 1, true);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not load more posts.");
    }
  }

  function restorePostDraft() {
    const draft = availablePostDraft || readPostDraft(editingPostId);
    if (!draft) {
      showToast("No local draft found.");
      return;
    }

    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    setPostForm({
      ...draft.form,
      image: null
    });
    setEditingPostImageUrl(draft.editingPostImageUrl || "");
    setEditingPostCreatedAt(draft.editingPostCreatedAt || "");
    editorBaselineRef.current = getPostDraftSnapshot(
      { ...draft.form, image: null },
      draft.editingPostImageUrl || "",
      draft.editingPostCreatedAt || ""
    );
    setImagePreviewUrl("");
    setTagDraft("");
    setAvailablePostDraft(draft);
    setAutoDraftStatus("Draft restored.");
    showToast("Local draft restored.");
  }

  function clearPostDraftLocally() {
    deletePostDraft(editingPostId);
    setAvailablePostDraft(null);
    setAutoDraftStatus("");
    showToast("Local draft cleared.");
  }

  async function handlePostSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!postForm.content.replace(/<[^>]*>/g, "").trim()) {
      showToast("Add content before saving the post.");
      return;
    }

    setIsBusy(true);
    setActionKey("save-post");

    try {
      const formData = new FormData();
      formData.set("title", postForm.title);
      formData.set("excerpt", postForm.excerpt);
      formData.set("content", postForm.content);
      formData.set("category", postForm.category);
      formData.set("author", postForm.author);
      formData.set("readTime", computeReadTime(postForm.content));
      formData.set("tags", JSON.stringify(postForm.tags));
      if (postForm.image) {
        formData.set("image", postForm.image);
      }

      const path = editingPostId ? `/api/blog/${editingPostId}` : "/api/blog";
      const method = editingPostId ? "PUT" : "POST";

      const response = await authorizedFetch(path, {
        method,
        body: formData
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Could not save post.");
      }

      showToast(editingPostId ? "Blog post updated." : "Blog post created.");
      deletePostDraft(editingPostId);
      setAvailablePostDraft(null);
      resetEditor();
      setPostEditorOpen(false);
      await loadPosts(token, 1, false);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not save post.");
    } finally {
      setIsBusy(false);
      setActionKey(null);
    }
  }

  async function handleAboutAuthorSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextName = aboutAuthorForm.name.trim();
    const nextBio = aboutAuthorForm.bio.trim();

    if (!nextName || !nextBio) {
      showToast("Author name and bio are required.");
      return;
    }

    if (nextBio.length > 700) {
      showToast("Author bio must be 700 characters or fewer.");
      return;
    }

    setIsBusy(true);
    setActionKey("save-author");

    try {
      const response = await authorizedFetch("/api/admin/about-author", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: nextName, bio: nextBio })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Could not update author profile.");
      }

      const profile = {
        _id: data?._id,
        name: data?.name || nextName,
        bio: data?.bio || nextBio,
        updatedAt: data?.updatedAt
      };
      setAboutAuthor(profile);
      setAboutAuthorForm(profile);
      setAuthorEditorOpen(false);
      showToast("Author bio updated.");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not update author profile.");
    } finally {
      setIsBusy(false);
      setActionKey(null);
    }
  }

  async function handleDeletePost(id: string) {
    setIsBusy(true);
    setActionKey(`delete-post-${id}`);
    try {
      const response = await authorizedFetch(`/api/blog/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Could not delete post.");
      }

      showToast("Blog post deleted.");
      await loadPosts(token, 1, false);
      if (editingPostId === id) resetEditor();
      setConfirmAction(null);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not delete post.");
    } finally {
      setIsBusy(false);
      setActionKey(null);
    }
  }

  async function approveTestimonial(id: string) {
    setIsBusy(true);
    setActionKey(`approve-testimonial-${id}`);
    try {
      const response = await authorizedFetch(`/api/admin/testimonials/${id}/approve`, {
        method: "PUT"
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Could not approve testimonial.");
      }

      showToast("Testimonial approved.");
      await loadTestimonials();
      setConfirmAction(null);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not approve testimonial.");
    } finally {
      setIsBusy(false);
      setActionKey(null);
    }
  }

  async function deleteTestimonial(id: string) {
    setIsBusy(true);
    setActionKey(`delete-testimonial-${id}`);
    try {
      const response = await authorizedFetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE"
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Could not delete testimonial.");
      }

      showToast("Testimonial deleted.");
      await loadTestimonials();
      setConfirmAction(null);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not delete testimonial.");
    } finally {
      setIsBusy(false);
      setActionKey(null);
    }
  }

  function signOut() {
    window.localStorage.removeItem("adela-admin-token");
    setToken("");
    setPosts([]);
    setPostPage(1);
    setHasMorePosts(true);
    setLoadingMorePosts(false);
    setTestimonials([]);
    setContacts([]);
    setAboutAuthor(fallbackAboutAuthor);
    setAboutAuthorForm(fallbackAboutAuthor);
    setLoadError("");
    setInitialLoading(false);
    resetEditor();
    setAuthorEditorOpen(false);
  }

  if (checkingSession) {
    return <AdminLoadingState message="Checking admin session..." />;
  }

  if (!token) {
    return (
      <div className="grid min-h-[58vh] place-items-center">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md space-y-6 rounded-[1.5rem] border border-[var(--border)] bg-white/90 p-6 shadow-[var(--shadow-soft)] md:p-8"
        >
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent-strong)]">
              Admin Access
            </p>
            <h1 className="font-serif text-3xl tracking-tight text-[var(--foreground)]">Sign in</h1>
            <p className="text-sm leading-7 text-[var(--muted)]">
              Manage blog posts, testimonials, and contact messages from the new frontend.
            </p>
          </div>
          <label className="space-y-2 text-sm font-medium text-[var(--foreground)]">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Username</span>
            <input
              required
              value={loginForm.username}
              onChange={(event) =>
                setLoginForm((current) => ({ ...current, username: event.target.value }))
              }
              className="min-h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
            />
          </label>
          <label className="space-y-3 text-sm font-medium text-[var(--foreground)]">
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Password</span>
            <input
              required
              type="password"
              value={loginForm.password}
              onChange={(event) =>
                setLoginForm((current) => ({ ...current, password: event.target.value }))
              }
              className="min-h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
            />
          </label>
          {loginError ? <p className="text-sm text-[var(--muted)]">{loginError}</p> : null}
          <button
            type="submit"
            disabled={isBusy}
            className="mt-2 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--foreground)] px-6 py-3 text-[0.95rem] font-medium leading-none text-white transition hover:bg-black disabled:opacity-60"
          >
            {actionKey === "login" ? <SpinnerIcon /> : null}
            {actionKey === "login" ? "Signing in..." : "Sign in"}
          </button>
          <BlogToast message={toast} onDismiss={() => setToast("")} />
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-[var(--border)] bg-white/65 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">Workspace</p>
          <p className="mt-1 text-sm text-[var(--muted)]">Manage the live portfolio content.</p>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-white px-4 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--foreground)]"
        >
          Sign out
        </button>
      </div>

      <div
        className={`sticky top-[4.85rem] z-40 flex justify-center transition duration-300 ${
          sectionBarVisible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        <div className="inline-flex w-full max-w-xl items-center gap-1 rounded-full border border-[var(--border)] bg-white/90 p-1 shadow-[var(--shadow-card)] backdrop-blur sm:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => changeActiveTab(tab.key)}
              className="relative flex-1 overflow-hidden rounded-full px-4 py-2.5 text-sm font-medium transition sm:min-w-36"
            >
              {activeTab === tab.key ? (
                <motion.span
                  layoutId="admin-section-active"
                  className="absolute inset-0 rounded-full bg-[var(--foreground)]"
                  transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.75 }}
                />
              ) : null}
              <span
                className={cn(
                  "relative z-10 transition-colors duration-200",
                  activeTab === tab.key ? "text-[var(--on-foreground)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"
                )}
              >
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="border-y border-[var(--border)] bg-white/65 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Posts</p>
          <p className="mt-2 text-3xl font-semibold text-[var(--foreground)]">{posts.length}</p>
        </div>
        <div className="border-y border-[var(--border)] bg-white/65 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Testimonials</p>
          <p className="mt-2 text-3xl font-semibold text-[var(--foreground)]">{testimonials.length}</p>
        </div>
        <div className="border-y border-[var(--border)] bg-white/65 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Contacts</p>
          <p className="mt-2 text-3xl font-semibold text-[var(--foreground)]">{contacts.length}</p>
        </div>
      </div>

      <BlogToast message={toast} onDismiss={() => setToast("")} />
      <AnimatePresence>
        {confirmAction ? (
          <ConfirmModal key="confirm-action" action={confirmAction} busy={Boolean(actionKey)} onClose={() => setConfirmAction(null)} />
        ) : null}
      </AnimatePresence>
      <BlogPostPreviewModal
        open={postPreviewOpen}
        post={draftPreviewPost}
        aboutAuthor={aboutAuthor}
        onClose={() => setPostPreviewOpen(false)}
      />

      {initialLoading ? (
        <AdminLoadingState />
      ) : loadError ? (
        <AdminErrorState message={loadError} onRetry={() => void loadAdminData()} />
      ) : (
        <>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          ref={activeSectionRef}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="scroll-mt-32"
        >
      {activeTab === "blog" ? (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-[var(--border)] bg-white/65 px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">Blog posts</p>
              <p className="mt-1 text-sm text-[var(--muted)]">Create, edit, and remove published posts.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={beginEditAuthor}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--foreground)]"
              >
                Edit author bio
              </button>
              <button
                type="button"
                onClick={beginCreatePost}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--foreground)] px-5 text-sm font-medium text-[var(--on-foreground)] transition hover:opacity-90"
              >
                Create post
              </button>
            </div>
          </div>

          <AnimatePresence>
            {postEditorOpen ? (
              <AdminModal
                title={editingPostId ? "Edit post" : "Create post"}
                description="Write the post details and save to the existing backend."
                onClose={closePostEditor}
              >
              <form onSubmit={handlePostSubmit} className="flex min-h-0 flex-col">
            <div className="grid gap-5 p-5 md:grid-cols-2 md:p-7">
              <div className="space-y-5">
            <label className="space-y-2 text-sm font-medium text-[var(--foreground)]">
              <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Title</span>
              <input
                required
                value={postForm.title}
                onChange={(event) => setPostForm((current) => ({ ...current, title: event.target.value }))}
                className="min-h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-[var(--foreground)]">
              <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Excerpt</span>
              <textarea
                required
                rows={3}
                value={postForm.excerpt}
                onChange={(event) =>
                  setPostForm((current) => ({ ...current, excerpt: event.target.value }))
                }
                className="w-full rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm leading-7 outline-none transition focus:border-[var(--accent)]"
              />
            </label>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-[var(--foreground)]">
                <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Category</span>
                <select
                  required
                  value={postForm.category}
                  onChange={(event) =>
                    setPostForm((current) => ({ ...current, category: event.target.value }))
                  }
                  className="min-h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2 text-sm font-medium text-[var(--foreground)]">
                <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Author</span>
                <input
                  required
                  value={postForm.author}
                  onChange={(event) => setPostForm((current) => ({ ...current, author: event.target.value }))}
                  className="min-h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
                />
              </label>
            </div>
            <label className="space-y-2 text-sm font-medium text-[var(--foreground)]">
              <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Tags</span>
              <div className="min-h-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 transition focus-within:border-[var(--accent)]">
                <div className="flex flex-wrap items-center gap-2">
                  {postForm.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex min-h-8 items-center gap-2 rounded-full bg-white px-3 text-xs font-medium text-[var(--foreground)] shadow-[var(--shadow-card)]"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/5 text-[var(--muted)] transition hover:bg-black/10 hover:text-[var(--foreground)]"
                        aria-label={`Remove ${tag}`}
                      >
                        x
                      </button>
                    </span>
                  ))}
                  <input
                    value={tagDraft}
                    onChange={(event) => {
                      const value = event.target.value;
                      if (value.includes(",")) {
                        addTags(value.split(","));
                        return;
                      }
                      setTagDraft(value);
                    }}
                    onKeyDown={(event) => {
                      if (["Enter", ",", " "].includes(event.key) && tagDraft.trim()) {
                        event.preventDefault();
                        addTags([tagDraft]);
                      }
                    }}
                    onBlur={() => addTags([tagDraft])}
                    className="min-h-8 min-w-36 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-[var(--muted)]"
                    placeholder={postForm.tags.length === 0 ? "Type a tag, then space or comma" : "Add tag"}
                  />
                </div>
              </div>
            </label>
              </div>
              <div className="space-y-5">
            <div className="space-y-2 text-sm font-medium text-[var(--foreground)]">
              <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Content</span>
              <BlogContentEditor
                key={editingPostId || "new-post"}
                value={postForm.content}
                onChange={(html) => setPostForm((current) => ({ ...current, content: html }))}
              />
            </div>
            <label className="space-y-2 text-sm font-medium text-[var(--foreground)]">
              <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{editingPostId ? "Replace image (optional)" : "Image"}</span>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.svg,.webp,image/jpeg,image/png,image/gif,image/svg+xml,image/webp"
                onChange={(event) => handlePostImageChange(event.target.files?.[0] || null)}
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none file:mr-4 file:rounded-full file:border-0 file:bg-[var(--foreground)] file:px-4 file:py-2 file:text-sm file:text-white"
              />
              <p className="text-xs leading-5 text-[var(--muted)]">JPG, JPEG, PNG, GIF, SVG, or WEBP. Maximum size: 5MB.</p>
              {imagePreviewUrl ? (
                <div className="overflow-hidden rounded-[1.25rem] border border-[var(--border)] bg-white p-3">
                  <img src={imagePreviewUrl} alt="Selected blog image preview" className="aspect-[16/9] w-full rounded-xl object-cover" />
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--muted)]">
                    <span className="truncate">{postForm.image?.name}</span>
                    <button
                      type="button"
                      onClick={() => handlePostImageChange(null)}
                      className="rounded-full border border-[var(--border)] px-3 py-1 font-medium text-[var(--foreground)] transition hover:border-[var(--foreground)]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : null}
            </label>
              </div>
            </div>
            <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] bg-white/95 px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 backdrop-blur md:px-7">
              <div className="flex flex-wrap items-center gap-2">
                {editingPostId ? (
                  <button
                    type="button"
                    onClick={resetEditor}
                    disabled={isBusy}
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] px-4 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--foreground)] disabled:opacity-60"
                  >
                    Reset fields
                  </button>
                ) : null}
                {availablePostDraft ? (
                  <>
                    <button
                      type="button"
                      onClick={restorePostDraft}
                      disabled={isBusy}
                      className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] px-4 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--foreground)] disabled:opacity-60"
                    >
                      Restore draft
                    </button>
                    <button
                      type="button"
                      onClick={clearPostDraftLocally}
                      disabled={isBusy}
                      className="inline-flex min-h-11 items-center justify-center rounded-full px-3 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)] disabled:opacity-60"
                    >
                      Clear
                    </button>
                    <span className="text-xs text-[var(--muted)]">
                      {autoDraftStatus || `Saved ${formatDate(availablePostDraft.savedAt)}`}
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-[var(--muted)]">
                    {autoDraftStatus || "Drafts save automatically in this browser."}
                  </span>
                )}
              </div>
              <div className="flex w-full flex-wrap items-center justify-end gap-3 sm:w-auto">
                <button
                  type="button"
                  onClick={() => setPostPreviewOpen(true)}
                  className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full border border-[var(--border)] bg-white px-6 py-3 text-[0.95rem] font-medium leading-none text-[var(--foreground)] transition hover:border-[var(--foreground)] sm:flex-none"
                >
                  Preview
                </button>
                <button
                  type="submit"
                  disabled={isBusy}
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[var(--foreground)] px-6 py-3 text-[0.95rem] font-medium leading-none text-white transition hover:bg-black disabled:opacity-60 sm:flex-none"
                >
                  {actionKey === "save-post" ? <SpinnerIcon /> : null}
                  {actionKey === "save-post" ? "Saving..." : editingPostId ? "Update post" : "Create post"}
                </button>
              </div>
            </div>
              </form>
              </AdminModal>
            ) : null}
          </AnimatePresence>
          <AnimatePresence>
            {authorEditorOpen ? (
              <AdminModal
                title="Edit author bio"
                description="Update the short author note shown inside every blog post."
                onClose={closeAuthorEditor}
              >
                <form onSubmit={handleAboutAuthorSubmit} className="space-y-5 p-5 md:p-7">
                  <label className="space-y-2 text-sm font-medium text-[var(--foreground)]">
                    <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Display name</span>
                    <input
                      required
                      value={aboutAuthorForm.name}
                      onChange={(event) =>
                        setAboutAuthorForm((current) => ({ ...current, name: event.target.value.toUpperCase() }))
                      }
                      className="min-h-12 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm outline-none transition focus:border-[var(--accent)]"
                    />
                  </label>
                  <label className="space-y-2 text-sm font-medium text-[var(--foreground)]">
                    <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">About author</span>
                    <textarea
                      required
                      rows={6}
                      maxLength={700}
                      value={aboutAuthorForm.bio}
                      onChange={(event) => setAboutAuthorForm((current) => ({ ...current, bio: event.target.value }))}
                      className="w-full rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm leading-7 outline-none transition focus:border-[var(--accent)]"
                    />
                  </label>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-5">
                    <p className="text-xs text-[var(--muted)]">{aboutAuthorForm.bio.length}/700 characters</p>
                    <div className="flex w-full flex-wrap justify-end gap-3 sm:w-auto">
                      <button
                        type="button"
                        onClick={closeAuthorEditor}
                        disabled={isBusy}
                        className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-[var(--border)] px-5 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--foreground)] disabled:opacity-60 sm:flex-none"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isBusy}
                        className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[var(--foreground)] px-5 text-sm font-medium text-[var(--on-foreground)] transition hover:opacity-90 disabled:opacity-60 sm:flex-none"
                      >
                        {actionKey === "save-author" ? <SpinnerIcon /> : null}
                        {actionKey === "save-author" ? "Saving..." : "Save bio"}
                      </button>
                    </div>
                  </div>
                </form>
              </AdminModal>
            ) : null}
          </AnimatePresence>

          <div className="space-y-4">
            {posts.length === 0 ? (
              <EmptyState
                title="No blog posts yet."
                description="Create the first post from the editor. Saved posts will appear here for editing and deletion."
              />
            ) : null}
            {posts.map((post) => (
              <article
                key={post._id}
                className="group overflow-hidden rounded-[1.5rem] border border-black/10 bg-white/85 shadow-[0_12px_40px_rgba(17,17,17,0.06)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_22px_60px_rgba(17,17,17,0.1)]"
              >
                <div className="grid gap-0 md:grid-cols-[184px_1fr]">
                  <div className="relative aspect-[16/10] overflow-hidden bg-[var(--media-surface)] md:aspect-auto md:min-h-48">
                    <img
                      src={post.image || "/images/hero.jpg"}
                      alt=""
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/16 via-transparent to-transparent" />
                  </div>
                  <div className="flex min-w-0 flex-col gap-4 p-5 md:p-6">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent-strong)]">
                    {post.category}
                  </p>
                  <h3 className="text-xl font-semibold text-[var(--foreground)]">{post.title}</h3>
                  <p className="text-sm leading-7 text-[var(--muted)]">{post.excerpt}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(post.tags || []).map((tag) => (
                    <span key={tag} className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs text-[var(--muted)]">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-[var(--muted)]">
                  <span>
                    {formatDate(post.createdAt)} • {post.readTime}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => beginEdit(post)}
                      className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition hover:border-[var(--foreground)]"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={Boolean(actionKey)}
                      onClick={() =>
                        setConfirmAction({
                          title: "Delete blog post?",
                          description: `This will permanently delete "${post.title}". This action cannot be undone.`,
                          confirmLabel: "Delete post",
                          onConfirm: () => void handleDeletePost(post._id)
                        })
                      }
                      className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
                    >
                      {actionKey === `delete-post-${post._id}` ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
                  </div>
                </div>
              </article>
            ))}
            {hasMorePosts ? (
              <div className="flex justify-center border-t border-[var(--border)] pt-5">
                <button
                  type="button"
                  onClick={() => void handleLoadMorePosts()}
                  disabled={loadingMorePosts || Boolean(actionKey)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--border)] bg-white px-5 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--foreground)] disabled:cursor-wait disabled:opacity-60"
                >
                  {loadingMorePosts ? <SpinnerIcon /> : null}
                  {loadingMorePosts ? "Loading..." : "Load more posts"}
                </button>
              </div>
            ) : posts.length > 0 ? (
              <p className="border-t border-[var(--border)] pt-5 text-center text-sm text-[var(--muted)]">
                All blog posts loaded.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {activeTab === "testimonials" ? (
        <div className="grid gap-4">
          {testimonials.length === 0 ? (
            <EmptyState
              title="No testimonials yet."
              description="Approved and pending testimonials will appear here when visitors submit them."
            />
          ) : null}
          {testimonials.map((testimonial) => (
            <article
              key={testimonial._id}
              className="space-y-4 rounded-[1.5rem] border border-[var(--border)] bg-white/90 p-5 shadow-[var(--shadow-card)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--foreground)]">{testimonial.name}</h2>
                  <p className="text-sm text-[var(--muted)]">{testimonial.position}</p>
                </div>
                <span
                  className={
                    testimonial.approved
                      ? "rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs text-[var(--foreground)]"
                      : "rounded-full border border-[var(--border)] bg-white px-3 py-1 text-xs text-[var(--muted)]"
                  }
                >
                  {testimonial.approved ? "Approved" : "Pending"}
                </span>
              </div>
              <p className="text-sm leading-7 text-[var(--foreground)]">{testimonial.testimonial}</p>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-sm text-[var(--muted)]">{formatDate(testimonial.createdAt)}</p>
                <div className="flex gap-2">
                  {!testimonial.approved ? (
                    <button
                      type="button"
                      disabled={Boolean(actionKey)}
                      onClick={() =>
                        setConfirmAction({
                          title: "Approve testimonial?",
                          description: `This will publish the testimonial from ${testimonial.name}.`,
                          confirmLabel: "Approve",
                          onConfirm: () => void approveTestimonial(testimonial._id)
                        })
                      }
                      className="rounded-full bg-[var(--foreground)] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-black"
                    >
                      {actionKey === `approve-testimonial-${testimonial._id}` ? "Approving..." : "Approve"}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    disabled={Boolean(actionKey)}
                    onClick={() =>
                      setConfirmAction({
                        title: "Delete testimonial?",
                        description: `This will permanently delete the testimonial from ${testimonial.name}.`,
                        confirmLabel: "Delete",
                        onConfirm: () => void deleteTestimonial(testimonial._id)
                      })
                    }
                    className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
                  >
                    {actionKey === `delete-testimonial-${testimonial._id}` ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {activeTab === "contacts" ? (
        <div className="grid gap-4">
          {contacts.length === 0 ? (
            <EmptyState
              title="No contact messages."
              description="Messages from the contact page will appear here once they are submitted."
            />
          ) : null}
          {contacts.map((contact) => (
            <article
              key={contact._id}
              className="space-y-4 rounded-[1.5rem] border border-[var(--border)] bg-white/90 p-5 shadow-[var(--shadow-card)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--foreground)]">{contact.name}</h2>
                  <p className="text-sm text-[var(--muted)]">{contact.email}</p>
                </div>
                <p className="text-sm text-[var(--muted)]">{formatDate(contact.createdAt)}</p>
              </div>
              <p className="text-sm font-medium text-[var(--foreground)]">{contact.subject}</p>
              <p className="text-sm leading-7 text-[var(--foreground)]">{contact.message}</p>
            </article>
          ))}
        </div>
      ) : null}
        </motion.div>
      </AnimatePresence>
        </>
      )}
    </div>
  );
}

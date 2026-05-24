export default function BlogPostLoading() {
  return (
    <main className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-[var(--surface)] text-[var(--foreground)]">
      <div
        className="h-9 w-9 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--foreground)] shadow-[0_0_18px_rgba(255,255,255,0.12)]"
        aria-label="Loading blog post"
      />
    </main>
  );
}

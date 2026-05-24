"use client";

import { useState, type FormEvent } from "react";
import type { ContactFormInput } from "@/lib/types";

const initialState: ContactFormInput = {
  name: "",
  email: "",
  subject: "",
  message: ""
};

export function ContactForm() {
  const [form, setForm] = useState<ContactFormInput>(initialState);
  const [status, setStatus] = useState<{ kind: "idle" | "success" | "error"; message?: string }>({
    kind: "idle"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ kind: "idle" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to send your message.");
      }

      setForm(initialState);
      setStatus({ kind: "success", message: "Thanks. Your message has been sent successfully." });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "Something went wrong."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-[2rem] border border-[var(--border)] bg-white/90 p-6 shadow-[var(--shadow-card)] md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm text-[var(--foreground)]">
          <span>Name</span>
          <input
            required
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none transition focus:border-[var(--accent)]"
          />
        </label>
        <label className="space-y-2 text-sm text-[var(--foreground)]">
          <span>Email</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none transition focus:border-[var(--accent)]"
          />
        </label>
      </div>
      <label className="space-y-2 text-sm text-[var(--foreground)]">
        <span>Subject</span>
        <input
          required
          value={form.subject}
          onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none transition focus:border-[var(--accent)]"
        />
      </label>
      <label className="space-y-2 text-sm text-[var(--foreground)]">
        <span>Message</span>
        <textarea
          required
          rows={7}
          value={form.message}
          onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
          className="w-full rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none transition focus:border-[var(--accent)]"
        />
      </label>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--foreground)] px-6 py-3 text-[0.95rem] font-medium leading-none text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Send message"}
        </button>
        {status.kind !== "idle" ? (
          <p
            className={
              status.kind === "success" ? "text-sm text-[var(--foreground)]" : "text-sm text-[var(--muted)]"
            }
          >
            {status.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}

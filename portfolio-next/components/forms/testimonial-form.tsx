"use client";

import { useState, type FormEvent } from "react";

type FormState = {
  name: string;
  position: string;
  rating: number;
  testimonial: string;
};

const initialState: FormState = {
  name: "",
  position: "",
  rating: 5,
  testimonial: ""
};

export function TestimonialForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<{ kind: "idle" | "success" | "error"; message?: string }>({
    kind: "idle"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ kind: "idle" });

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Could not submit testimonial.");
      }

      setForm(initialState);
      setStatus({
        kind: "success",
        message: "Thanks. Your testimonial has been submitted for review."
      });
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
          <span>Role or company</span>
          <input
            required
            value={form.position}
            onChange={(event) => setForm((current) => ({ ...current, position: event.target.value }))}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none transition focus:border-[var(--accent)]"
          />
        </label>
      </div>
      <label className="space-y-2 text-sm text-[var(--foreground)]">
        <span>Rating</span>
        <select
          value={form.rating}
          onChange={(event) =>
            setForm((current) => ({ ...current, rating: Number(event.target.value) }))
          }
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none transition focus:border-[var(--accent)]"
        >
          {[5, 4, 3, 2, 1].map((rating) => (
            <option key={rating} value={rating}>
              {rating}
            </option>
          ))}
        </select>
      </label>
      <label className="space-y-2 text-sm text-[var(--foreground)]">
        <span>Testimonial</span>
        <textarea
          required
          rows={6}
          value={form.testimonial}
          onChange={(event) =>
            setForm((current) => ({ ...current, testimonial: event.target.value }))
          }
          className="w-full rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none transition focus:border-[var(--accent)]"
        />
      </label>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--foreground)] px-6 py-3 text-[0.95rem] font-medium leading-none text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Submitting..." : "Submit testimonial"}
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

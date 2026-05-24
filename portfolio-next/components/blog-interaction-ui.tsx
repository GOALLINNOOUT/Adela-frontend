"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

type IconProps = {
  className?: string;
};

export function SpinnerIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-80" d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowLeftIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M15 5 8 12l7 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12h11" strokeLinecap="round" />
    </svg>
  );
}

export function BookmarkIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M7 4.5h10a1 1 0 0 1 1 1v15l-6-3.75-6 3.75v-15a1 1 0 0 1 1-1Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ShareIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M8.5 13.5 15.5 17.5" strokeLinecap="round" />
      <path d="M15.5 6.5 8.5 10.5" strokeLinecap="round" />
      <circle cx="6.5" cy="12" r="2.5" />
      <circle cx="17.5" cy="5.5" r="2.5" />
      <circle cx="17.5" cy="18.5" r="2.5" />
    </svg>
  );
}

export function LikeIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M7.5 21h-3V10h3v11Z" strokeLinejoin="round" />
      <path d="M7.5 10 12 3.5c.7-1 2.3-.5 2.3.8v4.2H19a2 2 0 0 1 2 2.3l-1.2 7.5A3.2 3.2 0 0 1 16.6 21H7.5V10Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HeartIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M20.4 5.8a5 5 0 0 0-7.1 0L12 7.1l-1.3-1.3a5 5 0 1 0-7.1 7.1L12 21l8.4-8.1a5 5 0 0 0 0-7.1Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WowIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.7 10h.01M15.3 10h.01" strokeLinecap="round" />
      <ellipse cx="12" cy="15.4" rx="2.1" ry="2.6" />
    </svg>
  );
}

export function SadIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.7 10h.01M15.3 10h.01" strokeLinecap="round" />
      <path d="M8.8 17c1.9-2 4.5-2 6.4 0" strokeLinecap="round" />
    </svg>
  );
}

export function ReplyIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="m9 8-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 13h9a6 6 0 0 1 6 6v1" strokeLinecap="round" />
    </svg>
  );
}

export function TrashIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M5 7h14M10 11v6M14 11v6M9 7l.7-2h4.6L15 7M7 7l1 14h8l1-14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CloseIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="m7 7 10 10M17 7 7 17" strokeLinecap="round" />
    </svg>
  );
}

export function BlogToast({ message, onDismiss }: { message: string; onDismiss?: () => void }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toast = (
    <AnimatePresence>
      {message ? (
        <motion.div
          key="blog-toast"
          initial={{ opacity: 0, x: "-50%", y: 18, scale: 0.96 }}
          animate={{ opacity: 1, x: "-50%", y: 0, scale: 1 }}
          exit={{ opacity: 0, x: "-50%", y: 14, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.8 }}
          className="fixed bottom-6 left-1/2 z-[90] flex w-[calc(100%-2rem)] max-w-sm items-center justify-between gap-3 rounded-full border border-white/20 bg-[var(--foreground)] py-2 pl-5 pr-2 text-sm font-medium text-white shadow-[0_20px_60px_rgba(17,17,17,0.22)]"
        >
          {message}
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss notification"
            title="Cancel"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <CloseIcon />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return createPortal(toast, document.body);
}

export function IconButton({
  children,
  label,
  active = false,
  disabled = false,
  onClick
}: {
  children: ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={
        active
          ? "inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--foreground)] text-white shadow-[var(--shadow-card)] transition hover:bg-black disabled:cursor-wait disabled:opacity-60"
          : "inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--foreground)] shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:border-[var(--foreground)] disabled:cursor-wait disabled:opacity-60"
      }
    >
      {children}
    </button>
  );
}

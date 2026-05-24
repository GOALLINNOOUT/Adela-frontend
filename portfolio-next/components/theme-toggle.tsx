"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getPreferredTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const storedTheme = window.localStorage.getItem("adela-theme");
  if (storedTheme === "light" || storedTheme === "dark") return storedTheme;

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const preferredTheme = getPreferredTheme();
    setTheme(preferredTheme);
    applyTheme(preferredTheme);
    setMounted(true);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
    window.localStorage.setItem("adela-theme", nextTheme);
  }

  const isDark = mounted && theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="group relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--foreground)] shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--foreground)]"
    >
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.55),transparent_42%)] opacity-60 transition group-hover:opacity-100" />
      <span className="relative h-5 w-5" aria-hidden="true">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.svg
              key="moon"
              viewBox="0 0 24 24"
              fill="none"
              className="absolute inset-0 h-5 w-5"
              initial={{ opacity: 0, rotate: -28, scale: 0.72 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 28, scale: 0.72 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <path
                d="M20.1 14.35A7.35 7.35 0 0 1 9.65 3.9a8.45 8.45 0 1 0 10.45 10.45Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M17.45 3.95v2.4M16.25 5.15h2.4" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
            </motion.svg>
          ) : (
            <motion.svg
              key="sun"
              viewBox="0 0 24 24"
              fill="none"
              className="absolute inset-0 h-5 w-5"
              initial={{ opacity: 0, rotate: 28, scale: 0.72 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -28, scale: 0.72 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <circle cx="12" cy="12" r="3.45" stroke="currentColor" strokeWidth="1.7" />
              <path
                d="M12 2.9v2.05M12 19.05v2.05M4.55 4.55 6 6M18 18l1.45 1.45M2.9 12h2.05M19.05 12h2.05M4.55 19.45 6 18M18 6l1.45-1.45"
                stroke="currentColor"
                strokeWidth="1.55"
                strokeLinecap="round"
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </span>
    </button>
  );
}

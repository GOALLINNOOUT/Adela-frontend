"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAdminAccess } from "@/components/admin-access-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { adminVisible } = useAdminAccess();
  const navItems = adminVisible
    ? siteConfig.navItems
    : siteConfig.navItems.filter((item) => item.href !== "/admin");

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-mobile-navigation]")) return;

      setMenuOpen(false);
    }

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--header-surface)] backdrop-blur-xl">
      <div className="relative flex w-full items-center justify-between px-6 py-4 md:px-8" data-mobile-navigation>
        <Link href="/" className="text-sm font-semibold tracking-[0.28em] text-[var(--foreground)] uppercase">
          {siteConfig.name}
        </Link>
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative px-1 py-2 text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]",
                  active && "text-[var(--foreground)]"
                )}
              >
                <span
                  className={cn(
                    "absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-[var(--foreground)] transition-transform duration-300",
                    active && "scale-x-100",
                    !active && "group-hover:scale-x-100"
                  )}
                  aria-hidden="true"
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-strong)] md:hidden"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            <span className="relative block h-3.5 w-4">
              <span className={cn("absolute left-0 top-0 h-px w-4 bg-[var(--foreground)] transition", menuOpen && "top-1.5 rotate-45")} />
              <span className={cn("absolute left-0 top-1.5 h-px w-4 bg-[var(--foreground)] transition", menuOpen && "opacity-0")} />
              <span className={cn("absolute left-0 top-3 h-px w-4 bg-[var(--foreground)] transition", menuOpen && "top-1.5 -rotate-45")} />
            </span>
          </button>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {menuOpen ? (
          <motion.nav
            data-mobile-navigation
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-[var(--border)] bg-[var(--background)] md:hidden"
          >
            <div className="min-h-[calc(100dvh-4.75rem)] px-7 pb-12 pt-8">
              <div className="flex flex-col items-start gap-4">
              {navItems.map((item, index) => {
                const active = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "group relative inline-flex items-center gap-3 font-sans text-[2.65rem] font-black uppercase leading-none tracking-[-0.07em] transition duration-300",
                        active
                          ? "text-[var(--foreground)]"
                          : "text-[var(--muted)] hover:text-[var(--foreground)]"
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full bg-[var(--foreground)] transition duration-300",
                          active ? "scale-100 opacity-100" : "scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-50"
                        )}
                        aria-hidden="true"
                      />
                      <span className={cn("relative z-10", active ? "drop-shadow-[1.5px_0_0_rgba(0,185,255,0.35)]" : "")}>
                        {item.label}
                      </span>
                      <span
                        className={cn(
                          "absolute bottom-[-0.25rem] left-4 h-px w-[calc(100%-1rem)] origin-left bg-[var(--foreground)] transition-transform duration-300",
                          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        )}
                        aria-hidden="true"
                      />
                    </Link>
                  </motion.div>
                );
              })}
              </div>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

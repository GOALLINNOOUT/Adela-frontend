"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { CSSProperties, MouseEvent, ReactNode } from "react";

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isPrimary = variant === "primary";
  const classes = cn(
    "group relative inline-flex min-h-12 items-center justify-center overflow-hidden rounded-full px-6 py-3 text-[0.95rem] font-medium leading-none transition-all duration-300 ease-out active:translate-y-0",
    isPrimary
      ? "bg-[var(--foreground)] text-[var(--on-foreground)] shadow-[var(--shadow-card)] hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(17,17,17,0.18)]"
      : "border border-[var(--border)] bg-white text-[var(--foreground)] hover:-translate-y-1 hover:border-[var(--foreground)] hover:bg-white hover:shadow-[0_14px_36px_rgba(17,17,17,0.08)]",
    className
  );
  const primaryStyle = isPrimary
    ? ({ backgroundColor: "var(--foreground)", color: "var(--on-foreground)" } as CSSProperties)
    : undefined;

  function handleHashClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!href.includes("#") || href.startsWith("http")) return;

    const url = new URL(href, window.location.origin);
    const hash = decodeURIComponent(url.hash.replace(/^#/, ""));
    if (!hash) return;

    event.preventDefault();

    const nextHref = `${url.pathname}#${hash}`;
    if (url.pathname === pathname) {
      window.history.replaceState(null, "", nextHref);
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    router.push(nextHref, { scroll: false });
  }

  if (href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={classes}
        style={primaryStyle}
      >
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
        <span className="relative transition-transform duration-300 ease-out group-hover:scale-[1.02]" style={primaryStyle}>
          {children}
        </span>
      </a>
    );
  }

  if (href.includes("#")) {
    return (
      <a href={href} className={classes} style={primaryStyle} onClick={handleHashClick}>
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
        <span className="relative transition-transform duration-300 ease-out group-hover:scale-[1.02]" style={primaryStyle}>
          {children}
        </span>
      </a>
    );
  }

  return (
    <Link href={href} className={classes} style={primaryStyle}>
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
      <span className="relative transition-transform duration-300 ease-out group-hover:scale-[1.02]" style={primaryStyle}>
        {children}
      </span>
    </Link>
  );
}

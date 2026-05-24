"use client";

import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent } from "react";

export function ProjectStoryLink({ slug, children }: { slug: string; children: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const href = `/projects#${slug}`;

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    if (pathname === "/projects") {
      window.history.replaceState(null, "", href);
      document.getElementById(slug)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    router.push(href, { scroll: false });
  }

  return (
    <a href={href} onClick={handleClick} className="font-medium text-[var(--foreground)]">
      {children}
    </a>
  );
}

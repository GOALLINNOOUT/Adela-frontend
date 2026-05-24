"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function RouteScrollManager() {
  const pathname = usePathname();

  useEffect(() => {
    let frame = 0;
    let timeout = 0;
    let attempts = 0;

    const scrollToHashOrTop = () => {
      const rawHash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      const hashParts = rawHash.split("#").filter(Boolean);
      const hash = hashParts.at(-1) || "";

      if (hashParts.length > 1) {
        window.history.replaceState(null, "", `${window.location.pathname}#${hash}`);
      }

      if (hash) {
        const target = document.getElementById(hash);
        if (target) {
          target.scrollIntoView({ block: "start" });
          return;
        }

        attempts += 1;
        if (attempts < 12) {
          timeout = window.setTimeout(scrollToHashOrTop, 80);
          return;
        }
      }

      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    frame = window.requestAnimationFrame(scrollToHashOrTop);
    window.addEventListener("hashchange", scrollToHashOrTop);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
      window.removeEventListener("hashchange", scrollToHashOrTop);
    };
  }, [pathname]);

  return null;
}

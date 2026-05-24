"use client";

import { useEffect } from "react";

type LinkPreview = {
  title?: string;
  description?: string;
  image?: string | null;
  url?: string;
  domain?: string;
  error?: string;
};

type BlogLinkPreviewsProps = {
  targetId: string;
};

const urlPattern = /(https?:\/\/[^\s<]+)/g;

function linkifyPlainUrls(target: HTMLElement) {
  const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const parent = node.parentElement;
    if (!parent || parent.closest("a, script, style, .link-preview-placeholder")) continue;
    if (urlPattern.test(node.nodeValue || "")) {
      textNodes.push(node);
    }
    urlPattern.lastIndex = 0;
  }

  textNodes.forEach((node) => {
    const text = node.nodeValue || "";
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;

    text.replace(urlPattern, (match: string, _url: string, offset: number) => {
      fragment.append(document.createTextNode(text.slice(lastIndex, offset)));

      const anchor = document.createElement("a");
      anchor.href = match;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.textContent = match;
      fragment.append(anchor);

      lastIndex = offset + match.length;
      return match;
    });

    fragment.append(document.createTextNode(text.slice(lastIndex)));
    node.replaceWith(fragment);
  });
}

function buildLoadingCard() {
  const placeholder = document.createElement("div");
  placeholder.className =
    "link-preview-placeholder my-5 overflow-hidden rounded-[1.25rem] border border-[var(--border)] bg-white/75 shadow-[var(--shadow-card)]";
  placeholder.innerHTML = `
    <div class="flex flex-col gap-4 p-4 sm:flex-row">
      <div class="aspect-[16/9] w-full shrink-0 animate-pulse rounded-xl bg-black/10 sm:h-20 sm:w-28"></div>
      <div class="min-w-0 flex-1 space-y-3 py-1">
        <div class="h-3 w-24 animate-pulse rounded-full bg-black/10"></div>
        <div class="h-4 w-4/5 animate-pulse rounded-full bg-black/10"></div>
        <div class="h-3 w-full animate-pulse rounded-full bg-black/10"></div>
      </div>
    </div>
  `;
  return placeholder;
}

function renderPreviewCard(placeholder: HTMLElement, data: LinkPreview, fallbackUrl: string) {
  if (!data || data.error) {
    placeholder.remove();
    return;
  }

  const url = data.url || fallbackUrl;
  const card = document.createElement("a");
  card.href = url;
  card.target = "_blank";
  card.rel = "noopener noreferrer";
  card.className =
    "group flex flex-col gap-4 p-4 text-[var(--foreground)] transition hover:bg-white sm:flex-row md:items-center";

  if (data.image) {
    const image = document.createElement("img");
    image.src = data.image;
    image.alt = data.title || data.domain || "Link preview";
    image.className = "aspect-[16/9] w-full shrink-0 rounded-xl object-cover sm:h-20 sm:w-28";
    card.appendChild(image);
  }

  const meta = document.createElement("div");
  meta.className = "min-w-0 flex-1";

  const domain = document.createElement("p");
  domain.className = "text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]";
  domain.textContent = data.domain || new URL(url).hostname.replace(/^www\./, "");
  meta.appendChild(domain);

  const title = document.createElement("p");
  title.className = "mt-2 text-base font-semibold leading-snug text-[var(--foreground)] group-hover:underline";
  title.textContent = data.title || data.domain || url;
  meta.appendChild(title);

  if (data.description) {
    const description = document.createElement("p");
    description.className = "mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]";
    description.textContent = data.description;
    meta.appendChild(description);
  }

  card.appendChild(meta);
  placeholder.replaceChildren(card);
}

export function BlogLinkPreviews({ targetId }: BlogLinkPreviewsProps) {
  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    linkifyPlainUrls(target);
    const anchors = Array.from(target.querySelectorAll<HTMLAnchorElement>(".rich-text a[href]"));

    anchors.forEach((anchor) => {
      const href = anchor.href;
      if (!href || !href.startsWith("http") || anchor.dataset.previewInserted === "true") return;

      anchor.dataset.previewInserted = "true";
      const placeholder = buildLoadingCard();
      anchor.insertAdjacentElement("afterend", placeholder);

      fetch(`/api/preview?url=${encodeURIComponent(href)}`)
        .then((response) => response.json())
        .then((data: LinkPreview) => renderPreviewCard(placeholder, data, href))
        .catch(() => placeholder.remove());
    });
  }, [targetId]);

  return null;
}

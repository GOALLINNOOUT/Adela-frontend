"use client";

import { useEffect, useMemo, useState } from "react";

type Playlist = {
  id: string;
  title: string;
};

const playlist: Playlist = {
  id: "6y0AFRupHGUkrUbR1sXirh",
  title: "My playlist"
};

export function SpotifyPlayer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const playerUrl = useMemo(
    () => `https://open.spotify.com/embed/playlist/${playlist.id}?utm_source=generator&theme=0`,
    []
  );

  if (!mounted) {
    return null;
  }

  return (
    <aside
      data-spotify-player
      className="w-full rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-strong)] p-3 shadow-[var(--shadow-card)] transition duration-300"
      aria-label="Spotify playlist player"
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4 px-1">
        <div className="min-w-0">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">Listening to</p>
          <p className="mt-1 truncate text-base font-semibold text-[var(--foreground)]">{playlist.title}</p>
        </div>
      </div>

      <div className="relative h-[22rem] overflow-hidden rounded-[1rem] md:h-[24rem]">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={playerUrl}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title={`${playlist.title} Spotify playlist`}
        />
      </div>
    </aside>
  );
}

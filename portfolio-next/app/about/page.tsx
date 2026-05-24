import Image from "next/image";
import { AnimatedReveal } from "@/components/animated-reveal";
import { AboutInfluences } from "@/components/about-influences";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { SpotifyPlayer } from "@/components/spotify-player";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Learn more about Adela, an author and full-stack developer building meaningful systems at the intersection of health, human behavior, and technology.",
  path: "/about",
  image: "/images/image.png"
});

export default function AboutPage() {
  return (
    <Section>
      <Container className="space-y-14">
        <AnimatedReveal className="grid gap-12 border-b border-[var(--border)] pb-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">About</p>
            <h1 className="max-w-xl font-sans text-[3rem] font-bold uppercase leading-[0.92] tracking-[-0.06em] text-[var(--foreground)] md:text-[4.6rem]">
              Technology should serve people, not just impress them.
            </h1>
            <p className="max-w-xl text-base leading-8 text-[var(--muted)] md:text-lg">
              I build meaningful systems at the intersection of health, human behavior, and technology.
            </p>
          </div>

          <div className="relative transition duration-500 hover:-translate-y-1">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(247,212,136,0.28),rgba(251,248,242,0)_70%)]" />
            <div className="absolute inset-x-[16%] bottom-[8%] h-16 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.12),rgba(0,0,0,0)_72%)] blur-2xl" />
            <div className="relative mx-auto aspect-[4/5] max-w-[460px] overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--soft-panel)] p-3 shadow-[0_24px_70px_rgba(17,17,17,0.1)] backdrop-blur">
              <div className="relative h-full w-full overflow-hidden rounded-[1.45rem] bg-[linear-gradient(180deg,var(--surface)_0%,var(--hero-surface)_100%)]">
                <Image
                  src="/images/image.png"
                  alt="About Adela"
                  fill
                  className="object-contain object-bottom"
                  sizes="(max-width: 1024px) 100vw, 36vw"
                />
              </div>
            </div>
          </div>
        </AnimatedReveal>

        <AnimatedReveal className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">Approach</p>
            <h2 className="max-w-lg font-sans text-[2.2rem] font-bold uppercase leading-[0.94] tracking-[-0.05em] text-[var(--foreground)] md:text-[3rem]">
              Building with purpose, clarity, and long-term value.
            </h2>
          </div>

          <div className="space-y-6 text-sm leading-8 text-[var(--muted)] md:text-base">
            <p>
              I&apos;m Adela, an author and full-stack developer focused on building meaningful systems at the
              intersection of health, human behavior, and technology. My work is driven by a long-term vision: creating
              products that genuinely improve lives while building businesses rooted in value, purpose, and trust.
            </p>
            <p>
              I think deeply about discipline, responsibility, faith, and the kind of work worth dedicating years to.
              For me, building is not just about shipping features or following trends. It is about solving real
              problems with clarity, simplicity, and intention.
            </p>
            <p>
              As the founder of MediMate, I&apos;m exploring how technology can support medication management, mental
              wellness, and accessible health education in ways that feel human and practical. I care about thoughtful
              design, scalable systems, and creating experiences people can rely on.
            </p>
            <p>
              Outside development, I write about growth, purpose, creativity, and the mindset required to build things
              that last. I&apos;m drawn to meaningful conversations, strong ideas, and work that creates long-term impact
              rather than short-term attention.
            </p>
            <p>
              My goal is simple: build systems that matter, become exceptional at my craft, and create value large
              enough to outlive me.
            </p>
          </div>
        </AnimatedReveal>

        <AnimatedReveal className="space-y-8 border-t border-[var(--border)] pt-14">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div className="space-y-4">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">
                Inspirations
              </p>
              <h2 className="max-w-lg font-sans text-[2.2rem] font-bold uppercase leading-[0.94] tracking-[-0.05em] text-[var(--foreground)] md:text-[3rem]">
                People and values that shape how I keep building.
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-8 text-[var(--muted)] md:text-base">
              My inspiration comes from different places: faith, family, discipline, technology, leadership, and the
              courage to keep reaching for work that is bigger than comfort.
            </p>
          </div>

          <AboutInfluences />
        </AnimatedReveal>

        <AnimatedReveal className="space-y-8 border-t border-[var(--border)] pt-14">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div className="space-y-4">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">Soundtrack</p>
            <h2 className="max-w-lg font-sans text-[2.2rem] font-bold uppercase leading-[0.94] tracking-[-0.05em] text-[var(--foreground)] md:text-[3rem]">
              Songs that keep me locked in.
            </h2>
            </div>
            <p className="max-w-md text-sm leading-8 text-[var(--muted)] md:text-base">
              A small window into the playlists I listen to while coding, thinking, designing, or resetting.
            </p>
          </div>
          <div className="mx-auto w-full max-w-6xl">
            <SpotifyPlayer />
          </div>
        </AnimatedReveal>
      </Container>
    </Section>
  );
}

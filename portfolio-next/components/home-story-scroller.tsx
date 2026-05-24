"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedReveal } from "@/components/animated-reveal";
import { BlogCard } from "@/components/blog-card";
import { ButtonLink } from "@/components/button-link";
import { ShowcaseImage } from "@/components/showcase-image";
import type { BlogPostSummary, Project, SkillGroup as SkillGroupType } from "@/lib/types";

function ProjectCard({ project }: { project: Project }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.article
      whileHover={reducedMotion ? undefined : { y: -8 }}
      transition={{ type: "spring", stiffness: 260, damping: 24, mass: 0.8 }}
      className="group overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-[0_14px_44px_rgba(17,17,17,0.06)] transition-shadow duration-300 hover:shadow-[0_24px_70px_rgba(17,17,17,0.12)]"
    >
      <div className="relative aspect-[16/13] overflow-hidden bg-[var(--media-surface)]">
        <ShowcaseImage
          src={project.image}
          alt={project.title}
          sizes="(max-width: 768px) 100vw, 45vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/12 via-transparent to-white/8 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <div className="space-y-4 p-5 md:p-6">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
          {project.featured ? "Featured project" : "Selected project"}
        </p>
        <h3 className="font-serif text-2xl leading-tight text-[var(--foreground)]">{project.title}</h3>
        <p className="text-sm leading-7 text-[var(--muted)]">{project.summary}</p>
        <div className="pt-1">
          <ButtonLink href={`/projects#${project.slug}`} variant="secondary" className="min-h-10 px-4 py-2 text-sm">
            View this project
          </ButtonLink>
        </div>
      </div>
    </motion.article>
  );
}

export function HomeStoryScroller({
  projects,
  posts,
  skillGroups
}: {
  projects: Project[];
  posts: BlogPostSummary[];
  skillGroups: SkillGroupType[];
}) {
  const reducedMotion = useReducedMotion();
  const featuredProjects = projects.slice(0, 3);
  const visibleSkillGroups = skillGroups.filter((group) => group.title !== "Tools and Workflow");
  const focusAreas = [
    {
      title: "Frontend systems",
      body: "Interfaces with clearer hierarchy, better pacing, and a more thoughtful first impression."
    },
    {
      title: "Backend structure",
      body: "Reliable APIs and application logic that make the product feel steadier and easier to trust."
    },
    {
      title: "Product thinking",
      body: "Stronger structure, content flow, and decision-making across the whole product surface."
    }
  ];

  return (
    <div className="bg-[var(--hero-surface)]">
      <section className="px-4 py-4 md:px-8 md:py-8">
        <div className="mx-auto max-w-[1560px] space-y-8">
          <section className="overflow-hidden">
            <div className="grid gap-10 px-6 py-4 md:px-10 md:py-8 xl:grid-cols-[0.95fr_1.05fr] xl:items-center xl:px-14">
              <motion.div
                initial={reducedMotion ? undefined : { opacity: 0, y: 18 }}
                animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                <div className="space-y-5">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-[var(--muted)]">
                    Faith Adeyekun / Adela
                  </p>
                  <h1 className="max-w-2xl break-words font-sans text-[2.75rem] font-bold uppercase leading-[0.9] tracking-[-0.04em] text-[var(--foreground)] md:text-[4.8rem] md:tracking-[-0.07em] xl:text-[6rem]">
                    <span className="home-title-shadow">
                      Full-stack
                      <br />
                      Product
                      <br />
                      Engineer
                    </span>
                  </h1>
                  <p className="max-w-xl text-base leading-8 text-[var(--muted)] md:text-lg">
                    I build thoughtful interfaces, durable backend systems, and digital products that feel clearer,
                    calmer, and more considered from the very first screen.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <ButtonLink href="/projects">View selected work</ButtonLink>
                  <ButtonLink href="/contact" variant="secondary">
                    Start a conversation
                  </ButtonLink>
                </div>
              </motion.div>

              <motion.div
                initial={reducedMotion ? undefined : { opacity: 0, y: 20, scale: 0.98 }}
                animate={reducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(247,212,136,0.34),rgba(251,248,242,0)_68%)]" />
                <div className="absolute inset-x-[12%] bottom-[7%] h-20 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.12),rgba(0,0,0,0)_72%)] blur-2xl" />
                <motion.div
                  animate={reducedMotion ? undefined : { y: [0, -8, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  className="relative mx-auto aspect-[4/5] max-w-[520px] overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--soft-panel)] p-3 shadow-[0_24px_70px_rgba(17,17,17,0.1)] backdrop-blur"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[1.45rem] bg-[linear-gradient(180deg,var(--surface)_0%,var(--hero-surface)_100%)]">
                    <Image
                      src="/images/image.png"
                      alt="Faith Adeyekun portrait"
                      fill
                      priority
                      className="object-contain object-bottom saturate-[1.02] contrast-[1.02]"
                      sizes="(max-width: 1280px) 100vw, 40vw"
                    />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          <AnimatedReveal className="grid gap-10 border-t border-black/8 pt-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:pt-12">
            <div className="space-y-5">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">What I build</p>
              <h2 className="max-w-xl break-words font-sans text-[2.05rem] font-bold uppercase leading-[0.94] tracking-[-0.035em] text-[var(--foreground)] md:text-[3.4rem] md:tracking-[-0.06em]">
                Clear products need more than visual polish.
              </h2>
              <p className="max-w-xl text-sm leading-8 text-[var(--muted)] md:text-base">
                The work usually sits across interface quality, backend reliability, and product structure, especially
                when a system needs to feel simple without being simplistic.
              </p>
            </div>

            <div className="grid gap-6 self-end md:grid-cols-3 md:items-end">
              {focusAreas.map((item) => (
                <motion.article
                  key={item.title}
                  whileHover={reducedMotion ? undefined : { x: 4 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className="border-l border-black/8 pl-5 transition-colors duration-300 hover:border-[var(--foreground)] md:pl-6"
                >
                  <h3 className="font-serif text-2xl leading-tight text-[var(--foreground)]">{item.title}</h3>
                  <p className="mt-4 text-sm leading-8 text-[var(--muted)]">{item.body}</p>
                </motion.article>
              ))}
            </div>
          </AnimatedReveal>

          <AnimatedReveal className="p-6 md:p-8">
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">Selected work</p>
                <h2 className="mt-4 break-words font-sans text-[2.05rem] font-black uppercase leading-[0.94] tracking-[-0.035em] text-[var(--foreground)] md:text-[3.4rem] md:tracking-[-0.06em]">
                  <span className="home-title-shadow">Projects with stronger product stories.</span>
                </h2>
              </div>
              <Link
                href="/projects"
                className="hidden min-w-max whitespace-nowrap rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-[var(--foreground)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--foreground)] hover:shadow-[0_14px_36px_rgba(17,17,17,0.08)] md:inline-flex"
              >
                View all projects
              </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {featuredProjects.map((project, index) => (
                <AnimatedReveal key={project.slug} delay={index * 0.08}>
                  <ProjectCard project={project} />
                </AnimatedReveal>
              ))}
            </div>
          </AnimatedReveal>

          <AnimatedReveal className="grid gap-12 border-t border-black/8 pt-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">Experience & skills</p>
                <h2 className="max-w-xl break-words font-sans text-[1.95rem] font-bold uppercase leading-[0.96] tracking-[-0.035em] text-[var(--foreground)] md:text-[3.1rem] md:tracking-[-0.05em]">
                  Technical depth, kept simple.
                </h2>
                <p className="max-w-2xl text-sm leading-8 text-[var(--muted)] md:text-base">
                  The value is not just the stack. It is how the pieces come together to make the product feel clear,
                  stable, and easier to use.
                </p>
              </div>

              <div className="space-y-0">
                {visibleSkillGroups.slice(0, 4).map((group) => (
                  <div key={group.title} className="grid gap-5 border-t border-black/8 py-6 md:grid-cols-[240px_1fr]">
                    <div className="space-y-2">
                      <p className="text-xl font-medium leading-tight text-[var(--foreground)]">{group.title}</p>
                    </div>
                    <div className="flex flex-wrap gap-2.5 pt-1">
                      {group.items.slice(0, 4).map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-black/8 bg-white/72 px-3.5 py-1.5 text-xs text-[var(--foreground)]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-full border-l border-black/8 pl-0 lg:pl-10">
              <div className="flex h-full flex-col space-y-5">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">Contact</p>
                <h2 className="max-w-lg font-serif text-3xl leading-[1.08] text-[var(--foreground)] md:text-[3rem]">
                  If the product needs stronger structure and a cleaner experience, let&apos;s talk.
                </h2>
                <p className="max-w-lg text-sm leading-8 text-[var(--muted)] md:text-base">
                  Especially if it needs to feel premium without becoming empty, overbuilt, or generic.
                </p>

                <div className="mt-auto flex flex-wrap gap-3 pt-6">
                  <ButtonLink href="/contact">Contact Adela</ButtonLink>
                  <ButtonLink href="/projects" variant="secondary">
                    Explore work
                  </ButtonLink>
                </div>
              </div>
            </div>
          </AnimatedReveal>

          <AnimatedReveal className="p-6 md:p-8">
            <div className="mb-8 flex items-end justify-between gap-6">
              <div>
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">Writing</p>
                <h2 className="mt-4 break-words font-sans text-[1.95rem] font-black uppercase leading-[0.96] tracking-[-0.035em] text-[var(--foreground)] md:text-[3.4rem] md:tracking-[-0.06em]">
                  Notes on product thinking and implementation.
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden min-w-max whitespace-nowrap rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium text-[var(--foreground)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--foreground)] hover:shadow-[0_14px_36px_rgba(17,17,17,0.08)] md:inline-flex"
              >
                Visit the blog
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post, index) => (
                <AnimatedReveal key={post._id} className="h-full" delay={index * 0.08}>
                  <BlogCard post={post} />
                </AnimatedReveal>
              ))}
            </div>
          </AnimatedReveal>
        </div>
      </section>
    </div>
  );
}

import { ButtonLink } from "@/components/button-link";
import { AnimatedReveal } from "@/components/animated-reveal";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { ShowcaseImage } from "@/components/showcase-image";
import { projects } from "@/lib/site-config";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Projects",
  description: "Case-study style project storytelling from Adela across frontend, systems, and product work.",
  path: "/projects",
  image: "/images/medimate.png"
});

export default function ProjectsPage() {
  return (
    <Section>
      <Container className="space-y-14">
        <AnimatedReveal className="space-y-5 border-b border-[var(--border)] pb-12">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">Projects</p>
          <h1 className="max-w-4xl font-sans text-[3rem] font-bold uppercase leading-[0.92] tracking-[-0.06em] text-[var(--foreground)] md:text-[4.6rem]">
            <span className="home-title-shadow">A growing body of work shaped by product thinking and clearer systems.</span>
          </h1>
          <p className="max-w-2xl text-base leading-8 text-[var(--muted)] md:text-lg">
            Each project reflects a shift in how I think about structure, interface clarity, and the behavior of the
            product as a whole.
          </p>
        </AnimatedReveal>

        <div className="space-y-8">
          {projects.map((project, index) => (
            <AnimatedReveal
              key={project.slug}
              delay={index * 0.05}
              className="grid gap-8 scroll-mt-28 border-t border-[var(--border)] py-8 md:grid-cols-[0.92fr_1.08fr] md:py-10"
              id={project.slug}
            >
              <div className="space-y-4">
                <div className="group relative aspect-[16/11] overflow-hidden bg-[var(--media-surface)] shadow-[0_12px_36px_rgba(17,17,17,0.05)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(17,17,17,0.1)]">
                  <ShowcaseImage
                    src={project.image}
                    alt={project.title}
                    sizes="(max-width: 768px) 100vw, 42vw"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/12 via-transparent to-white/8 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[var(--border)] bg-white/70 px-3 py-1 text-xs text-[var(--muted)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--foreground)] hover:bg-white"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent-strong)]">
                    {project.featured ? "Flagship Project" : "Selected Project"}
                  </p>
                  <h2 className="font-serif text-3xl tracking-tight text-[var(--foreground)] md:text-4xl">
                    {project.title}
                  </h2>
                  <p className="text-base leading-8 text-[var(--muted)]">{project.summary}</p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="border-t border-[var(--border)] pt-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent-strong)]">Challenge</p>
                    <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{project.challenge}</p>
                  </div>
                  <div className="border-t border-[var(--border)] pt-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--accent-strong)]">Outcome</p>
                    <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{project.outcome}</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm leading-8 text-[var(--muted)] md:text-base">
                  {project.story.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  {project.liveUrl ? <ButtonLink href={project.liveUrl}>Visit live site</ButtonLink> : null}
                  {project.githubUrl ? (
                    <ButtonLink href={project.githubUrl} variant="secondary">
                      View repository
                    </ButtonLink>
                  ) : null}
                </div>
              </div>
            </AnimatedReveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

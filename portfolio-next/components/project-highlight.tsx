import { ButtonLink } from "@/components/button-link";
import { ShowcaseImage } from "@/components/showcase-image";
import type { Project } from "@/lib/types";

export function ProjectHighlight({ project }: { project: Project }) {
  return (
    <div className="grid gap-8 rounded-[2.5rem] border border-[var(--border)] bg-white/90 p-6 shadow-[var(--shadow-soft)] md:grid-cols-[1.1fr_0.9fr] md:p-10">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent-strong)]">
            Flagship Project
          </p>
          <h3 className="font-serif text-3xl tracking-tight text-[var(--foreground)] md:text-5xl">
            {project.title}
          </h3>
          <p className="max-w-xl text-base leading-8 text-[var(--muted)] md:text-lg">{project.summary}</p>
        </div>
        <p className="max-w-xl text-sm leading-7 text-[var(--muted)]">{project.challenge}</p>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <span
              key={item}
              className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs text-[var(--muted)] ring-1 ring-[var(--border)]"
            >
              {item}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/projects">View full case studies</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            Start a conversation
          </ButtonLink>
        </div>
      </div>
      <div className="grid gap-4">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
          <ShowcaseImage
            src={project.image}
            alt={project.title}
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {(project.gallery || []).slice(1, 3).map((image) => (
            <div key={image} className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
              <ShowcaseImage
                src={image}
                alt={`${project.title} preview`}
                sizes="25vw"
                insetClassName="inset-3"
                imageClassName="p-2"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

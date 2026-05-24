import { ProjectStoryLink } from "@/components/project-story-link";
import { ShowcaseImage } from "@/components/showcase-image";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white/90 shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-soft)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <ShowcaseImage
          src={project.image}
          alt={project.title}
          sizes="(max-width: 768px) 100vw, 50vw"
          imageClassName="transition duration-700 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-5 p-6 md:p-7">
        <div className="space-y-3">
          <h3 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">{project.title}</h3>
          <p className="text-sm leading-7 text-[var(--muted)]">{project.summary}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.stack.slice(0, 4).map((item) => (
            <span
              key={item}
              className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs text-[var(--muted)]"
            >
              {item}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between gap-4 text-sm">
          <ProjectStoryLink slug={project.slug}>Read the story</ProjectStoryLink>
          <div className="flex gap-4 text-[var(--muted)]">
            {project.liveUrl ? (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="hover:text-[var(--foreground)]">
                Live
              </a>
            ) : null}
            {project.githubUrl ? (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="hover:text-[var(--foreground)]">
                Code
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

import type { SkillGroup as SkillGroupType } from "@/lib/types";

export function SkillGroup({ group }: { group: SkillGroupType }) {
  return (
    <div className="rounded-[2rem] border border-[var(--border)] bg-white/80 p-6 shadow-[var(--shadow-card)]">
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">{group.title}</h3>
          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{group.description}</p>
        </div>
        <ul className="space-y-3 text-sm text-[var(--foreground)]">
          {group.items.map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

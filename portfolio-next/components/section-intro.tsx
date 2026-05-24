import { Eyebrow } from "@/components/eyebrow";
import { cn } from "@/lib/utils";

export function SectionIntro({
  eyebrow,
  title,
  description,
  className
}: {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl space-y-5", className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-serif text-3xl leading-tight tracking-tight text-[var(--foreground)] md:text-5xl">
        {title}
      </h2>
      <p className="text-base leading-8 text-[var(--muted)] md:text-lg">{description}</p>
    </div>
  );
}

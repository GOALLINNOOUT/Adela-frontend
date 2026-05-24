import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { Section } from "@/components/section";

export function NotFoundContent() {
  return (
    <Section>
      <Container className="grid min-h-[60vh] place-items-center">
        <div className="max-w-xl space-y-6 rounded-[2.5rem] border border-[var(--border)] bg-white/90 p-10 text-center shadow-[var(--shadow-soft)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent-strong)]">Not found</p>
          <h1 className="font-serif text-4xl tracking-tight text-[var(--foreground)] md:text-5xl">
            This page does not live in the new portfolio.
          </h1>
          <p className="text-sm leading-7 text-[var(--muted)] md:text-base">
            The route may have moved during the rebuild, or it may belong to the older frontend.
          </p>
          <div className="flex justify-center">
            <ButtonLink href="/">Return home</ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}

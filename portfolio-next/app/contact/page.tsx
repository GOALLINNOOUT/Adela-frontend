import { ContactForm } from "@/components/forms/contact-form";
import { AnimatedReveal } from "@/components/animated-reveal";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Reach out to Adela about product work, frontend engineering, backend systems, or a stronger rebuild.",
  path: "/contact"
});

export default function ContactPage() {
  return (
    <Section>
      <Container className="space-y-14">
        <AnimatedReveal className="space-y-5 border-b border-[var(--border)] pb-12">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">Contact</p>
          <h1 className="max-w-4xl font-sans text-[3rem] font-bold uppercase leading-[0.92] tracking-[-0.06em] text-[var(--foreground)] md:text-[4.6rem]">
            If the product matters, I'd like to hear about it.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-[var(--muted)] md:text-lg">
            The best conversations usually start with a real problem, a clear ambition, or a system that needs to
            become easier to trust.
          </p>
        </AnimatedReveal>

        <AnimatedReveal className="grid gap-10 md:grid-cols-[0.72fr_1.28fr]">
          <div className="space-y-8">
            <div className="border-t border-[var(--border)] pt-5">
              <p className="text-sm font-medium text-[var(--foreground)]">Email</p>
              <a href={`mailto:${siteConfig.email}`} className="mt-2 block text-sm leading-7 text-[var(--muted)] transition hover:translate-x-1 hover:text-[var(--foreground)]">
                {siteConfig.email}
              </a>
            </div>

            <div className="border-t border-[var(--border)] pt-5">
              <p className="text-sm font-medium text-[var(--foreground)]">Phone</p>
              <a href={`tel:${siteConfig.phone}`} className="mt-2 block text-sm leading-7 text-[var(--muted)] transition hover:translate-x-1 hover:text-[var(--foreground)]">
                {siteConfig.phone}
              </a>
            </div>

            <div className="border-t border-[var(--border)] pt-5">
              <p className="text-sm font-medium text-[var(--foreground)]">Social</p>
              <div className="mt-2 flex flex-col gap-2 text-sm leading-7 text-[var(--muted)]">
                {siteConfig.socialLinks.map((item) => (
                  <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="transition hover:translate-x-1 hover:text-[var(--foreground)]">
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--border)] pt-5">
            <ContactForm />
          </div>
        </AnimatedReveal>
      </Container>
    </Section>
  );
}

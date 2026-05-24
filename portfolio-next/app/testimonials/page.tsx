import { Container } from "@/components/container";
import { AnimatedReveal } from "@/components/animated-reveal";
import { Section } from "@/components/section";
import { TestimonialCard } from "@/components/testimonial-card";
import { TestimonialForm } from "@/components/forms/testimonial-form";
import { getTestimonials } from "@/lib/api/public";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Testimonials",
  description: "Client and collaborator feedback, plus a simple submission flow for sharing your experience.",
  path: "/testimonials"
});

export default async function TestimonialsPage() {
  const testimonials = (await getTestimonials()).filter((testimonial) => testimonial.approved);

  return (
    <Section>
      <Container className="space-y-14">
        <AnimatedReveal className="space-y-5 border-b border-[var(--border)] pb-12">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">
            Testimonials
          </p>
          <h1 className="max-w-4xl font-sans text-[3rem] font-bold uppercase leading-[0.92] tracking-[-0.06em] text-[var(--foreground)] md:text-[4.6rem]">
            Feedback that speaks to clarity, trust, and the quality of the work.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-[var(--muted)] md:text-lg">
            The best responses usually say less about speed and more about structure, communication, and how the final
            product feels to use.
          </p>
        </AnimatedReveal>

        <AnimatedReveal className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="space-y-4">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">
              What people mention
            </p>
            <h2 className="max-w-lg font-sans text-[2.2rem] font-bold uppercase leading-[0.94] tracking-[-0.05em] text-[var(--foreground)] md:text-[3rem]">
              <span className="home-title-shadow">Thoughtful execution, responsive collaboration, and products that feel easier to trust.</span>
            </h2>
          </div>

          <div className="grid gap-x-8 gap-y-2 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <AnimatedReveal key={testimonial._id} delay={index * 0.05}>
                <TestimonialCard testimonial={testimonial} />
              </AnimatedReveal>
            ))}
          </div>
        </AnimatedReveal>

        <AnimatedReveal className="grid gap-10 border-t border-[var(--border)] pt-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">
              Share your experience
            </p>
            <h2 className="max-w-lg font-sans text-[2.2rem] font-bold uppercase leading-[0.94] tracking-[-0.05em] text-[var(--foreground)] md:text-[3rem]">
              Worked with me before?
            </h2>
            <p className="max-w-xl text-sm leading-8 text-[var(--muted)] md:text-base">
              You can submit a testimonial here. It goes through the existing moderation flow before it appears
              publicly.
            </p>
          </div>

          <div>
            <TestimonialForm />
          </div>
        </AnimatedReveal>
      </Container>
    </Section>
  );
}

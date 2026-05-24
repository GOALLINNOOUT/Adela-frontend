import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminAccessGate } from "@/components/admin/admin-access-gate";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Admin",
  description: "Admin workspace for blog publishing, testimonial moderation, and contact review.",
  path: "/admin"
});

export default function AdminPage() {
  return (
    <AdminAccessGate>
      <Section className="pt-0">
        <Container className="space-y-8">
          <div className="border-b border-[var(--border)] py-10 md:py-14">
            <div className="flex flex-wrap items-end justify-between gap-8">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">Admin</p>
                <h1 className="mt-5 max-w-4xl font-sans text-[2.6rem] font-bold uppercase leading-[0.98] tracking-[-0.03em] text-[var(--foreground)] md:text-[4rem]">
                  Content operations
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)]">
                  Publish blog posts, moderate testimonials, and review contact messages from one focused workspace.
                </p>
              </div>
              <div className="hidden border-l border-[var(--border)] pl-6 text-sm leading-7 text-[var(--muted)] md:block">
                <p>Authenticated tools</p>
                <p>Live content data</p>
                <p>Moderation workflow</p>
              </div>
            </div>
          </div>
          <AdminDashboard />
        </Container>
      </Section>
    </AdminAccessGate>
  );
}

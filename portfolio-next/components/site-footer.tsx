import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { siteConfig } from "@/lib/site-config";

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M12 .5C5.649.5.5 5.653.5 12.01c0 5.084 3.292 9.377 7.86 10.9.575.106.785-.25.785-.556 0-.274-.01-1-.016-1.963-3.197.695-3.873-1.542-3.873-1.542-.523-1.33-1.278-1.685-1.278-1.685-1.044-.714.08-.699.08-.699 1.154.082 1.76 1.187 1.76 1.187 1.026 1.76 2.692 1.252 3.348.957.104-.744.402-1.252.731-1.54-2.552-.29-5.237-1.279-5.237-5.694 0-1.258.449-2.286 1.184-3.092-.119-.29-.513-1.458.112-3.04 0 0 .965-.31 3.162 1.181A10.96 10.96 0 0 1 12 6.04c.975.004 1.958.132 2.877.387 2.195-1.49 3.158-1.181 3.158-1.181.627 1.582.233 2.75.114 3.04.737.806 1.183 1.834 1.183 3.092 0 4.426-2.69 5.4-5.25 5.684.413.356.78 1.058.78 2.132 0 1.54-.014 2.78-.014 3.158 0 .308.207.667.79.554 4.564-1.525 7.85-5.816 7.85-10.898C23.5 5.653 18.351.5 12 .5Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M4.98 3.5A2.48 2.48 0 1 0 5 8.46 2.48 2.48 0 0 0 4.98 3.5ZM3 9.5h4v12H3v-12Zm7 0h3.83v1.64h.06c.53-1.01 1.84-2.08 3.79-2.08 4.05 0 4.8 2.66 4.8 6.12v6.32h-4v-5.6c0-1.34-.02-3.06-1.86-3.06-1.87 0-2.16 1.46-2.16 2.96v5.7h-4v-12Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M18.901 2H22l-6.77 7.737L23.2 22h-6.246l-4.89-7.177L5.78 22H2.68l7.24-8.278L.8 2h6.404l4.42 6.57L18.9 2Zm-1.086 18h1.718L6.273 3.895H4.43L17.815 20Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8">
      <path d="M4.75 6.75h14.5v10.5H4.75V6.75Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m5.25 7.25 6.75 5.5 6.75-5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.42.56.22.96.48 1.38.9.42.42.68.82.9 1.38.17.43.37 1.06.42 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.42 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.17-1.06.37-2.23.42-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.42a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.17-.43-.37-1.06-.42-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.42-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.17 1.06-.37 2.23-.42 1.27-.06 1.65-.07 4.85-.07Zm0-2.16C8.75 0 8.34.01 7.05.07 5.76.13 4.87.33 4.09.64a5.86 5.86 0 0 0-2.13 1.38A5.86 5.86 0 0 0 .58 4.15C.28 4.93.07 5.82.02 7.11-.04 8.4-.05 8.81-.05 12.06s.01 3.66.07 4.95c.06 1.29.26 2.18.57 2.96.32.81.75 1.49 1.38 2.13.64.63 1.32 1.06 2.13 1.38.78.3 1.67.51 2.96.57 1.29.06 1.7.07 4.95.07s3.66-.01 4.95-.07c1.29-.06 2.18-.26 2.96-.57a5.86 5.86 0 0 0 2.13-1.38 5.86 5.86 0 0 0 1.38-2.13c.3-.78.51-1.67.57-2.96.06-1.29.07-1.7.07-4.95s-.01-3.66-.07-4.95c-.06-1.29-.26-2.18-.57-2.96a5.86 5.86 0 0 0-1.38-2.13A5.86 5.86 0 0 0 19.9.64C19.12.34 18.23.13 16.94.07 15.65.01 15.24 0 12 0Zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84Zm0 10.16A4 4 0 1 1 12 8a4 4 0 0 1 0 8Zm6.41-10.4a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M22 12.06C22 6.49 17.52 2 12 2S2 6.49 2 12.06c0 5.03 3.66 9.2 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.77l-.44 2.91h-2.33V22C18.34 21.26 22 17.09 22 12.06Z" />
    </svg>
  );
}

function FooterTextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group w-fit bg-transparent text-sm text-[var(--muted)] transition-colors duration-300 hover:text-[var(--foreground)]"
      style={{ background: "transparent" }}
    >
      <span className="bg-transparent">{children}</span>
      <span className="mt-1 block h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" aria-hidden="true" />
    </Link>
  );
}

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const socialIcons: Record<string, ReactNode> = {
    GitHub: <GitHubIcon />,
    LinkedIn: <LinkedInIcon />,
    X: <XIcon />,
    Instagram: <InstagramIcon />,
    Facebook: <FacebookIcon />
  };
  const socialColors: Record<string, string> = {
    GitHub: "#181717",
    LinkedIn: "#0A66C2",
    X: "#000000",
    Instagram: "#E4405F",
    Facebook: "#1877F2"
  };
  const socialHoverBackgrounds: Record<string, string> = {
    GitHub: "#ffffff",
    LinkedIn: "transparent",
    X: "#ffffff",
    Instagram: "transparent",
    Facebook: "transparent"
  };
  const footerLinks = siteConfig.navItems.filter((item) => ["/", "/projects", "/blog", "/contact"].includes(item.href));

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="grid w-full gap-12 px-6 py-12 md:grid-cols-[1.3fr_1fr_1fr] md:px-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--foreground)]">
            {siteConfig.name}
          </p>
          <p className="max-w-sm text-sm leading-7 text-[var(--muted)]">
            Calm interfaces, durable systems, and product work shaped around clarity.
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-sm font-medium text-[var(--foreground)]">Explore</p>
          <div className="flex flex-col items-start gap-3 text-sm">
            {footerLinks.map((item) => (
              <FooterTextLink key={item.href} href={item.href}>
                {item.label}
              </FooterTextLink>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-sm font-medium text-[var(--foreground)]">Connect</p>
          <div className="flex flex-col gap-4 text-sm text-[var(--muted)]">
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={`mailto:${siteConfig.email}`}
                aria-label={`Email ${siteConfig.email}`}
                title={siteConfig.email}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--foreground)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--foreground)] hover:shadow-[0_10px_24px_rgba(17,17,17,0.08)]"
              >
                <MailIcon />
              </a>
              {siteConfig.socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  title={item.label}
                  style={
                    {
                      "--social-color": socialColors[item.label] || "var(--foreground)",
                      "--social-hover-bg": socialHoverBackgrounds[item.label] || "transparent"
                    } as CSSProperties
                  }
                  className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-white text-[var(--foreground)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--social-color)] hover:bg-[var(--social-hover-bg)] hover:shadow-[0_10px_24px_rgba(17,17,17,0.08)]"
                >
                  <span className="transition-colors duration-300 group-hover:text-[var(--social-color)]">
                    {socialIcons[item.label]}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--border)] px-6 py-5 text-xs text-[var(--muted)] md:px-8">
        <p>
          &copy; {currentYear} {siteConfig.fullName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

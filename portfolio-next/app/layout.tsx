import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import type { ReactNode } from "react";
import { AdminAccessProvider } from "@/components/admin-access-provider";
import { RouteScrollManager } from "@/components/route-scroll-manager";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import "@/styles/globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.seo.title,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.seo.description,
  keywords: siteConfig.seo.keywords,
  authors: [{ name: siteConfig.fullName }],
  alternates: {
    canonical: absoluteUrl("/")
  },
  openGraph: {
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    url: absoluteUrl("/"),
    siteName: siteConfig.name,
    images: [{ url: absoluteUrl("/images/image.png") }],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: [absoluteUrl("/images/image.png")]
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.fullName,
    alternateName: siteConfig.name,
    jobTitle: siteConfig.role,
    url: siteConfig.siteUrl,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      addressCountry: "Nigeria"
    },
    sameAs: siteConfig.socialLinks.map((item) => item.href)
  };

  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="font-sans text-[var(--foreground)] antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(()=>{try{const t=localStorage.getItem('adela-theme');const m=window.matchMedia('(prefers-color-scheme: dark)').matches;const theme=t==='dark'||t==='light'?t:m?'dark':'light';document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;}catch(e){}})();"
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <AdminAccessProvider>
          <div className="flex min-h-screen flex-col">
            <RouteScrollManager />
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </AdminAccessProvider>
      </body>
    </html>
  );
}

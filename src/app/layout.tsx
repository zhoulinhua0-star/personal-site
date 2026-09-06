import type { Metadata } from "next";
import { ClickRipple } from "@/components/click-ripple";
import { identity, site } from "@/data/personal";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${identity.name}`,
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: identity.name,
    title: site.title,
    description: site.description,
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: identity.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [site.ogImage],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={site.locale}>
      <head>
        <link
          rel="preload"
          href="/fonts/Geist-Variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
        <ClickRipple />
      </body>
    </html>
  );
}

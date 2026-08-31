import type { Metadata } from "next";
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

/**
 * Runs before first paint so the stored presentation mode is applied without a
 * flash and without hydration mismatch (the default in the markup is minimal).
 */
const modeScript = `(function(){try{if(localStorage.getItem("lz-mode")==="creative"){document.documentElement.dataset.mode="creative"}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* No `data-mode` is rendered on the server: Minimal is the CSS default, and
       the inline script below adds the attribute only when the visitor has
       chosen Creative. That keeps the markup and the DOM in agreement, so React
       has no mismatch to "fix" during hydration. */
    <html lang={site.locale} suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/Geist-Variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { CatCompanion } from "@/components/cat-companion";
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
    <html lang={site.locale} suppressHydrationWarning>
      <head>
        {/* Apply the saved palette before paint; no server or theme dependency. */}
        <script dangerouslySetInnerHTML={{ __html: `try{document.documentElement.dataset.theme=localStorage.getItem("site-theme")==="dark"?"dark":"light"}catch{document.documentElement.dataset.theme="light"}document.documentElement.dataset.themeReady="true";` }} />
        {/* Arm the hero sweep before the first paint, then start it on a frame
            the visitor can actually see. A CSS animation's clock starts at the
            first style resolution, which happens behind the browser's paint
            holding and before Geist has swapped in — so on a cold load the
            entrance is half over by the time anything reaches the screen, and
            what is left runs on fallback glyphs. Arming holds the opening frame
            (the hollow outline); the sweep begins once the font is in, the tab
            is visible, and a frame has been painted. Without JavaScript nothing
            is armed and the headline is simply the finished solid-ink name.

            The font wait has to be document.fonts.load, not document.fonts.ready:
            from the head, nothing has asked for Geist yet, so the set is already
            idle and `ready` resolves on the spot — which is how the sweep ended
            up running on fallback glyphs before the real face swapped in. */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var h=document.documentElement;try{if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;h.dataset.heroArm="true";var done=false,play=function(){if(done)return;done=true;h.dataset.heroPlay="true"},paint=function(){requestAnimationFrame(function(){requestAnimationFrame(play)})},visible=function(){if(document.visibilityState==="visible")return paint();document.addEventListener("visibilitychange",function v(){document.visibilityState==="visible"&&(document.removeEventListener("visibilitychange",v),paint())})},fonts=document.fonts&&document.fonts.load?document.fonts.load('600 1em "Geist"').then(function(){return document.fonts.ready}):Promise.resolve();Promise.race([fonts,new Promise(function(r){setTimeout(r,1200)})]).then(visible,visible);setTimeout(visible,2500)}catch(e){h.dataset.heroPlay="true"}})();` }} />
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
        {/* Pinned over every page rather than living inside the hero: it is a
            companion, and it remembers where you dragged it across routes. */}
        <CatCompanion />
      </body>
    </html>
  );
}

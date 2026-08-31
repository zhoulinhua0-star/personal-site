import { Hero } from "@/components/hero";
import { HubGrid } from "@/components/hub-grid";
import { Section } from "@/components/section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SocialRow } from "@/components/social-row";
import { identity, site } from "@/data/personal";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: identity.name,
  alternateName: identity.nameAlt || undefined,
  url: site.url,
  description: site.description,
  jobTitle: "Software Engineer",
};

export default function HomePage() {
  return (
    <>
      <SiteHeader current="/" />

      <main id="main">
        <Hero />

        <Section
          id="index"
          label="Index"
          labelZh="目录"
          title="Where to go from here."
          aside="Three parts to this site, plus a way to reach me. Pick one — everything is a click away, nothing needs scrolling for."
          className="pt-[clamp(52px,8vw,92px)]"
        >
          <HubGrid />

          {/* Contact lives here now — a quiet inline row, not a section of its own. */}
          <div
            id="contact"
            className="mt-[clamp(40px,6vw,68px)] border-t border-line pt-[clamp(24px,3.5vw,36px)]"
          >
            <SocialRow />
          </div>
        </Section>
      </main>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
    </>
  );
}

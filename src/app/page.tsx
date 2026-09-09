import { Hero } from "@/components/hero";
import { HubGrid } from "@/components/hub-grid";
import { Section } from "@/components/section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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
          label="Start Here"
          className="pt-[clamp(36px,5vw,64px)] pb-[clamp(72px,10vw,132px)]"
        >
          <HubGrid />
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

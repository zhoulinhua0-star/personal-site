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
          title="Where to go from here."
          aside="Three parts to this site. Everything is one click away — nothing needs scrolling for."
          className="pt-[clamp(52px,8vw,92px)] pb-[clamp(72px,10vw,132px)]"
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

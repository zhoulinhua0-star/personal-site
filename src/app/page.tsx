import { Hero } from "@/components/hero";
import { HubGrid } from "@/components/hub-grid";
import { Section } from "@/components/section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ContactBlock } from "@/components/contact-block";
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
          aside="Three parts to this site. Everything is one click away — nothing needs scrolling for."
          className="pt-[clamp(52px,8vw,92px)] pb-[clamp(48px,7vw,88px)]"
        >
          <HubGrid />
        </Section>

        <Section
          id="contact"
          label="Contact"
          labelZh="联系"
          title="Say hello."
          aside="Best for anything worth building — a role, a collaboration, or a question about something here."
          className="pt-0 pb-[clamp(72px,10vw,132px)]"
        >
          <ContactBlock />
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

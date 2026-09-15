import Link from "next/link";
import { Hero } from "@/components/hero";
import { HomeWork } from "@/components/home-work";
import { ExperimentList } from "@/components/experiment-list";
import { HubGrid } from "@/components/hub-grid";
import { Section } from "@/components/section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { about, identity, site } from "@/data/personal";

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
      <main id="main" className="editorial-home">
        <Hero />
        <Section id="selected-work" number="01" label="Selected work" title="Things I’ve built." aside={<Link className="editorial-link" href="/projects/">All projects <span aria-hidden="true">→</span></Link>}>
          <HomeWork />
        </Section>
        <Section id="small-things" number="02" label="Experiments & open source" title="Small things, shared." aside={<Link className="editorial-link" href="/experiments/">All experiments <span aria-hidden="true">→</span></Link>}>
          <ExperimentList limit={3} />
        </Section>
        <Section id="index" number="03" label="Approach" title="The work behind the work." aside={<Link className="editorial-link" href="/approach/">More about me <span aria-hidden="true">→</span></Link>}>
          <p className="approach-excerpt">{about.paragraphs[1]}</p>
          <div className="home-index"><HubGrid compact /></div>
        </Section>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
    </>
  );
}

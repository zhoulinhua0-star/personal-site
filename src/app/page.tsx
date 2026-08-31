import { AboutSection } from "@/components/about-section";
import { CategoryGrid } from "@/components/category-grid";
import { ContactSection } from "@/components/contact-section";
import { Hero } from "@/components/hero";
import { LabList } from "@/components/lab-list";
import { ProjectCard } from "@/components/project-card";
import { Section } from "@/components/section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { identity, site } from "@/data/personal";
import { projects } from "@/data/projects";

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
      <SiteHeader />

      <main id="main">
        <Hero />

        <Section
          id="categories"
          number="02"
          label="Index"
          title="What I spend my time building."
          aside="Five threads that keep showing up in my work — from agent systems and developer tooling to the smaller experiments that never make it past a weekend."
        >
          <CategoryGrid />
        </Section>

        <Section
          id="work"
          number="03"
          label="Selected work"
          title="Projects worth walking you through."
          aside="A short list on purpose. Each one has a problem behind it, a constraint that made it interesting, and a decision I would defend."
        >
          <div className="space-y-[clamp(64px,9vw,132px)]">
            {projects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
          </div>
        </Section>

        <Section
          id="lab"
          number="04"
          label="Lab"
          title="Open source and experiments."
          aside="Smaller things: libraries, prototypes, and studies that answered a question I had."
        >
          <LabList />
        </Section>

        <AboutSection />
        <ContactSection />
      </main>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
    </>
  );
}

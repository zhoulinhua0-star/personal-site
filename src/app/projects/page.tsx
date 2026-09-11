import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Subpage } from "@/components/subpage";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A short list of projects worth walking through — the problem behind each one, the constraint that made it interesting, and the decision worth defending.",
  alternates: { canonical: "/projects" },
};

export default function WorkPage() {
  return (
    <>
      <SiteHeader current="/projects" />
      <Subpage
        number="01"
        label="Projects"
        title="Worth walking you through."
        aside="A short list on purpose. Each one has a problem behind it, a constraint that made it interesting, and a decision I would defend."
      >
        <div className="space-y-[clamp(64px,9vw,132px)]">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </Subpage>
      <SiteFooter />
    </>
  );
}

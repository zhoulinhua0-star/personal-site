import { ScrollReveal } from "./scroll-reveal";
import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";
import { ProjectCard } from "./project-card";
import { ArrowUpRight } from "./icons";

export function HomeWork() {
  const [featured, ...more] = projects;
  return (
    <>
      {featured ? <ScrollReveal><ProjectCard project={featured} index={0} preview /></ScrollReveal> : null}
      <ScrollReveal stagger className="home-projects">
        {more.map((project) => (
          <article key={project.slug} className="project">
            <Link href={`/projects/#${project.slug}`} className="project-preview group">
              {project.images?.[0] ? (
                <div className="preview-image">
                  <Image src={project.images[0].src} alt={project.images[0].alt} width={1600} height={1000} sizes="(min-width: 768px) 440px, 90vw" />
                </div>
              ) : null}
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <h3 className="text-xl font-medium tracking-tight group-hover:text-accent">{project.title}</h3>
                <ArrowUpRight className="size-4 shrink-0 text-accent" />
              </div>
              <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-ink-2">{project.summary ?? project.description}</p>
              <p className="mono-xs mt-4 text-ink-3">{project.status} · {project.year}</p>
            </Link>
          </article>
        ))}
      </ScrollReveal>
    </>
  );
}

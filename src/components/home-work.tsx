import { ScrollReveal } from "./scroll-reveal";
import Image from "next/image";
import Link from "next/link";
import { categories, projects } from "@/data/projects";
import { ArrowUpRight, AwardIcon } from "./icons";

/**
 * Selected work as one vertical index: every project gets the same row, so the
 * list can keep growing without the layout changing shape. The title link is
 * stretched over the whole row (screenshot included), and the outbound buttons
 * sit above that overlay, so there is one link into the case study per row and
 * no nested anchors.
 */
export function HomeWork() {
  const list = projects.filter((project) => project.home);

  return (
    <ol className="work-list">
      {list.map((project, index) => {
        const shot = project.images?.[0];
        const category = categories.find((c) => c.slug === project.category)?.name;
        const outbound = [
          { label: "Visit site", href: project.liveUrl },
          { label: "Demo video", href: project.demoUrl },
          { label: "Source", href: project.githubUrl },
        ].filter((link): link is { label: string; href: string } => Boolean(link.href));

        return (
          <li key={project.slug}>
            <ScrollReveal as="article" className={`work-row${project.award ? " work-row-award" : ""}`}>
              {shot ? (
                <div className="work-shot">
                  <Image src={shot.src} alt={shot.alt} width={1600} height={1000} sizes="(min-width: 768px) 46vw, 92vw" />
                </div>
              ) : null}

              <div className="work-body">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span className="label label-accent">{String(index + 1).padStart(2, "0")}</span>
                  {category ? <span className="label">{category}</span> : null}
                  <span className="label ml-auto">{project.year}</span>
                </div>

                {project.award ? (
                  <p className="award-badge">
                    <AwardIcon className="size-3.5 shrink-0" />
                    {project.award}
                  </p>
                ) : null}

                <h3 className="work-title">
                  <Link href={`/projects/#${project.slug}`} className="work-link">
                    {project.title}
                    <ArrowUpRight className="work-arrow" />
                  </Link>
                </h3>

                <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-ink-2">{project.summary ?? project.description}</p>

                <div className="work-actions">
                  {outbound.map((link) => (
                    <a key={link.label} className="work-btn" href={link.href} target="_blank" rel="noreferrer noopener">
                      <span>{link.label}</span>
                      <ArrowUpRight className="work-btn-arrow" />
                      <span className="sr-only">— {project.title} (opens in a new tab)</span>
                    </a>
                  ))}
                  {project.status ? <span className="mono-xs text-ink-3">{project.status}</span> : null}
                </div>
              </div>
            </ScrollReveal>
          </li>
        );
      })}
    </ol>
  );
}

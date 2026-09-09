import Image from "next/image";
import type { Project } from "@/data/projects";
import { categories } from "@/data/projects";
import { ArrowUpRight } from "./icons";

function categoryName(slug: Project["category"]) {
  return categories.find((category) => category.slug === slug)?.name ?? slug;
}

/**
 * A flagship project. Text and screenshot stack swap sides on alternating rows
 * so the section reads as a composition rather than a list of cards.
 */
export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const flipped = index % 2 === 1;
  const number = String(index + 1).padStart(2, "0");
  const shots = project.images?.slice(0, 3) ?? [];

  return (
    <article
      /* The first row sits directly under the section rule, so it needs no rule of its own. */
      className={`project reveal ${index > 0 ? "border-t border-line pt-[clamp(28px,4vw,48px)]" : ""}`}
    >
      {/* Explicit fractions rather than a 12-column grid: at this column width a
          12-track grid is mostly gutter, and the screenshot needs the room.
          A project with no screenshots takes a single column instead: splitting
          the row would squeeze the prose into 0.8fr and leave the other 1.2fr
          visibly empty, which reads as a failed image rather than a deliberate
          text entry. */}
      <div
        className={`grid items-start gap-[clamp(28px,3.5vw,56px)] lg:items-center ${
          !shots.length
            ? ""
            : flipped
              ? "lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]"
              : "lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"
        }`}
      >
        {/* — Text — */}
        <div
          className={flipped && shots.length ? "lg:col-start-2 lg:row-start-1" : ""}
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="label label-accent">{number}</span>
            <span className="label">{categoryName(project.category)}</span>
            <span className="label ml-auto">{project.year}</span>
          </div>

          <h3 className="mt-5 text-[clamp(1.55rem,2.5vw,2.1rem)] leading-[1.08] font-medium tracking-[-0.032em]">
            {project.title}
          </h3>

          <p className={`lead mt-4 ${shots.length ? "max-w-[46ch]" : "max-w-[68ch]"}`}>
            {project.description}
          </p>

          {project.metrics?.length ? (
            <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4">
              {project.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt className="label">{metric.label}</dt>
                  <dd className="mt-1 text-[1.35rem] font-medium tracking-[-0.03em]">
                    {metric.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          {project.tech?.length ? (
            <ul className="mt-7 flex flex-wrap gap-1.5">
              {project.tech.map((tech) => (
                <li key={tech} className="chip">
                  {tech}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            {project.liveUrl ? (
              <a
                className="group inline-flex items-center gap-2 text-[14px] font-medium text-accent"
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                <span className="link-underline">Visit site</span>
                <ArrowUpRight className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                <span className="sr-only">— {project.title}</span>
              </a>
            ) : null}
            {project.githubUrl ? (
              <a
                className="group inline-flex items-center gap-2 text-[14px] text-ink-2 hover:text-ink"
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                <span className="link-underline">Source</span>
                <ArrowUpRight className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                <span className="sr-only">— {project.title}</span>
              </a>
            ) : null}
            {project.status ? <span className="chip chip-accent">{project.status}</span> : null}
            {project.placeholder ? <span className="chip chip-ghost">Placeholder</span> : null}
          </div>
        </div>

        {/* — Screenshot stack — */}
        {shots.length ? (
          <div className={flipped ? "lg:col-start-1 lg:row-start-1" : ""}>
            <div className="shot-stack">
              <span className="shot-plate" aria-hidden="true" />
              {/* Rendered back-to-front so the first image sits on top. */}
              {shots
                .map((shot, order) => ({ shot, order }))
                .reverse()
                .map(({ shot, order }) => (
                  <div key={shot.src} className={`shot shot-${order + 1}`} style={{ zIndex: shots.length - order }}>
                    <Image
                      src={shot.src}
                      alt={order === 0 ? shot.alt : ""}
                      aria-hidden={order === 0 ? undefined : true}
                      width={1600}
                      height={1000}
                      sizes="(min-width: 1024px) 50vw, 92vw"
                    />
                  </div>
                ))}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}

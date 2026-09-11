import { categories, experiments } from "@/data/projects";
import { ArrowUpRight } from "./icons";

/**
 * Smaller work. Deliberately a list, not cards — it must never compete with
 * the flagship projects above it.
 */
export function ExperimentList() {
  return (
    <ul className="reveal">
      {experiments.map((entry, index) => {
        const category = categories.find((item) => item.slug === entry.category);
        const href = entry.liveUrl ?? entry.githubUrl;
        return (
          <li key={entry.title} className="experiment-row">
            <span className="label pt-1">{String(index + 1).padStart(2, "0")}</span>

            <div className="flex flex-wrap items-baseline gap-x-3">
              <h3 className="text-[1.0625rem] font-medium tracking-[-0.02em]">
                {href ? (
                  <a href={href} target="_blank" rel="noreferrer noopener" className="group inline-flex items-center gap-1.5">
                    <span className="link-underline">{entry.title}</span>
                    <ArrowUpRight className="size-3.5 text-ink-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                  </a>
                ) : (
                  entry.title
                )}
              </h3>
              {entry.placeholder ? <span className="chip chip-ghost">Placeholder</span> : null}
            </div>

            <p className="max-w-[52ch] text-[14px] leading-[1.55] text-ink-2">
              {entry.description}
              {entry.tech?.length ? (
                <span className="mono-xs ml-2 text-ink-4">{entry.tech.join(" · ")}</span>
              ) : null}
            </p>

            <p className="label whitespace-nowrap md:text-right">
              {category?.name} <span className="text-ink-4">·</span> {entry.year}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

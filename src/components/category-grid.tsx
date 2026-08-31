import { categories, lab, projects, type CategorySlug } from "@/data/projects";
import { ArrowUpRight } from "./icons";

/**
 * One small technical mark per category. Hand-drawn geometry, not clip-art —
 * it gives each card an identity without needing an image.
 */
const glyphs: Record<CategorySlug, React.ReactNode> = {
  "ai-products": (
    <>
      <circle cx="24" cy="24" r="6" />
      <circle cx="24" cy="24" r="15" strokeDasharray="3 5" />
      <path d="M24 3v6M24 39v6M3 24h6M39 24h6" />
    </>
  ),
  web: (
    <>
      <rect x="4" y="8" width="40" height="32" rx="3" />
      <path d="M4 17h40M11 12.5h3M17 12.5h3" />
    </>
  ),
  "developer-tools": (
    <>
      <path d="M13 17 6 24l7 7M35 17l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 12 20 36" strokeLinecap="round" />
    </>
  ),
  experiments: (
    <>
      <path d="M8 38c6-2 8-14 16-14s10 12 16 10" />
      <circle cx="24" cy="24" r="2.4" fill="currentColor" stroke="none" />
      <path d="M6 24h36" strokeDasharray="2 6" />
    </>
  ),
  "open-source": (
    <>
      <circle cx="13" cy="12" r="4" />
      <circle cx="13" cy="36" r="4" />
      <circle cx="35" cy="24" r="4" />
      <path d="M13 16v16M17 12h9a5 5 0 0 1 5 5v3M17 36h9a5 5 0 0 0 5-5v-3" />
    </>
  ),
};

function countFor(slug: CategorySlug) {
  return (
    projects.filter((project) => project.category === slug).length +
    lab.filter((entry) => entry.category === slug).length
  );
}

export function CategoryGrid() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
      {categories.map((category, index) => {
        const count = countFor(category.slug);
        return (
          <li
            key={category.slug}
            /* Three cards, then two wider ones — an asymmetric rhythm, not a dashboard grid. */
            className={`reveal ${index < 3 ? "lg:col-span-2" : "lg:col-span-3"}`}
          >
            <a href="#work" className="cat-card group h-full">
              <div className="flex items-start justify-between gap-6">
                <span className="label label-accent">{String(index + 1).padStart(2, "0")}</span>
                <svg
                  viewBox="0 0 48 48"
                  className="size-10 shrink-0 text-accent/30 transition-colors duration-500 group-hover:text-accent/60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  {glyphs[category.slug]}
                </svg>
              </div>

              <div>
                <h3 className="subheading">{category.name}</h3>
                <p className="mt-2 max-w-[34ch] text-[14px] leading-[1.55] text-ink-2">
                  {category.blurb}
                </p>
                <p className="mono-xs mt-5 flex items-center gap-2 text-ink-3">
                  {count} {count === 1 ? "entry" : "entries"}
                  <ArrowUpRight className="size-3.5" />
                </p>
              </div>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

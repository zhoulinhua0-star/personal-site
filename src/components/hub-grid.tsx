import Link from "next/link";
import type { ReactNode } from "react";
import { lab, projects } from "@/data/projects";

/**
 * The home page hub. Three restrained destination cards, so the landing screen
 * stays short and everything is one click away. Deliberately editorial: mono
 * index, hand-drawn glyph, one hairline accent on hover. No screenshot stacks,
 * no dashboard grid. (A way to reach me sits in the quiet row below the grid.)
 */

type Entry = {
  href: string;
  index: string;
  title: string;
  blurb: string;
  meta: string;
  glyph: ReactNode;
};

const glyphs = {
  work: (
    <>
      <rect x="5" y="9" width="27" height="19" rx="2" />
      <rect x="16" y="20" width="27" height="19" rx="2" />
    </>
  ),
  lab: (
    <>
      <path d="M19 6h10M21 6v13L10 37a3 3 0 0 0 2.7 4.6h22.6A3 3 0 0 0 38 37L27 19V6" strokeLinejoin="round" />
      <path d="M15.5 31h17" />
    </>
  ),
  about: (
    <>
      <path d="M24 13c-4-3-10-3-15-2v25c5-1 11-1 15 2 4-3 10-3 15-2V11c-5-1-11-1-15 2Z" strokeLinejoin="round" />
      <path d="M24 13v25" />
    </>
  ),
};

const entries: Entry[] = [
  {
    href: "/work",
    index: "01",
    title: "Selected work",
    blurb:
      "Projects worth walking through: a problem behind each one, a constraint that made it interesting, and a decision I would defend.",
    meta: `${projects.length} ${projects.length === 1 ? "project" : "projects"}`,
    glyph: glyphs.work,
  },
  {
    href: "/lab",
    index: "02",
    title: "Lab",
    blurb:
      "Smaller things — libraries, prototypes, and studies that each answered a question I had.",
    meta: `${lab.length} ${lab.length === 1 ? "experiment" : "experiments"}`,
    glyph: glyphs.lab,
  },
  {
    href: "/about",
    index: "03",
    title: "About",
    blurb:
      "How I work, what I focus on, and the stack I reach for when an idea needs to become something you can open.",
    meta: "Bio · facts",
    glyph: glyphs.about,
  },
];

function CardBody({ entry }: { entry: Entry }) {
  return (
    <>
      <span className="ghost-num ghost-num-card" aria-hidden="true">
        {entry.index}
      </span>

      <div className="relative z-[1] flex items-start justify-between gap-6">
        <span className="label label-accent">{entry.index}</span>
        <svg
          viewBox="0 0 48 48"
          className="size-10 shrink-0 text-ink-4 transition-colors duration-500 group-hover:text-ink-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          {entry.glyph}
        </svg>
      </div>

      <div className="relative z-[1]">
        <h3 className="subheading">{entry.title}</h3>
        <p className="mt-2 max-w-[38ch] text-[14px] leading-[1.55] text-ink-2">{entry.blurb}</p>
        <p className="mono-xs mt-5 flex items-center gap-2 text-ink-3">
          {entry.meta}
          <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-0.5">&rarr;</span>
        </p>
      </div>
    </>
  );
}

export function HubGrid() {
  /**
   * Two columns divided into an odd number of cards leaves a hole in the last
   * row, which in a grid this strict reads as missing content rather than as
   * breathing room. The final card widens to close it. An even count (a fourth
   * destination one day) lays out 2x2 on its own — nothing here needs editing.
   */
  const lastFillsRow = entries.length % 2 === 1;

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {entries.map((entry, index) => (
        <li
          key={entry.href}
          className={`reveal${
            lastFillsRow && index === entries.length - 1 ? " sm:col-span-2" : ""
          }`}
        >
          <Link href={entry.href} className="cat-card group h-full">
            <CardBody entry={entry} />
          </Link>
        </li>
      ))}
    </ul>
  );
}

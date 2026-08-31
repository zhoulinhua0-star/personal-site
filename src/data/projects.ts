/**
 * ============================================================================
 *  PROJECTS — the only file you edit to change the work shown on the site.
 * ============================================================================
 *
 *  HOW TO ADD A PROJECT
 *  1. Copy an existing object in `projects` and change the fields.
 *  2. Put its screenshots in  public/projects/<slug>/  (main.png, plus any
 *     extras). Reference them as "/projects/<slug>/main.png".
 *  3. Delete `placeholder: true` so the PLACEHOLDER chip disappears.
 *
 *  HOW TO REPLACE A SCREENSHOT
 *  Overwrite the file at the same path. No code change needed.
 *  Landscape images around 1600x1000 look best.
 *
 *  Every field except `title`, `description`, `category` and `year` is optional
 *  — omit what you do not have and the layout adapts.
 * ----------------------------------------------------------------------------
 */

export type CategorySlug =
  | "ai-products"
  | "web"
  | "developer-tools"
  | "experiments"
  | "open-source";

export type ProjectImage = {
  /** Path under /public, e.g. "/projects/my-app/main.png". */
  src: string;
  /** Describe what the screenshot shows. Required for accessibility. */
  alt: string;
};

export type Project = {
  slug: string;
  title: string;
  /** One or two sentences. What it is, and why it was worth building. */
  description: string;
  category: CategorySlug;
  year: string;
  /** Ordered stack — the first image sits in front. Two or three works best. */
  images?: ProjectImage[];
  tech?: string[];
  githubUrl?: string;
  liveUrl?: string;
  /** Short factual signals, e.g. { label: "Users", value: "1.2k" }. */
  metrics?: { label: string; value: string }[];
  /** Small chip: "Live", "In progress", "Archived", … */
  status?: string;
  /** Shows a PLACEHOLDER chip. Delete this line once the entry is real. */
  placeholder?: true;
};

export type LabEntry = {
  title: string;
  description: string;
  year: string;
  category: CategorySlug;
  tech?: string[];
  githubUrl?: string;
  liveUrl?: string;
  placeholder?: true;
};

/** Section 02. `blurb` is the one-line explanation shown on the card. */
export const categories: {
  slug: CategorySlug;
  name: string;
  blurb: string;
}[] = [
  {
    slug: "ai-products",
    name: "AI & Products",
    blurb: "Agents, models and the products wrapped around them.",
  },
  {
    slug: "web",
    name: "Web Projects",
    blurb: "Interfaces built to be fast, legible and durable.",
  },
  {
    slug: "developer-tools",
    name: "Developer Tools",
    blurb: "Things that shorten the loop between idea and running code.",
  },
  {
    slug: "experiments",
    name: "Experiments",
    blurb: "Small studies, prototypes and deliberate dead ends.",
  },
  {
    slug: "open-source",
    name: "Open Source",
    blurb: "Public code, contributions and things worth sharing.",
  },
];

/** Section 03 — flagship work. Three to five entries is the sweet spot. */
export const projects: Project[] = [
  {
    slug: "flagship",
    title: "Your flagship project",
    description:
      "Replace this with the problem you solved, the constraint that made it hard, and the decision you are most proud of. Two sentences beat two paragraphs.",
    category: "ai-products",
    year: "2026",
    status: "In progress",
    tech: ["TypeScript", "Next.js", "Python", "LLM APIs"],
    // Add real, verifiable numbers here — they render as a small stat row:
    // metrics: [{ label: "Users", value: "1.2k" }, { label: "Stars", value: "340" }],
    images: [
      { src: "/projects/flagship/main.png", alt: "Placeholder screenshot of the flagship project" },
      { src: "/projects/flagship/secondary.png", alt: "Placeholder secondary view of the flagship project" },
      { src: "/projects/flagship/tertiary.png", alt: "Placeholder detail view of the flagship project" },
    ],
    githubUrl: "https://github.com/zhoulinhua0-star",
    placeholder: true,
  },
  {
    slug: "developer-tool",
    title: "Your developer tool",
    description:
      "A tool you built because the existing workflow annoyed you. Say what it removes from someone's day, not which framework it uses.",
    category: "developer-tools",
    year: "2025",
    status: "Live",
    tech: ["TypeScript", "Node", "CLI"],
    images: [
      { src: "/projects/developer-tool/main.png", alt: "Placeholder screenshot of the developer tool" },
      { src: "/projects/developer-tool/secondary.png", alt: "Placeholder secondary view of the developer tool" },
    ],
    githubUrl: "https://github.com/zhoulinhua0-star",
    placeholder: true,
  },
  {
    slug: "web-app",
    title: "Your web project",
    description:
      "Something you designed as well as built. Describe the interface decision that made it work, and what you would change now.",
    category: "web",
    year: "2025",
    tech: ["React", "Next.js", "Postgres"],
    images: [
      { src: "/projects/web-app/main.png", alt: "Placeholder screenshot of the web project" },
      { src: "/projects/web-app/secondary.png", alt: "Placeholder secondary view of the web project" },
    ],
    githubUrl: "https://github.com/zhoulinhua0-star",
    placeholder: true,
  },
];

/** Section 04 — smaller work. Deliberately lighter weight than `projects`. */
export const lab: LabEntry[] = [
  {
    title: "A small open-source library",
    description: "One line about what it does and who it is for.",
    year: "2026",
    category: "open-source",
    tech: ["TypeScript"],
    githubUrl: "https://github.com/zhoulinhua0-star",
    placeholder: true,
  },
  {
    title: "An agent experiment",
    description: "A prototype that answered a question you had about tool use.",
    year: "2025",
    category: "experiments",
    tech: ["Python"],
    placeholder: true,
  },
  {
    title: "A weekend build",
    description: "Built in two days, still running, still useful.",
    year: "2025",
    category: "web",
    tech: ["React"],
    placeholder: true,
  },
  {
    title: "A contribution you are proud of",
    description: "A patch, an issue triaged, a doc rewritten so nobody else got stuck.",
    year: "2024",
    category: "open-source",
    placeholder: true,
  },
];

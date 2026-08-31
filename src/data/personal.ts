/**
 * ============================================================================
 *  PERSONAL DATA — edit this file to change who the site is about.
 * ============================================================================
 *
 *  Everything here is plain text. You never need to open a component to change
 *  a name, a headline, a paragraph, or a link.
 *
 *  Lines marked  // TODO(linhua)  contain placeholder text that should be
 *  replaced with real information before the site goes public.
 * ----------------------------------------------------------------------------
 */

export const site = {
  /** Canonical production origin. Used for metadata, sitemap and JSON-LD. */
  url: "https://linhuazhou.com",
  /** Browser tab / search result title. */
  title: "Linhua Zhou — Developer & Builder",
  /** Search result + social share description. Keep it under ~160 characters. */
  description:
    "Linhua Zhou builds software, AI tools, developer tooling, and things worth being curious about.",
  /** Shown on the social share card (public/og-image.png). */
  ogImage: "/og-image.png",
  locale: "en",
} as const;

export const identity = {
  name: "Linhua Zhou",
  /** Secondary script shown beneath the wordmark. Set to "" to hide it. */
  nameAlt: "周琳桦",
  /** Two-letter monogram in the header. */
  monogram: "LZ",
  /** Small label above the name in the hero. */
  role: "Developer · Builder",
  /** Right-hand marker in the hero. */
  year: "2026",
} as const;

export const hero = {
  /**
   * The headline. Each array entry is rendered as its own line, so you control
   * exactly where the statement breaks on large screens.
   */
  statement: ["I build software,", "AI tools, and things", "I find interesting."],
  /** One or two short paragraphs under the headline. Keep the hero uncrowded. */
  intro:
    "Software engineering, AI and agent systems, developer tools, and product engineering. I like the part where an idea becomes something you can actually open and use.",
  /** Small technical marker rendered next to the hero's system readout. */
  status: "Open to interesting work",
} as const;

/**
 * Primary links. `kind` decides which icon is drawn (see src/components/icons.tsx).
 * Supported kinds: "github" | "linkedin" | "resume" | "email".
 * Remove an entry to remove it everywhere it appears.
 */
export const links = [
  {
    kind: "github",
    label: "GitHub",
    href: "https://github.com/zhoulinhua0-star",
    handle: "@zhoulinhua0-star",
  },
  {
    // TODO(linhua): replace with your real LinkedIn URL.
    kind: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/",
    handle: "in/your-handle",
  },
  {
    // TODO(linhua): drop a PDF at public/resume.pdf, or point this elsewhere.
    kind: "resume",
    label: "Résumé",
    href: "/resume.pdf",
    handle: "PDF",
  },
  {
    kind: "email",
    label: "Email",
    // Subject is prefilled so replies land pre-labelled. `handle` stays the bare
    // address for display.
    href: "mailto:zhoulinhua0@gmail.com?subject=Hello%20from%20linhuazhou.com",
    handle: "zhoulinhua0@gmail.com",
  },
] as const;

/**
 * The "About" section. Each string is one paragraph.
 * Write like a person, not like a résumé.
 */
export const about = {
  paragraphs: [
    "I'm a developer who likes building the tools other developers end up using. Most of my time goes to software engineering, AI and agent systems, and the interface layer where those two meet.",
    "I care about the unglamorous parts: clear data models, fast feedback loops, interfaces that explain themselves. A project feels finished to me when the seams are gone.",
    "Outside of shipping, I read source code for fun, take apart products I admire, and keep a long list of ideas I have not built yet.",
  ],
  /**
   * The technical spec sheet beside the prose. Add, remove or reorder freely.
   */
  facts: [
    { label: "Focus", value: "AI agents · developer tools · product engineering" },
    { label: "Writes", value: "TypeScript · Python · SQL" },
    { label: "Builds with", value: "React · Next.js · Node · Postgres" },
    // TODO(linhua): replace the two placeholders below with real details.
    { label: "Based in", value: "Add your city" },
    { label: "Currently", value: "Add what you are working on" },
  ],
} as const;

export const footer = {
  note: "Designed and built from scratch. Next.js, static export, GitHub Pages.",
} as const;

export type LinkKind = (typeof links)[number]["kind"];

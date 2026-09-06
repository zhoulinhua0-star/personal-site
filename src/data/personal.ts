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
  /**
   * Secondary script shown beneath the wordmark, and the JSON-LD
   * `alternateName`. Empty means the site is English-only: the hero, the footer
   * and the structured data each drop it on their own, so this is the single
   * switch. Set it back to "周琳桦" to restore all three.
   */
  nameAlt: "",
  /** Small label above the name in the hero. */
  role: "Developer · Builder",
  /** Right-hand marker in the hero. */
  year: "2026",
} as const;

/**
 * ============================================================================
 *  WHERE I AM — drives the live clock in the header.
 * ============================================================================
 *
 *  Nothing here detects anything. When you physically move, you change
 *  `currentPlace` below by hand and push; the deploy does the rest.
 *
 *  `zone` is the IANA identifier and does the arithmetic — including daylight
 *  saving, which it handles on its own, so the clock shifts correctly in March
 *  and November without you touching it. `label` is only what a reader sees,
 *  which is why D.C. can say "Washington, D.C." while running on the zone whose
 *  identifier happens to be named after New York.
 *
 *  To add a city: one entry here, then point `currentPlace` at its key.
 *  Zone identifiers: en.wikipedia.org/wiki/List_of_tz_database_time_zones
 * ----------------------------------------------------------------------------
 */
export const places = {
  dc: { zone: "America/New_York", label: "Washington, D.C." },
  nyc: { zone: "America/New_York", label: "New York" },
  boston: { zone: "America/New_York", label: "Boston" },
  sf: { zone: "America/Los_Angeles", label: "San Francisco" },
  london: { zone: "Europe/London", label: "London" },
  beijing: { zone: "Asia/Shanghai", label: "Beijing" },
  shanghai: { zone: "Asia/Shanghai", label: "Shanghai" },
} as const;

export type PlaceKey = keyof typeof places;

/**
 * THE ONE LINE YOU CHANGE WHEN YOU MOVE.
 * A key that is not in `places` fails `npm run typecheck`, which CI runs before
 * it deploys — so a misspelling never reaches the site.
 */
export const currentPlace: PlaceKey = "dc";

export const place = places[currentPlace];

/**
 * A zone identifier inside the table is still free text, and an invalid one
 * throws only when Intl is asked to use it — which would be in visitors'
 * browsers, long after a green build. Checking here moves that failure into
 * prerender, where CI sees it.
 */
for (const [key, entry] of Object.entries(places)) {
  try {
    new Intl.DateTimeFormat("en", { timeZone: entry.zone });
  } catch {
    throw new Error(
      `places.${key}: "${entry.zone}" is not a valid IANA time zone identifier.`,
    );
  }
}

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

/** Decides which icon is drawn — see src/components/icons.tsx. */
export type LinkKind = "github" | "linkedin" | "x" | "resume" | "email";

export type SiteLink = {
  kind: LinkKind;
  /** Name of the destination. */
  label: string;
  href: string;
  /**
   * The address itself. The footer prints the email's; the others keep theirs
   * as a plain record in this file of where the link actually points.
   */
  handle: string;
};

/**
 * Primary links, rendered once: the named strip under the hero. The site has no
 * spelled-out contact section — this strip and the footer's email address are
 * the whole of it.
 *
 * Order here is the order of the cells, left to right, and the leftmost is the
 * one read first. Remove an entry and its cell leaves the strip.
 */
export const links: readonly SiteLink[] = [
  {
    kind: "email",
    label: "Email",
    // Gmail's compose URL rather than `mailto:` — it opens a New Message window
    // in the tab, which is a working compose box for anyone already signed into
    // Google, instead of handing off to whatever desktop client the machine
    // happens to have registered (often none, in which case mailto: does
    // nothing visible at all).
    //
    //   view=cm  open the composer   fs=1  as its own window
    //   to/su    prefilled recipient and subject
    //
    // `handle` stays the bare address, which is what the footer prints and what
    // someone copies if they would rather use their own client.
    href:
      "https://mail.google.com/mail/?view=cm&fs=1" +
      "&to=zhoulinhua0@gmail.com&su=Reaching%20out%20%E2%80%94%20%5Bwhat%20this%20is%20about%5D",
    handle: "zhoulinhua0@gmail.com",
  },
  {
    kind: "github",
    label: "GitHub",
    href: "https://github.com/zhoulinhua0-star",
    handle: "@zhoulinhua0-star",
  },
  {
    kind: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/linhua-zhou-31948b42b/",
    handle: "in/linhua-zhou-31948b42b",
  },
  {
    // TODO(linhua): drop a PDF at public/resume.pdf, or point this elsewhere.
    kind: "resume",
    label: "Résumé",
    href: "/resume.pdf",
    handle: "PDF",
  },
  {
    kind: "x",
    label: "X",
    href: "https://x.com/LinhuaZhouappx",
    handle: "@LinhuaZhouappx",
  },
];

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

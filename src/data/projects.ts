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
  | "mobile"
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
    slug: "mobile",
    name: "Mobile Apps",
    blurb: "Native apps, shipped to a store and lived with afterwards.",
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
    slug: "asterlo",
    title: "Asterlo",
    description:
      "An AI-assisted outreach platform that runs the whole email workflow — researching a contact from official sources, drafting a personalized message, then holding it at a human approval gate before anything sends. The hard part was building automation that can be stopped: approval gates, campaign holds and idempotent controls so a sequence never double-sends, and never keeps going after someone has replied.",
    category: "ai-products",
    year: "2026",
    status: "In production",
    tech: ["TypeScript", "Next.js", "React", "PostgreSQL", "Gmail API"],
    images: [
      {
        src: "/projects/asterlo/main.png",
        alt: "Asterlo's landing page: 'Personalized outreach, with the receipts.', above buttons to open the workspace",
      },
      {
        src: "/projects/asterlo/secondary.png",
        alt: "Asterlo's three-step product section: official research, guarded drafting, and human review before a draft is approved",
      },
    ],
    liveUrl: "https://asterlo.io",
    // No `githubUrl`: the repository is private, so the live product is the
    // only honest link. The card drops the Source line on its own.
  },
  {
    slug: "repday",
    title: "RepDay — Gym Workout Planner",
    description:
      "A native iOS workout planner, written in Swift and shipped to the U.S. App Store. Planned and improvised sessions share one model, so strength sets and duration-based cardio live in the same workout with independent concurrent rest timers, mid-session editing and undo. Everything stays on the device — no account, no analytics, no third-party SDKs.",
    category: "mobile",
    year: "2026",
    status: "On the App Store",
    tech: ["Swift", "SwiftUI", "SwiftData", "WidgetKit", "EventKit"],
    metrics: [
      { label: "Code", value: "~15,000 lines" },
      { label: "Source files", value: "59" },
      { label: "Localized", value: "English · Chinese" },
    ],
    images: [
      {
        src: "/projects/repday/main.png",
        alt: "Three RepDay screens: the day's workout with set progress, the analytics view, and the weekly workout plan",
      },
      {
        src: "/projects/repday/secondary.png",
        alt: "Two more RepDay screens: freestyle training by muscle group, and the personal stats and level view",
      },
    ],
    liveUrl: "https://apps.apple.com/us/app/repday-gym-workout-planner/id6791500746",
    githubUrl: "https://github.com/zhoulinhua0-star/fitness-app",
  },
  {
    slug: "campus-decoder",
    title: "Campus Decoder",
    description:
      "An AI coach that helps international students read the unwritten rules of a U.S. university — office hours, emailing a professor, a group project going sideways. You describe the situation in your own words and get back the norm you were missing plus a next step you can actually send. Built solo from concept to deployment for GatewayHacks 2026.",
    category: "ai-products",
    year: "2026",
    status: "Live",
    tech: ["TypeScript", "Next.js", "LLM API", "REST APIs"],
    images: [
      {
        src: "/projects/campus-decoder/main.png",
        alt: "Campus Decoder's landing page: 'Decode the rules no one teaches', beside the four-step understand, practice, feedback, act path",
      },
      {
        src: "/projects/campus-decoder/secondary.png",
        alt: "Campus Decoder's scenario picker: office hours, emailing a professor, and group project conflict",
      },
    ],
    liveUrl: "https://campusdecoder.com",
    githubUrl: "https://github.com/zhoulinhua0-star/campus-decoder",
  },
];

/** Section 04 — smaller work. Deliberately lighter weight than `projects`. */
export const lab: LabEntry[] = [
  {
    title: "scroll-reveal-motion",
    description:
      "An Agent Skill for reveal-on-scroll motion that stays restrained and accessible — it honours prefers-reduced-motion instead of treating it as an afterthought. The reveals on this site are the same approach.",
    year: "2026",
    category: "developer-tools",
    tech: ["JavaScript", "CSS"],
    githubUrl: "https://github.com/zhoulinhua0-star/scroll-reveal-motion",
  },
  {
    title: "git-you-need-to-know",
    description:
      "A short, practical Git handbook, written in Chinese for readers who find the English docs heavy going. It explains what actually moves when you run a command before it explains the commands — the model is the part that makes Git stop being frightening.",
    year: "2026",
    category: "open-source",
    tech: ["Markdown"],
    githubUrl: "https://github.com/zhoulinhua0-star/git-you-need-to-know",
  },
  {
    title: "weather-cli",
    description:
      "A terminal weather dashboard on the OpenWeatherMap API, rendered with rich. Small enough to finish, which made it a good place to work out what a CLI should feel like to use.",
    year: "2026",
    category: "developer-tools",
    tech: ["Python"],
    githubUrl: "https://github.com/zhoulinhua0-star/weather-cli",
  },
  {
    title: "TypeRacerGame",
    description:
      "A browser typing game with several difficulty levels, real-time feedback as you type, and interface preferences that survive a reload.",
    year: "2026",
    category: "web",
    tech: ["JavaScript", "HTML/CSS"],
    liveUrl: "http://precisiontyper.com",
    githubUrl: "https://github.com/zhoulinhua0-star/TypeRacerGame",
  },
];

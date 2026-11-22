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
  /** Short editorial introduction; the full description remains on Projects. */
  summary?: string;
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
  /** The hackathon or event it was built for, e.g. "HackNC 2026". Shown in
   *  place of the year in the card's label row, so include the year. */
  event?: string;
  /** A prize or recognition, shown as a highlighted line above the title. */
  award?: string;
  /** A demo video or recording, linked as "Demo video". */
  demoUrl?: string;
  /** Listed in the home page's Selected work, in the order of this array. */
  home?: true;
  /** Shows a PLACEHOLDER chip. Delete this line once the entry is real. */
  placeholder?: true;
};

export type ExperimentEntry = {
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
    home: true,
    title: "Asterlo",
    summary: "AI-assisted outreach, with a human in control. Research, drafting, and approval in one workflow.",
    description:
      "An AI-assisted outreach platform that runs the whole email workflow — researching a contact from official sources, drafting a personalized message, then holding it at a human approval gate before anything sends. The hard part was building automation that can be stopped: approval gates, campaign holds and idempotent controls so a sequence never double-sends, and never keeps going after someone has replied.",
    category: "ai-products",
    year: "2026",
    status: "In production",
    tech: ["TypeScript", "Next.js", "React", "PostgreSQL", "Gmail API"],
    images: [
      {
        src: "/projects/asterlo/main.webp",
        alt: "Asterlo's landing page: 'Personalized outreach, never a spam blast.', above a website field and a toggle between selling to businesses and consumers",
      },
      {
        src: "/projects/asterlo/secondary.webp",
        alt: "Asterlo's workflow panel: a grid mapping each step from reading your website to sending from your Gmail, with the sources Asterlo read",
      },
    ],
    liveUrl: "https://asterlo.io",
    // No `githubUrl`: the repository is private, so the live product is the
    // only honest link. The card drops the Source line on its own.
  },
  {
    slug: "repday",
    home: true,
    title: "RepDay — Gym Workout Planner",
    summary: "A native workout planner for the sessions you planned — and the ones you improvise. Built with SwiftUI, stored on your device.",
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
    slug: "syllabus-crew",
    home: true,
    title: "Syllabus Crew",
    event: "HackPrinceton 2026",
    award: "Winner · Photon 2.0 Sponsor Track",
    summary: "A personal study agent that lives in iMessage. Text Syl your syllabus once; it quizzes your weakest topics, plans review time, and calls you for voice drills.",
    description:
      "A personal agent for college students that lives in iMessage, built solo at HackPrinceton Fall 2026. Study apps wait for you to open them; Syl texts you. Send your syllabus once and it works out what each exam is worth, quizzes you on your weakest topics by text, and offers review time on your calendar — nothing reaches the calendar until you reply YES. Reply CALL and your phone rings for a three-minute voice drill. Underneath: a router and four specialist agents in plain TypeScript on Claude via Amazon Bedrock, with grading, mastery and every timing rule kept in deterministic code.",
    category: "ai-products",
    year: "2026",
    tech: ["TypeScript", "Claude", "Amazon Bedrock", "ElevenLabs", "Photon iMessage", "Google Calendar API", "Vercel"],
    metrics: [
      { label: "Specialist agents", value: "4" },
      { label: "Automated tests", value: "246" },
      { label: "Built", value: "Solo" },
    ],
    images: [
      {
        src: "/projects/syllabus-crew/main.webp",
        alt: "Syllabus Crew's landing page: 'A campus that texts you first.', over an illustrated campus with numbered stops and an iMessage thread with Syl",
      },
      {
        src: "/projects/syllabus-crew/secondary.webp",
        alt: "Syllabus Crew's voice drill section: 'Reply CALL. Your phone rings.', beside an iMessage thread offering a three-minute drill",
      },
    ],
    liveUrl: "https://syllabus-crew.vercel.app",
    demoUrl: "https://youtu.be/frTz_ULVTXY",
    githubUrl: "https://github.com/zhoulinhua0-star/hackprinceton-2026",
  },
  {
    slug: "prospecto",
    home: true,
    title: "Prospecto",
    event: "HackNC 2026",
    summary: "Evidence-backed listings for companies too early to list: sourced claims, a deterministic valuation, and a simulated market built on top.",
    description:
      "Turns an early-stage company into an evidence-backed listing. Founders submit a pitch, website, GitHub repo and traction data; Gemini extracts claims with quotes and sources, and Prospecto fetches each source independently and rejects anything unsupported. Deterministic code then scores execution, market, product, traction and economics with weights that change by stage, and that price anchors a simulated market with tickers, live quotes and play credits. It also models primary issuance on Solana, recording each allocation as a non-transferable Token-2022 participation receipt.",
    category: "ai-products",
    year: "2026",
    status: "Live",
    tech: ["Next.js", "v0", "Gemini API", "Solana", "Token-2022"],
    images: [
      {
        src: "/projects/prospecto/main.webp",
        alt: "Prospecto's halftone landing page: the blackletter 'Prospecto' wordmark, 'All the companies too early to list.', and a live ticker of subscribed rounds",
      },
      {
        src: "/projects/prospecto/secondary.webp",
        alt: "Prospecto's front page: 'Your half-built idea now has backers.' above an opening-prices board of tickers, stages, fixed prices and subscription bars",
      },
    ],
    liveUrl: "https://prospectofunds.tech",
  },
  {
    slug: "campus-decoder",
    home: true,
    title: "Campus Decoder",
    event: "GatewayHacks 2026",
    summary: "An AI coach for the unwritten rules of university life. Turn an unfamiliar situation into a practical next step.",
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
  {
    slug: "precisiontyper",
    title: "PrecisionTyper",
    summary: "Typing practice built around getting every character right. Follow live feedback or settle into a quieter Zen session.",
    description:
      "A browser typing app with General, Calm, Quotes, and Code collections, each with three difficulty levels. Every character must match before a passage is complete. Practice mode keeps speed, mistakes, and elapsed time visible; Zen mode softens the feedback and advances automatically. Built with vanilla JavaScript, with preferences and passage progress stored in the browser.",
    category: "web",
    year: "2026",
    status: "Live",
    tech: ["JavaScript", "HTML/CSS"],
    images: [
      {
        src: "/projects/precisiontyper/main.png",
        alt: "PrecisionTyper's dark landing page with the heading 'Master typing speed & accuracy', a Play now button, and keyboard sound options",
      },
      {
        src: "/projects/precisiontyper/secondary.png",
        alt: "PrecisionTyper's typing canvas with a target passage, strict character matching, session settings, and a home-row starting guide",
      },
    ],
    liveUrl: "https://precisiontyper.com",
    githubUrl: "https://github.com/zhoulinhua0-star/TypeRacerGame",
  },
];

/** Section 04 — smaller work. Deliberately lighter weight than `projects`. */
export const experiments: ExperimentEntry[] = [
  {
    title: "smooth-option-switcher",
    description:
      "An Agent Skill for smooth option selectors — billing switches, pricing plans, and view modes with moving active indicators. It adapts the interaction to an existing design system, with references for keyboard access and reduced motion.",
    year: "2026",
    category: "developer-tools",
    tech: ["HTML", "CSS"],
    githubUrl: "https://github.com/zhoulinhua0-star/smooth-option-switcher",
  },
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
    title: "weather-cli",
    description:
      "A terminal weather dashboard on the OpenWeatherMap API, rendered with rich. Small enough to finish, which made it a good place to work out what a CLI should feel like to use.",
    year: "2026",
    category: "developer-tools",
    tech: ["Python"],
    githubUrl: "https://github.com/zhoulinhua0-star/weather-cli",
  },
];

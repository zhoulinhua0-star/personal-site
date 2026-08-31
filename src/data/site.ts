export const site = {
  name: "Linhua Zhou",
  nameZh: "周琳桦",
  title: "Linhua Zhou / 周琳桦 — Personal Site",
  description:
    "The personal website of Linhua Zhou / 周琳桦 — a growing index of selected work, writing, and experiments.",
  url: "https://linhuazhou.com",
} as const;

export const navigation = [
  { label: "Index", href: "#index" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const contentIndex = [
  {
    number: "01",
    title: "Selected work",
    note: "Case studies, decisions, and outcomes",
    href: "#work",
  },
  {
    number: "02",
    title: "About the work",
    note: "Context, approach, and capabilities",
    href: "#about",
  },
  {
    number: "03",
    title: "Notes & writing",
    note: "A future home for ideas in progress",
    href: "#writing",
  },
] as const;

export const projectPlaceholders = [
  {
    number: "01",
    eyebrow: "Featured case study",
    title: "Your first project",
    description:
      "Add the problem, constraints, key decisions, implementation, and measurable result here.",
    tone: "cobalt",
  },
  {
    number: "02",
    eyebrow: "Open-source work",
    title: "Your public contribution",
    description:
      "Add a concise explanation of what you built, why it matters, and where the source lives.",
    tone: "sky",
  },
  {
    number: "03",
    eyebrow: "Experiment",
    title: "Your technical study",
    description:
      "Use this space for a smaller interaction, visual system, tool, or research exploration.",
    tone: "ice",
  },
] as const;

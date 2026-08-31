# linhuazhou.com

The personal site of **Linhua Zhou / 周琳桦** — a static, single-page portfolio
covering software engineering, AI and agent systems, developer tools, and
product work.

It is designed to be maintained by hand in VS Code. All the content lives in two
readable data files; nothing you routinely edit is buried inside a component.

---

## Stack

| Layer      | Choice                                                    |
| ---------- | --------------------------------------------------------- |
| Framework  | Next.js (App Router) with `output: "export"` — fully static |
| Language   | TypeScript, strict mode                                    |
| Styling    | Tailwind CSS v4 + design tokens in `src/app/globals.css`    |
| Motion     | CSS only (transitions + scroll-driven animations)           |
| Fonts      | Geist Sans / Geist Mono, self-hosted in `public/fonts/`     |
| Hosting    | GitHub Actions → GitHub Pages → Cloudflare DNS              |

No runtime dependencies beyond React/Next. No CMS, no database, no analytics, no
third-party requests at runtime — the page renders fully offline from its own
origin, which also keeps it reachable from mainland China.

---

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
```

Before pushing:

```bash
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm run build      # static export into out/
```

`npm run build` writes the deployable site to `out/`. To preview that exact
output: `npx serve out`.

---

## Editing the content

### Your name, headline, bio and links — `src/data/personal.ts`

| Export     | What it controls                                                |
| ---------- | ---------------------------------------------------------------- |
| `site`     | URL, page title, meta description, social share image             |
| `identity` | Name, Chinese name, monogram, the "Developer · Builder" line, year |
| `hero`     | The headline (one array entry per line), the intro paragraph, status |
| `links`    | GitHub / LinkedIn / Résumé / Email — label, URL, and handle       |
| `about`    | About paragraphs and the spec-sheet facts beside them             |
| `contact`  | The closing headline and blurb                                    |
| `footer`   | The one-line footer note                                          |

**Hero text.** `hero.statement` is an array — each entry is its own line, so you
control exactly where the headline breaks:

```ts
statement: ["I build software,", "AI tools, and things", "I find interesting."],
```

**Links.** `kind` selects the icon (`"github" | "linkedin" | "resume" | "email"`).
Delete an entry to remove it from both the hero and the contact section. To add a
new kind, add an icon to `src/components/icons.tsx` and register it there.

### Projects — `src/data/projects.ts`

Three exports:

- `categories` — the five cards in section 02.
- `projects` — flagship work in section 03 (large layout with a screenshot stack).
- `lab` — smaller work in section 04 (a compact list, deliberately lighter).

To add a project, copy an existing object and edit it:

```ts
{
  slug: "my-app",
  title: "My App",
  description: "One or two sentences. The problem, and why it was worth solving.",
  category: "ai-products",          // must match a slug in `categories`
  year: "2026",
  status: "Live",                   // optional chip
  tech: ["TypeScript", "Next.js"],  // optional
  metrics: [{ label: "Users", value: "1.2k" }], // optional stat row
  githubUrl: "https://github.com/…",            // optional
  liveUrl: "https://…",                         // optional
  images: [
    { src: "/projects/my-app/main.png", alt: "The My App dashboard" },
    { src: "/projects/my-app/secondary.png", alt: "The settings screen" },
  ],
}
```

Every field except `slug`, `title`, `description`, `category` and `year` is
optional — leave one out and the layout closes up around it.

**`placeholder: true`** draws the dashed "Placeholder" chip. Delete that line
once an entry describes something real.

### Screenshots

```
public/projects/<slug>/main.png
public/projects/<slug>/secondary.png
public/projects/<slug>/tertiary.png
```

- Overwrite a file at the same path and the site picks it up — **no code change.**
- The first image in `images` sits in front; the next two peek out behind it.
  Two or three images look best.
- Landscape, around 1600×1000. Keep them under a few hundred KB.
- The images currently in the repo are generated placeholders. Replace them.

### Other assets

| Path                   | What it is                                              |
| ---------------------- | ------------------------------------------------------- |
| `public/backgrounds/`  | The command-deck artwork (see below) — leave it alone    |
| `public/projects/`     | Project screenshots                                     |
| `public/fonts/`        | Self-hosted Geist (SIL Open Font License, included)      |
| `public/og-image.png`  | 1200×630 social share card                              |
| `public/CNAME`         | The custom domain for GitHub Pages                      |
| `src/app/icon.svg`     | Favicon                                                 |

---

## The command deck (background artwork)

The atmospheric "futuristic control interface" behind the hero and contact
sections is **two original SVG files** in `public/backgrounds/` — a structure
layer and a data layer — drawn from scratch for this site. They are masked into
the white page and never carry meaning, so the site reads identically without
them.

To dial the intensity, change one token in `src/app/globals.css`:

```css
:root                  { --deck-opacity: 0.1;  }  /* Minimal mode */
[data-mode="creative"] { --deck-opacity: 0.34; }  /* Creative mode */
```

Its placement is a handful of `.deck-hero .deck-inner` rules in the same file —
it deliberately sits in the empty right margin beside the content column.

---

## Minimal / Creative mode

One site, one set of markup, one URL. The switch in the header only changes
presentation:

- **Minimal** (the default) — quiet background, no decorative plates, no scroll
  reveals. Built for someone scanning quickly.
- **Creative** — the command deck comes forward, project screenshots sit on a
  blueprint plate and fan apart on hover, sections reveal on scroll, and the deck
  drifts slightly with the pointer.

How it works, in three pieces:

1. Minimal is the CSS default. Creative is expressed as `data-mode="creative"` on
   `<html>`, and every difference between the modes is a CSS rule keyed off that
   attribute.
2. A tiny inline script in `src/app/layout.tsx` reads `localStorage["lz-mode"]`
   before first paint, so a returning visitor never sees a flash. React hydration
   strips attributes it did not render itself, so `src/components/mode-toggle.tsx`
   re-applies the stored choice once after hydrating.
3. Motion is CSS only and every animation sits behind
   `@media (prefers-reduced-motion: no-preference)`. With reduced motion enabled,
   both modes are static and complete.

If you rename the storage key, change it in **both** `layout.tsx` and
`mode-toggle.tsx`.

---

## Deployment

```
git add . && git commit -m "…" && git push
        ↓
GitHub Actions (.github/workflows/deploy-pages.yml)
  npm ci → lint → typecheck → next build → upload out/
        ↓
GitHub Pages → linhuazhou.com (Cloudflare DNS)
```

Pushing to `main` is the deploy. The workflow fails the build on a lint or type
error, so a broken commit never reaches production.

**One-time repository setup** (already done if the site is live):

- Settings → Pages → Source: **GitHub Actions**
- Settings → Pages → Custom domain: `linhuazhou.com`, **Enforce HTTPS** on
- Cloudflare DNS → the four `A` records for GitHub Pages plus a `CNAME` for
  `www`, both **DNS only** (grey cloud), so Pages can issue its certificate

`public/CNAME` keeps the custom domain attached on every deploy — do not delete
it. `public/.nojekyll` stops GitHub Pages from filtering `_next/`.

Because the site is served from the domain root, no `basePath` is configured. If
you ever move it to `https://<user>.github.io/<repo>/`, you will need to add
`basePath` and `assetPrefix` in `next.config.ts`.

---

## Project structure

```
src/
  app/
    layout.tsx        metadata, fonts, the mode boot script
    page.tsx          section order — the shape of the page
    globals.css       design tokens + every component style
    not-found.tsx     404
    robots.ts, sitemap.ts, icon.svg
  components/         small, single-purpose pieces
  data/
    personal.ts       ← you edit this
    projects.ts       ← and this
public/               static assets, copied verbatim into out/
```

The page is a **centred 1040px column** (`--shell`) with wide gutters, so it
stays composed instead of stretching on large displays. Change `--shell` and
`--gutter` in `globals.css` to widen or narrow the whole site at once.

`page.tsx` is a list of sections — reorder or delete one there. Section numbers
(`01`–`06`) are passed in as props, so renumber them when you do.

## Still to fill in

- `links` in `src/data/personal.ts`: the real LinkedIn URL.
- `public/resume.pdf`: not in the repo yet; the Résumé link 404s until you add it.
- `about.facts`: the "Based in" and "Currently" rows.
- Everything in `src/data/projects.ts` marked `placeholder: true`.

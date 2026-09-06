<p align="center">
  <img src="./assets/readme/hero.svg" width="100%"
       alt="linhuazhou.com — a static personal site with no runtime dependencies beyond React, where every word lives in two TypeScript files. Routes: /work, /lab, /about.">
</p>

<p align="center">
  <a href="https://linhuazhou.com"><strong>linhuazhou.com</strong></a> ·
  <a href="#what-you-edit">What you edit</a> ·
  <a href="#how-a-change-ships">How it ships</a> ·
  <a href="#project-structure">Structure</a>
</p>

---

The personal site of **Linhua Zhou** — software engineering, AI and agent systems,
developer tools, and product work.

It is a **compact landing hub** with three pages behind it, not one long scroll.
The point of the build is maintenance: the content you actually change lives in two
plain data files, so adding a project never means opening a component.

- **Live** — [linhuazhou.com](https://linhuazhou.com)
- **Pages** — `/` hub · `/work` · `/lab` · `/about`
- **Build** — Next.js 16 App Router, `output: "export"` — fully static
- **Runtime dependencies** — React and React DOM. Nothing else.

No CMS, no database, no analytics, no third-party requests at runtime. The page renders
entirely from its own origin, which also keeps it reachable from mainland China.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

Before you push:

```bash
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run build        # static export into out/
```

`npm run build` writes the deployable site to `out/`. To preview that exact output:
`npx serve out`.

---

## What you edit

Two files hold everything. Neither contains JSX.

### `src/data/personal.ts` — who the site is about

| Export | Controls |
| --- | --- |
| `site` | Canonical URL, page title, meta description, share image, locale |
| `identity` | Name, `nameAlt` (secondary script), the `Developer · Builder` line, year |
| `places` + `currentPlace` | The live clock in the header — see below |
| `hero` | The headline (one array entry per line), intro paragraph, status chip |
| `links` | Email · GitHub · LinkedIn · Résumé · X — label, URL, and handle |
| `about` | About paragraphs and the spec-sheet facts beside them |
| `footer` | The one-line footer note |

**The headline** is an array, so you control exactly where it breaks:

```ts
statement: ["I build software,", "AI tools, and things", "I find interesting."],
```

**Links.** `kind` selects the icon — `"github" | "linkedin" | "x" | "resume" | "email"`.
Delete an entry and its cell leaves the strip. To add a new kind, add an icon to
`src/components/icons.tsx` and register it there. The email entry deliberately points at
Gmail's compose URL rather than `mailto:`, so it opens a working compose window instead of
handing off to a desktop client that may not exist; `handle` keeps the bare address.

**The clock.** The header shows the real local time wherever you are. Nothing detects
anything — you change one line when you move:

```ts
export const currentPlace: PlaceKey = "dc";   // a key of `places`
```

`zone` is the IANA identifier and does the arithmetic, including daylight saving. `label`
is only what a reader sees, which is why `dc` can print "Washington, D.C." while running on
`America/New_York`. A key that isn't in `places` fails `npm run typecheck`, and an invalid
zone identifier throws during prerender — so neither reaches the site.

### `src/data/projects.ts` — the work

Three exports: `categories` (the five kinds of work), `projects` (`/work`), and `lab`
(`/lab`). Add a project by copying an object:

```ts
{
  slug: "my-app",
  title: "My App",
  description: "One or two sentences. The problem, and why it was worth solving.",
  category: "ai-products",          // ai-products | web | developer-tools
  year: "2026",                     // experiments | open-source
  status: "Live",                                // optional chip
  tech: ["TypeScript", "Next.js"],               // optional
  metrics: [{ label: "Users", value: "1.2k" }],  // optional stat row
  githubUrl: "https://github.com/…",             // optional
  liveUrl: "https://…",                          // optional
  images: [
    { src: "/projects/my-app/main.png", alt: "The My App dashboard" },
    { src: "/projects/my-app/secondary.png", alt: "The settings screen" },
  ],
}
```

Only `slug`, `title`, `description`, `category` and `year` are required — leave a field out
and the layout closes up around it. `placeholder: true` draws the dashed **Placeholder**
chip; delete that line once the entry describes something real.

**Screenshots** go in `public/projects/<slug>/` as `main.png`, `secondary.png`,
`tertiary.png`. Overwrite a file at the same path and the site picks it up — no code change.
The first image sits in front and the next two peek out behind it, so two or three look
best. Landscape, around 1600×1000, a few hundred KB.

---

## How a change ships

<p align="center">
  <img src="./assets/readme/pipeline.svg" width="100%"
       alt="Deploy pipeline: edit personal.ts and projects.ts, push to main, GitHub Actions runs lint then typecheck then next build and fails closed, and the static export is published to GitHub Pages and served over Cloudflare DNS at linhuazhou.com with HTTPS enforced.">
</p>

Pushing to `main` is the deploy — [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)
does the rest. The workflow fails on a lint or type error **before** it builds, so a broken
commit never reaches production.

Repository setup, already in place:

- Settings → Pages → Source: **GitHub Actions**
- Custom domain `linhuazhou.com`, **Enforce HTTPS** on
- Cloudflare DNS: four `A` records to GitHub Pages plus a `CNAME` for `www`, all
  **DNS only** (grey cloud) so Pages can issue and renew its certificate

`public/CNAME` keeps the custom domain attached on every deploy — do not delete it.
`public/.nojekyll` stops Pages from filtering `_next/`.

Because the site is served from the domain root, there is **no `basePath`**. Moving it to
`https://<user>.github.io/<repo>/` would require adding `basePath` and `assetPrefix` to
`next.config.ts`.

---

## Project structure

```
src/
  app/
    layout.tsx        metadata, font preload, click ripple
    page.tsx          the landing hub
    work/ lab/ about/ the three content pages
    globals.css       design tokens + every component style
    not-found.tsx     404
    robots.ts  sitemap.ts  icon.svg
  components/         small, single-purpose pieces
  data/
    personal.ts       ← you edit this
    projects.ts       ← and this
public/               static assets, copied verbatim into out/
assets/readme/        README artwork (not part of the site build)
```

The page is a centred **1040px column** (`--shell`) with wide gutters, so it stays composed
instead of stretching on large displays. Change `--shell` and `--gutter` in `globals.css` to
resize the whole site at once; `--measure` (62ch) caps line length for prose.

<details>
<summary><strong>Design tokens</strong> — the palette in <code>globals.css</code></summary>

<br>

Tailwind CSS v4, configured entirely in CSS via `@theme`. No `tailwind.config.js`.

| Token | Value | Role |
| --- | --- | --- |
| `--color-ink` | `#1a1a17` | Warm near-black type |
| `--color-paper` | `#fbf8f0` | Page ground (warm cream) |
| `--color-paper-2` | `#ffffff` | Raised surfaces — cards, screenshots |
| `--color-line` | `#e7e2d2` | Warm hairlines |
| `--color-accent` | `#1f57d6` | Links, focus, small marks only |
| `--color-marker` | `#ffd64a` | Highlighter swipe — background only, never type |
| `--color-grid` | `rgb(26 22 10 / 0.045)` | Engineering graph-paper ruling |

Type is self-hosted **Geist** and **Geist Mono** (variable `.woff2`, SIL OFL, included in
`public/fonts/`). `Geist-Variable.woff2` is preloaded in `layout.tsx`.

</details>

<details>
<summary><strong>The atmospheric bits</strong> — command deck, cursor, ripple</summary>

<br>

**Command deck.** The "futuristic control interface" behind the hero is two original SVGs in
`public/backgrounds/` — a structure layer and a data layer. They are masked into the page and
carry no meaning, so the site reads identically without them. One token controls intensity:

```css
:root { --deck-opacity: 0.34; }
```

**Cursor.** A real CSS cursor via `image-set()`, not a JS element chasing the mouse — so it
never lags. Artwork is `public/cursor*.png`, generated by `scripts/make-cursor.py`.

**Click ripple.** `src/components/click-ripple.tsx` draws the blue ripple on click.

All motion sits behind `@media (prefers-reduced-motion: no-preference)`. With reduced motion
enabled the site is static and complete.

</details>

---

## Still to fill in

- [ ] **`public/resume.pdf`** — not in the repo yet, so the Résumé link 404s.
- [ ] **`about.facts`** in `personal.ts` — the `Based in` and `Currently` rows still read
      "Add your city" / "Add what you are working on".
- [ ] **Everything in `src/data/projects.ts`** — all three `projects` and all four `lab`
      entries are still marked `placeholder: true`, and the screenshots under
      `public/projects/` are generated placeholders.
- [ ] Optional: `identity.nameAlt` is `""`. Set it back to `"周琳桦"` to restore the
      secondary script in the hero, the footer, and the JSON-LD `alternateName` — one switch
      drives all three.

---

## License

Code is free to learn from. The content — writing, project descriptions, images — and the
Geist fonts (SIL Open Font License, `public/fonts/GEIST-LICENSE.txt`) are excluded.

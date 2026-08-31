# Personal Website

## Objective

Build and maintain Linhua Zhou's production personal website at `https://linhuazhou.com`.

Priorities, in order:

1. Distinctive, original design
2. Reliable access from both mainland China and the United States
3. Simplicity
4. Maintainability
5. Performance
6. Accessibility
7. SEO
8. Extensibility

Repository: `https://github.com/zhoulinhua0-star/personal-site`

## Required stack

- Next.js App Router
- TypeScript with strict mode
- Tailwind CSS
- Fully static export
- Git and GitHub
- GitHub Actions
- GitHub Pages
- Cloudflare-managed DNS
- Custom domain with enforced HTTPS
- Use `npm` unless the repository already contains a different package-manager lockfile

Keep dependencies minimal. Ask before adding a production dependency when a native Next.js, React, CSS, or browser solution is sufficient.

## Static architecture

`next.config.ts` must preserve static export:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

The production build must generate `out/`. Do not introduce:

- SSR or `getServerSideProps`
- Server Actions
- API routes
- middleware, runtime redirects, rewrites, or headers
- ISR
- server-side databases
- authentication
- a persistent Node.js server
- any feature incompatible with `output: "export"`

Use static routes, build-time generation, local structured data, and local Markdown or MDX when writing content requires it. Dynamic routes must provide all parameters at build time. Prefer Server Components; add Client Components only for real browser interaction.

## Site content

The architecture must support:

- Home and introduction
- About
- Resume and experience
- Education
- Projects
- Open-source work
- Technical skills
- Blog and writing
- Contact information
- GitHub and professional or social links

Never invent biographical details, employers, dates, metrics, education, project outcomes, contact details, or social URLs. Use centralized, clearly marked placeholder data only when necessary, then request the real content.

Keep content separate from presentation. Prefer a structure similar to:

```text
src/
  app/
  components/
  content/
  data/
  styles/
public/
```

Create abstractions only when they remove real duplication. Do not add a CMS or backend unless explicitly requested.

## Design direction

Create a clean, minimal, technical, developer-oriented identity with an editorial feel. The result must look custom, not like a generic portfolio template.

- Use a restrained visual system: strong typography, asymmetric grid, precise spacing, thin rules, numbered sections, and one intentional accent color.
- Establish a distinctive `Linhua Zhou / 周琳桦` wordmark or typographic signature.
- Present projects as case studies: problem, constraints, decisions, implementation, and results.
- Avoid generic terminal windows, matrix effects, excessive neon green, decorative code, template-like bento grids, glassmorphism, and gratuitous animation.
- Keep motion subtle and functional. Respect `prefers-reduced-motion`.
- Define colors, typography, spacing, radii, and shadows as reusable design tokens. Do not scatter arbitrary values through components.
- Use SVG icons rather than emoji. Every icon-only control needs an accessible label.

## Mainland China compatibility

The production origin remains GitHub Pages, but minimize avoidable cross-border failures:

- Self-host fonts, images, icons, scripts, styles, and critical assets.
- Do not load Google Fonts or require Google, YouTube, X, Instagram, or other potentially unavailable services to render a page.
- Do not use remote avatars, badges, analytics, comment widgets, form providers, or embedded social posts without explicit approval.
- Professional networks should be ordinary outbound links.
- Core content and navigation must remain usable if every third-party request fails.
- Optimize static assets and keep JavaScript small.

## Accessibility and responsive behavior

- Use semantic HTML and a logical heading hierarchy.
- Ensure complete keyboard navigation and visible focus states.
- Meet WCAG AA contrast; normal text requires at least 4.5:1.
- Provide meaningful image alt text and accessible names for controls.
- Do not depend on hover alone.
- Prevent layout shift and horizontal scrolling.
- Verify at 375px, 768px, 1024px, and 1440px widths.
- Support current Safari, Chrome, Firefox, and Edge.

## SEO

- Canonical origin: `https://linhuazhou.com`
- Redirect `www.linhuazhou.com` to the canonical domain through GitHub Pages/DNS configuration.
- Provide unique page titles and descriptions.
- Generate `sitemap.xml`, `robots.txt`, Open Graph metadata, social preview images, canonical URLs, and appropriate JSON-LD.
- Use crawlable static HTML, semantic landmarks, descriptive links, and clean URLs.
- If bilingual content is requested, implement explicit static routes such as `/en/` and `/zh/` with correct `hreflang`; do not use runtime language detection.

## Deployment

Production flow:

```text
Local development
→ Git commit
→ Push to main
→ GitHub Actions
→ npm ci
→ lint and type-check
→ next build
→ upload out/
→ GitHub Pages
→ linhuazhou.com
→ Cloudflare DNS
```

Use the official GitHub Pages Actions workflow with separate build and deploy jobs. Configure Pages through repository settings with GitHub Actions as the source. The workflow must have only the permissions required for Pages deployment and must prevent overlapping production deployments.

Do not commit `.next/`, `out/`, `node_modules/`, secrets, credentials, or local environment files. Do not deploy, push, modify DNS, or change repository settings unless explicitly requested.

## Engineering rules

- Make the smallest change that fully satisfies the request.
- Preserve static-export compatibility after every change.
- Follow existing conventions and avoid unrelated refactors.
- Use precise TypeScript types; avoid `any` unless unavoidable and documented.
- Remove only unused code created by the current change.
- Do not add speculative features, configuration, or premature abstractions.
- Never expose secrets in client code or GitHub Actions.
- Treat accessibility, SEO, and responsive behavior as implementation requirements, not later polish.

## Verification

Before considering work complete, run the available equivalents of:

```bash
npm run lint
npm run typecheck
npm run build
```

Then verify:

- The build succeeds and produces `out/`.
- Every route and internal link works in the static output.
- The custom 404 page works.
- There are no TypeScript errors, console errors, hydration errors, or missing assets.
- Core pages work with JavaScript disabled where practical.
- Keyboard navigation, focus visibility, contrast, reduced motion, and responsive layouts pass manual review.
- No required page asset depends on a third-party service.
- Canonical, metadata, sitemap, robots, and structured data are correct.
- Aim for Lighthouse scores of at least 95 for Performance, Accessibility, Best Practices, and SEO on representative production pages.

Report what changed, what was verified, and any remaining content or deployment action that requires the owner.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

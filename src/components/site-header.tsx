import Link from "next/link";
import { identity, links, place } from "@/data/personal";
import { LocalTime } from "./local-time";
import { ArrowUpRight } from "./icons";

/**
 * `wide` marks a link the corner cannot afford on a phone.
 *
 * The labels here are the names the pages use, so that a visitor never meets a
 * section under two different words. That costs width: "Projects Experiments
 * Approach" measures 224px at 13px against the 146px the old three-word set
 * took. At 390px the usable row is 343px, and the clock's full readout is 173px
 * — 421px of content for 343px of space, so something had to yield. Résumé
 * still steps out below `sm` (SiteFooter carries it there), and the city now
 * waits for `md` as well; see LocalTime, which does that arithmetic. What is
 * left below `sm` is the bare time and the three section names, 284px, which
 * fits with room to spare.
 */
const nav = [
  { label: "Projects", href: "/projects" },
  { label: "Experiments", href: "/experiments" },
  { label: "Approach", href: "/approach" },
  { label: "Résumé", href: "/resume", wide: true },
];

const github = links.find((link) => link.kind === "github");

export function SiteHeader({ current }: { current?: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/80 backdrop-blur-[10px]">
      <div className="shell flex h-15 items-center justify-between gap-6">
        {/* The corner carries where I am and what time it is here, in place of a
            wordmark. It stays a link to the index so the long-standing "click
            the top-left to go home" habit still works, and the accessible name
            keeps the identity a sighted visitor now reads in the hero. */}
        <Link
          href="/"
          className="group shrink-0 transition-colors duration-300 hover:text-ink"
          aria-label={`${identity.name} — home · local time in ${place.label}`}
        >
          <LocalTime />
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <nav aria-label="Sections">
            <ul className="flex items-center gap-5 sm:gap-7">
              {nav.map((item) => {
                const active = current === item.href;
                return (
                  <li key={item.href} className={item.wide ? "hidden sm:block" : undefined}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`nav-link link-underline text-[13px] hover:text-ink ${
                        active ? "text-ink" : "text-ink-2"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {github ? (
            <a
              href={github.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub — opens in a new tab"
              /* Phones have room for the clock and the nav, not for a third
                 element — measured, the pill is exactly the overflow. It is a
                 secondary, external link, so it yields to the identity corner
                 and the primary nav; SiteFooter carries it below `sm` instead. */
              className="group hidden items-center gap-1.5 rounded-full border border-line-2 bg-paper-2 py-1.5 pl-3.5 pr-3 text-[13px] font-medium text-ink-2 transition-colors duration-300 hover:border-ink hover:text-ink focus-visible:border-ink sm:inline-flex"
            >
              GitHub
              <ArrowUpRight className="size-3.5 text-ink-4 transition-[transform,color] duration-300 group-hover:-translate-y-px group-hover:text-ink" />
            </a>
          ) : null}
        </div>
      </div>
    </header>
  );
}

import Link from "next/link";
import { identity, links, place } from "@/data/personal";
import { ThemeToggle } from "./theme-toggle";
import { LocalTime } from "./local-time";
import { ArrowUpRight } from "./icons";

/** Résumé moves to the footer on phones; the theme switch stays available.
 * GitHub moves to the footer below desktop to leave room for the live clock. */
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
      <div className="shell flex h-15 items-center justify-between gap-2 sm:gap-4">
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

        <div className="flex items-center gap-2 sm:gap-4">
          <nav aria-label="Sections">
            <ul className="flex items-center gap-3 sm:gap-5">
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
              className="group hidden items-center gap-1.5 rounded-full border border-line-2 bg-paper-2 py-1.5 pl-3.5 pr-3 text-[13px] font-medium text-ink-2 transition-colors duration-300 hover:border-ink hover:text-ink focus-visible:border-ink lg:inline-flex"
            >
              GitHub
              <ArrowUpRight className="size-3.5 text-ink-4 transition-[transform,color] duration-300 group-hover:-translate-y-px group-hover:text-ink" />
            </a>
          ) : null}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

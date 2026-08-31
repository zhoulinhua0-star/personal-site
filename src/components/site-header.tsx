import Link from "next/link";
import { identity, links } from "@/data/personal";
import { ArrowUpRight } from "./icons";

const nav = [
  { label: "Work", href: "/work" },
  { label: "Lab", href: "/lab" },
  { label: "About", href: "/about" },
];

const github = links.find((link) => link.kind === "github");

export function SiteHeader({ current }: { current?: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/80 backdrop-blur-[10px]">
      <div className="shell flex h-15 items-center justify-between gap-6">
        <Link href="/" className="group flex items-center gap-3" aria-label={`${identity.name} — home`}>
          <span className="relative shrink-0">
            <span className="grid size-7 place-items-center rounded-xs bg-ink font-mono text-[11px] font-medium tracking-[0.06em] text-white transition-colors duration-500 group-hover:bg-accent">
              {identity.monogram}
            </span>
            <sup className="absolute -right-2 -top-1 font-mono text-[8px] text-ink-4" aria-hidden="true">
              &reg;
            </sup>
          </span>
          <span className="flex items-baseline gap-2">
            <span className="text-[14px] font-medium tracking-[-0.02em]">{identity.name}</span>
            {identity.nameAlt ? (
              <span className="hidden text-[13px] text-ink-3 sm:inline">{identity.nameAlt}</span>
            ) : null}
          </span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <nav aria-label="Sections">
            <ul className="flex items-center gap-5 sm:gap-7">
              {nav.map((item) => {
                const active = current === item.href;
                return (
                  <li key={item.href}>
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
              className="group inline-flex items-center gap-1.5 rounded-full border border-line-2 bg-paper-2 py-1.5 pl-3.5 pr-3 text-[13px] font-medium text-ink-2 transition-colors duration-300 hover:border-ink hover:text-ink focus-visible:border-ink"
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

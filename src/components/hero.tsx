import type { CSSProperties } from "react";
import { hero, identity, links } from "@/data/personal";
import { CommandDeck } from "./command-deck";
import { ArrowUpRight } from "./icons";
import { LinkStrip } from "./link-strip";

const email = links.find((link) => link.kind === "email");

export function Hero() {
  return (
    <section id="top" className="home-intro relative isolate overflow-hidden">
      <CommandDeck />
      <div className="shell relative z-[1]">
        <p className="label">{identity.role}</p>
        <div className="intro-grid">
          <div>
            {/* The name is one unsplit text node: the entrance is a marker swipe
                that runs across the whole headline, so nothing here needs to be
                cut into per-word spans. The screen-reader copy carries the real
                name; the visual copy is the one the marker paints. */}
            <h1 data-hero-reveal className="display flex flex-wrap items-baseline gap-x-[0.28em] gap-y-2">
              <span className="sr-only">{identity.name}{identity.nameAlt ? ` ${identity.nameAlt}` : ""}</span>
              <span aria-hidden="true" data-hero-sweep>{identity.name}</span>
              {identity.nameAlt ? (
                <span
                  aria-hidden="true"
                  data-hero-sweep
                  /* The marker reaches the second name after it has left the first. */
                  style={{ "--hero-sweep-delay": "620ms" } as CSSProperties}
                  className="text-[0.3em] font-normal tracking-normal text-ink-3"
                  lang="zh-Hans"
                >
                  {identity.nameAlt}
                </span>
              ) : null}
            </h1>
            <p className="intro-copy">{hero.intro}</p>
            {email ? (
              <a href={email.href} target="_blank" rel="noreferrer noopener" className="group intro-status">
                <span className="pulse size-1.5 shrink-0 rounded-full bg-accent" />
                {hero.status}
                <ArrowUpRight className="size-3.5" />
              </a>
            ) : (
              <p className="intro-status">{hero.status}</p>
            )}
          </div>
          <dl className="intro-now">
            {hero.now.map((row) => (
              <div key={row.label} className="border-t border-line py-4">
                <dt className="label mb-2">{row.label}</dt>
                <dd className="text-[14px] leading-relaxed text-ink-2">
                  {row.href ? (
                    <a href={row.href} target="_blank" rel="noreferrer noopener" className="text-ink hover:text-accent">
                      <span className="link-underline">{row.value}</span>
                      <ArrowUpRight className="ml-1 inline-block size-3.5 align-[-2px]" />
                    </a>
                  ) : row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <LinkStrip className="intro-links" />
      </div>
    </section>
  );
}

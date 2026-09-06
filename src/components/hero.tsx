import { hero, identity, links } from "@/data/personal";
import { CommandDeck } from "./command-deck";
import { ArrowUpRight } from "./icons";
import { LinkStrip } from "./link-strip";

const email = links.find((link) => link.kind === "email");

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      <CommandDeck />

      <div className="shell relative z-[1] pt-[clamp(40px,6vw,72px)] pb-[clamp(36px,5vw,60px)]">
        {/* Meta line: the role, then a hairline running out to the edge. The
            year used to terminate this rule; the header's clock says what year
            it is now, live, so repeating it here would only be a second answer
            to a question already answered. */}
        <div className="flex items-center gap-5">
          <p className="label whitespace-nowrap">{identity.role}</p>
          <span className="h-px flex-1 bg-line" />
        </div>

        <h1 className="display mt-[clamp(28px,5vw,56px)] flex flex-wrap items-baseline gap-x-[0.28em] gap-y-2">
          <span>{identity.name}</span>
          {identity.nameAlt ? (
            <span
              className="text-[0.24em] font-normal tracking-[0.02em] text-ink-3"
              lang="zh-Hans"
            >
              {identity.nameAlt}
            </span>
          ) : null}
        </h1>

        <p className="statement mt-[clamp(20px,3vw,36px)] max-w-[19ch] text-ink-2">
          {hero.statement.map((line, index) => (
            <span key={line} className="block">
              {index === 0 ? <span className="text-ink">{line}</span> : line}
            </span>
          ))}
        </p>

        <div className="mt-[clamp(30px,4vw,52px)] max-w-[52ch]">
          <p className="lead">{hero.intro}</p>
          {email ? (
            <a
              href={email.href}
              // The status line points at the same place the Email cell does,
              // and now that the destination is a web page rather than a
              // handoff to a mail client, it opens beside the site instead of
              // navigating away from it.
              target="_blank"
              rel="noreferrer noopener"
              className="group mono-xs mt-6 inline-flex items-center gap-2.5 text-ink-3 transition-colors duration-300 hover:text-ink focus-visible:text-ink"
            >
              <span className="pulse inline-block size-1.5 rounded-full bg-accent" />
              {hero.status}
              <ArrowUpRight className="size-3.5 text-ink-4 transition-[transform,color] duration-300 group-hover:-translate-y-px group-hover:text-ink" />
            </a>
          ) : (
            <p className="mono-xs mt-6 flex items-center gap-2.5 text-ink-3">
              <span className="pulse inline-block size-1.5 rounded-full bg-accent" />
              {hero.status}
            </p>
          )}
        </div>

        <LinkStrip className="mt-[clamp(26px,4vw,40px)]" />
      </div>
    </section>
  );
}

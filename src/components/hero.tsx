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

        {/* The Now block. Same rules as the spec sheet beside the About prose,
            one column narrower: label left, value right, a hairline between
            rows. Reusing that table rather than inventing a second one is the
            point — the two pages then read as one document.

            `max-w-[52ch]` is the paragraph's own measure, so this block and
            the prose under it share a right edge. */}
        <dl className="mt-[clamp(20px,3vw,36px)] max-w-[52ch]">
          {hero.now.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 border-t border-line py-4 last:border-b"
            >
              <dt className="label pt-1">{row.label}</dt>
              <dd className="text-[15px] leading-[1.5] text-ink-2">
                {row.href ? (
                  <a
                    href={row.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    /* Inline rather than a flex row: when the value wraps on a
                       phone, the arrow has to follow the last word instead of
                       parking itself at the top right of the cell. */
                    className="group text-ink transition-colors duration-300 hover:text-accent focus-visible:text-accent"
                  >
                    <span className="link-underline">{row.value}</span>
                    <ArrowUpRight className="ml-1.5 inline-block size-3.5 align-[-2px] text-ink-4 transition-[transform,color] duration-300 group-hover:-translate-y-px group-hover:text-accent" />
                  </a>
                ) : (
                  row.value
                )}
              </dd>
            </div>
          ))}
        </dl>

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

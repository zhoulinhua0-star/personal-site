import { hero, identity, links } from "@/data/personal";
import { CommandDeck } from "./command-deck";
import { ArrowUpRight, LinkIcon } from "./icons";

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      <CommandDeck />

      <div className="shell relative z-[1] pt-[clamp(56px,9vw,104px)] pb-[clamp(48px,6vw,88px)]">
        {/* Meta line: role on the left, year on the right, hairline between. */}
        <div className="flex items-center gap-5">
          <p className="label whitespace-nowrap">{identity.role}</p>
          <span className="h-px flex-1 bg-line" />
          <p className="label whitespace-nowrap">{identity.year}</p>
        </div>

        <h1 className="display mt-[clamp(40px,7vw,88px)] flex flex-wrap items-baseline gap-x-[0.28em] gap-y-2">
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

        <p className="statement mt-[clamp(28px,4vw,52px)] max-w-[19ch] text-ink-2">
          {hero.statement.map((line, index) => (
            <span key={line} className="block">
              {index === 0 ? <span className="text-ink">{line}</span> : line}
            </span>
          ))}
        </p>

        <div className="mt-[clamp(44px,6vw,84px)] grid gap-[clamp(32px,4vw,64px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:items-start">
          <div>
            <p className="lead max-w-[52ch]">{hero.intro}</p>
            <p className="mono-xs mt-6 flex items-center gap-2.5 text-ink-3">
              <span className="pulse inline-block size-1.5 rounded-full bg-accent" />
              {hero.status}
            </p>
          </div>

          {/* Primary links. Recruiters should hit these without scrolling. */}
          <ul className="grid grid-cols-2 border-t border-l border-line">
            {links.map((link) => {
              const external = link.href.startsWith("http");
              return (
                <li key={link.kind} className="border-r border-b border-line">
                  <a
                    href={link.href}
                    className="group flex h-full flex-col justify-between gap-5 p-4 transition-colors duration-300 hover:bg-paper-2 sm:p-5"
                    {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                  >
                    <span className="flex items-center justify-between">
                      <LinkIcon kind={link.kind} className="text-ink-3 transition-colors duration-300 group-hover:text-accent" />
                      <ArrowUpRight className="text-ink-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                    </span>
                    <span>
                      <span className="block text-[14px] font-medium">{link.label}</span>
                      <span className="mono-xs block truncate text-ink-3">{link.handle}</span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

      </div>
    </section>
  );
}

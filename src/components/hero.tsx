import { hero, identity } from "@/data/personal";
import { CommandDeck } from "./command-deck";
import { SocialRow } from "./social-row";

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      <CommandDeck />

      <div className="shell relative z-[1] pt-[clamp(40px,6vw,72px)] pb-[clamp(36px,5vw,60px)]">
        {/* Meta line: role on the left, year on the right, hairline between. */}
        <div className="flex items-center gap-5">
          <p className="label whitespace-nowrap">{identity.role}</p>
          <span className="h-px flex-1 bg-line" />
          <p className="label whitespace-nowrap">{identity.year}</p>
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
          <p className="mono-xs mt-6 flex items-center gap-2.5 text-ink-3">
            <span className="pulse inline-block size-1.5 rounded-full bg-accent" />
            {hero.status}
          </p>
        </div>

        {/* Social links as quiet inline navigation, not a call-to-action. */}
        <SocialRow className="mt-[clamp(26px,4vw,40px)]" />
      </div>
    </section>
  );
}

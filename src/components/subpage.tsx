import Link from "next/link";
import type { ReactNode } from "react";

/**
 * The shell every interior page uses: a back link home, then the same
 * numbered head as the home sections (index line, display heading,
 * optional note, one hairline rule) with a ghost watermark numeral behind it.
 *
 * `number` is optional because not every page is one of the hub's numbered
 * parts. /resume is the case: it is a file to take away rather than a section
 * to read, which is why it left the hub grid. Carrying a numeral there would
 * advertise a fourth part the index no longer has, so it runs on the label
 * alone — the same shell, one rank quieter.
 */
export function Subpage({
  number,
  label,
  title,
  aside,
  children,
}: {
  /** "01", "02" … matches the home hub card. Omitted by pages outside it. */
  number?: string;
  /** Short uppercase index label. */
  label: string;
  title: ReactNode;
  /** Optional supporting note shown to the right of the heading. */
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main
      id="main"
      className="shell relative pt-[clamp(28px,5vw,52px)] pb-[clamp(80px,12vw,140px)]"
    >
      {number ? (
        <span className="ghost-num ghost-num-section" aria-hidden="true">
          {number}
        </span>
      ) : null}

      <Link
        href="/"
        className="relative z-[1] inline-flex items-center gap-2 text-[13px] text-ink-2 transition-colors duration-300 hover:text-ink group"
      >
        <span
          aria-hidden="true"
          className="transition-transform duration-500 group-hover:-translate-x-0.5"
        >
          &larr;
        </span>
        <span className="link-underline">Home</span>
      </Link>

      <div className="section-head reveal relative z-[1] mt-[clamp(26px,4vw,44px)]">
        <div>
          <p className="label index-label mb-5">
            {number ? (
              <>
                <span className="label-accent">{number}</span>
                <span className="index-rule" aria-hidden="true" />
              </>
            ) : null}
            <span>{label}</span>
          </p>
          <h1 className="heading max-w-[18ch] text-balance">{title}</h1>
        </div>
        {aside ? <p className="lead max-w-[46ch]">{aside}</p> : null}
      </div>

      <div className="relative z-[1]">{children}</div>
    </main>
  );
}

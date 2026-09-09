import type { ReactNode } from "react";

/**
 * A numbered section shell. Every section uses it, which is what gives the page
 * its editorial rhythm: a bilingual index line, a display heading, an optional
 * note on the right, one hairline rule, and a ghost watermark numeral behind it.
 *
 * `title` is optional because a section whose content already announces itself
 * does not need a heading narrating it — the home hub is the case, where three
 * named cards say where to go more plainly than a sentence above them could.
 * Dropped, the index line and the rule remain, so the section keeps the beat
 * every other page opens on without claiming to explain anything.
 */
export function Section({
  id,
  number,
  label,
  title,
  aside,
  children,
  className = "",
}: {
  id: string;
  /** "02", "03" … Omit for a one-off section that needs no count. */
  number?: string;
  /** Short uppercase index label. */
  label: string;
  /** The display heading. Omit where the section's own content is the label. */
  title?: ReactNode;
  /** Optional supporting note shown to the right of the heading. */
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`section ${className}`} aria-labelledby={`${id}-title`}>
      <div className="shell relative">
        {number ? (
          <span className="ghost-num ghost-num-section" aria-hidden="true">
            {number}
          </span>
        ) : null}

        <div className={`section-head reveal relative z-[1]${title ? "" : " section-head-bare"}`}>
          <div>
            {/* Without a heading the index line is what names the section, so
                it takes the id `aria-labelledby` points at, and drops the gap
                it was only holding open for the heading beneath it. */}
            <p
              id={title ? undefined : `${id}-title`}
              className={`label index-label${title ? " mb-5" : ""}`}
            >
              {number ? <span className="label-accent">{number}</span> : null}
              <span className="index-rule" aria-hidden="true" />
              <span>{label}</span>
            </p>
            {title ? (
              <h2 id={`${id}-title`} className="heading max-w-[18ch] text-balance">
                {title}
              </h2>
            ) : null}
          </div>
          {aside ? <p className="lead max-w-[46ch]">{aside}</p> : null}
        </div>

        <div className="relative z-[1]">{children}</div>
      </div>
    </section>
  );
}

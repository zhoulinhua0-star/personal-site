import type { ReactNode } from "react";

/**
 * A numbered section shell. Every section uses it, which is what gives the page
 * its editorial rhythm: a bilingual index line, a display heading, an optional
 * note on the right, one hairline rule, and a ghost watermark numeral behind it.
 */
export function Section({
  id,
  number,
  label,
  labelZh,
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
  /** Optional Chinese label, rendered as "中文 / ENGLISH". */
  labelZh?: string;
  /** The display heading. */
  title: ReactNode;
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

        <div className="section-head reveal relative z-[1]">
          <div>
            <p className="label index-label mb-5">
              {number ? <span className="label-accent">{number}</span> : null}
              <span className="index-rule" aria-hidden="true" />
              {labelZh ? (
                <span>
                  <span lang="zh-Hans">{labelZh}</span>
                  <span className="mx-1.5 text-ink-4">/</span>
                </span>
              ) : null}
              <span>{label}</span>
            </p>
            <h2 id={`${id}-title`} className="heading max-w-[18ch] text-balance">
              {title}
            </h2>
          </div>
          {aside ? <p className="lead max-w-[46ch]">{aside}</p> : null}
        </div>

        <div className="relative z-[1]">{children}</div>
      </div>
    </section>
  );
}

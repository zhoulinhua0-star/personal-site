import type { ReactNode } from "react";

/**
 * A numbered section shell. Every section uses it, which is what gives the page
 * its editorial rhythm: a mono index line, a display heading, an optional note
 * on the right, and one hairline rule.
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
  /** "02", "03" … */
  number: string;
  /** Short uppercase index label. */
  label: string;
  /** The display heading. */
  title: ReactNode;
  /** Optional supporting note shown to the right of the heading. */
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`section ${className}`} aria-labelledby={`${id}-title`}>
      <div className="shell relative z-[1]">
        <div className="section-head reveal">
          <div>
            <p className="label mb-5">
              <span className="label-accent">{number}</span>
              <span className="mx-2 text-ink-4">—</span>
              {label}
            </p>
            <h2 id={`${id}-title`} className="heading max-w-[18ch] text-balance">
              {title}
            </h2>
          </div>
          {aside ? <p className="lead max-w-[46ch]">{aside}</p> : null}
        </div>
        {children}
      </div>
    </section>
  );
}

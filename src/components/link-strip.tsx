import { links } from "@/data/personal";
import { LinkIcon } from "./icons";

/**
 * The hero's link strip: named destinations separated by hairlines, with one
 * rule above and one below. No box, no fill — the graph-paper ruling runs
 * straight through it, so it reads as part of the page's own ruling rather than
 * a widget sitting on top of the paper.
 *
 * Dividers come from `divide-*`, which styles every child but the first. That
 * is only correct when DOM order matches visual order, so the strip is a single
 * column on phones (horizontal rules) and a single row from `sm` up (vertical
 * rules) — never a wrapping grid, where the first cell of the second row would
 * inherit a divider it should not have.
 *
 * Cells size to their label rather than to an equal-width column, and the outer
 * two drop their outer padding, so the first label starts flush with the hero's
 * text column and the rules end exactly where the last label does.
 *
 * `.strip-cell` (globals.css) carries the marker-yellow hover wipe — the same
 * one the category cards use, so the two read as a single gesture.
 */
export function LinkStrip({ className = "" }: { className?: string }) {
  return (
    <ul
      className={`grid divide-y divide-line border-y border-line sm:inline-flex sm:divide-x sm:divide-y-0 sm:[&>li:first-child>a]:pl-0 sm:[&>li:last-child>a]:pr-0 ${className}`}
    >
      {links.map((link) => {
        const external = link.href.startsWith("http");
        return (
          <li key={link.kind}>
            <a
              href={link.href}
              className="strip-cell group flex h-11 items-center gap-2.5 text-[13px] font-medium text-ink-2 transition-colors duration-300 hover:text-ink focus-visible:text-ink sm:px-5"
              {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
            >
              <LinkIcon
                kind={link.kind}
                className="size-4 shrink-0 text-ink-3 transition-colors duration-300 group-hover:text-accent group-focus-visible:text-accent"
              />
              {link.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

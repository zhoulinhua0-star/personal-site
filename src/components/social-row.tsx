import { links } from "@/data/personal";
import { LinkIcon } from "./icons";

/**
 * The social links as quiet inline navigation: one compact row of small icons,
 * muted by default and settling to ink on hover or keyboard focus. No cards, no
 * borders, no button containers — they only step forward when reached for.
 * Rendered under the hero and again in the index section.
 */
export function SocialRow({ className = "" }: { className?: string }) {
  return (
    <ul className={`-ml-2.5 flex flex-wrap items-center gap-x-1 ${className}`}>
      {links.map((link) => {
        const external = link.href.startsWith("http");
        return (
          <li key={link.kind}>
            <a
              href={link.href}
              aria-label={link.label}
              className="group flex p-2.5 text-ink-3 transition-[color,transform] duration-200 hover:-translate-y-px hover:text-ink focus-visible:text-ink"
              {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
            >
              <LinkIcon kind={link.kind} className="size-4" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

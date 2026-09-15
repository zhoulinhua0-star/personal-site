import { links } from "@/data/personal";
import { LinkIcon } from "./icons";

/** Compact wrapping links keep every destination visible on small screens. */
export function LinkStrip({ className = "" }: { className?: string }) {
  return (
    <ul
      className={`flex flex-wrap gap-x-6 gap-y-1 ${className}`}
    >
      {links.map((link) => {
        const external = link.href.startsWith("http");
        return (
          <li key={link.kind}>
            <a
              href={link.href}
              className="strip-cell group flex h-11 items-center gap-2.5 text-[13px] font-medium text-ink-2 transition-colors duration-300 hover:text-ink focus-visible:text-ink"
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

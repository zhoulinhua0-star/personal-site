import { links } from "@/data/personal";
import { ArrowUpRight, LinkIcon } from "./icons";

const email = links.find((link) => link.kind === "email");

/**
 * The body of the Contact section: the email address as one prominent line,
 * then every link spelled out with its handle so the visitor never has to
 * hover a mystery glyph to know where it goes. The section shell around it
 * (index label, heading, note) is supplied by <Section>.
 */
export function ContactBlock() {
  return (
    <div>
      {email ? (
        <a
          href={email.href}
          className="group inline-flex items-baseline gap-3 text-ink transition-colors duration-300 hover:text-accent focus-visible:text-accent"
        >
          <span className="subheading">{email.handle}</span>
          <ArrowUpRight className="size-4 shrink-0 translate-y-[0.15em] text-ink-3 transition-[transform,color] duration-300 group-hover:-translate-y-px group-hover:text-accent" />
        </a>
      ) : null}

      <ul className="mt-9 max-w-[480px] divide-y divide-line border-y border-line">
        {links.map((link) => {
          const external = link.href.startsWith("http");
          return (
            <li key={link.kind}>
              <a
                href={link.href}
                className="group flex items-center gap-3 py-3 text-ink-2 transition-colors duration-200 hover:text-ink focus-visible:text-ink"
                {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
              >
                <LinkIcon
                  kind={link.kind}
                  className="size-4 shrink-0 text-ink-3 transition-colors duration-200 group-hover:text-ink"
                />
                <span className="text-[14px] font-medium">{link.label}</span>
                <span className="mono-xs ml-auto truncate pl-4 text-ink-4">{link.handle}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

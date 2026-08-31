import { contact, links } from "@/data/personal";
import { CommandDeck } from "./command-deck";
import { ArrowUpRight, LinkIcon } from "./icons";

const email = links.find((link) => link.kind === "email");

export function ContactSection() {
  return (
    <section id="contact" className="section relative isolate overflow-hidden" aria-labelledby="contact-title">
      <CommandDeck variant="contact" />

      <div className="shell relative z-[1]">
        <div className="flex items-center gap-5">
          <p className="label whitespace-nowrap">
            <span className="label-accent">06</span>
            <span className="mx-2 text-ink-4">—</span>
            Contact
          </p>
          <span className="h-px flex-1 bg-line" />
        </div>

        <h2
          id="contact-title"
          className="mt-[clamp(28px,4vw,52px)] text-[clamp(2.1rem,6vw,4.5rem)] leading-[1.02] font-medium tracking-[-0.04em]"
        >
          {contact.headline.map((line, index) => (
            <span key={line} className="block">
              {index === contact.headline.length - 1 ? (
                <span className="text-ink-3">{line}</span>
              ) : (
                line
              )}
            </span>
          ))}
        </h2>

        <p className="lead mt-7 max-w-[48ch]">{contact.blurb}</p>

        {email ? (
          <a
            href={email.href}
            className="group mt-9 inline-flex items-center gap-3 text-[clamp(1.05rem,2vw,1.5rem)] font-medium tracking-[-0.02em] text-accent"
          >
            <span className="link-underline">{email.handle}</span>
            <ArrowUpRight className="size-5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        ) : null}

        <ul className="mt-12 flex flex-wrap gap-2">
          {links
            .filter((link) => link.kind !== "email")
            .map((link) => {
              const external = link.href.startsWith("http");
              return (
                <li key={link.kind}>
                  <a
                    href={link.href}
                    className="chip h-9 gap-2 px-3.5 transition-colors duration-300 hover:border-line-2 hover:text-ink"
                    {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                  >
                    <LinkIcon kind={link.kind} className="size-3.5" />
                    {link.label}
                  </a>
                </li>
              );
            })}
        </ul>
      </div>
    </section>
  );
}

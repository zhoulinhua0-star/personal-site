import { footer, identity, links } from "@/data/personal";
import { ArrowUpRight } from "./icons";

const email = links.find((link) => link.kind === "email");
const github = links.find((link) => link.kind === "github");

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="shell flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-8">
        <p className="mono-xs text-ink-3">
          © {identity.year} {identity.name}
          {identity.nameAlt ? <span className="ml-2 text-ink-4">{identity.nameAlt}</span> : null}
        </p>
        <p className="mono-xs max-w-[46ch] text-ink-4">{footer.note}</p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {email ? (
            <a
              href={email.href}
              target="_blank"
              rel="noreferrer noopener"
              className="mono-xs group inline-flex items-center gap-1.5 text-ink-3 hover:text-accent"
            >
              {email.handle}
              <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5" />
            </a>
          ) : null}
          {/* The exact complement of the header's rule: SiteHeader shows the
              GitHub pill from `sm` up, so this shows below it. Between them the
              link is reachable from every page at every width, and neither
              width ever renders it twice. */}
          {github ? (
            <a
              href={github.href}
              target="_blank"
              rel="noreferrer noopener"
              className="mono-xs group inline-flex items-center gap-1.5 text-ink-3 hover:text-accent sm:hidden"
            >
              {github.handle}
              <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5" />
            </a>
          ) : null}
          <a href="#main" className="mono-xs group inline-flex items-center gap-1.5 text-ink-3 hover:text-accent">
            Back to top
            <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

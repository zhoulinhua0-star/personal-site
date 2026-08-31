import { footer, identity } from "@/data/personal";
import { ArrowUpRight } from "./icons";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="shell flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-8">
        <p className="mono-xs text-ink-3">
          © {identity.year} {identity.name}
          {identity.nameAlt ? <span className="ml-2 text-ink-4">{identity.nameAlt}</span> : null}
        </p>
        <p className="mono-xs max-w-[46ch] text-ink-4">{footer.note}</p>
        <a href="#main" className="mono-xs group inline-flex items-center gap-1.5 text-ink-3 hover:text-accent">
          Back to top
          <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </footer>
  );
}

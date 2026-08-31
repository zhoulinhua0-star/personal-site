import { identity } from "@/data/personal";
import { ModeToggle } from "./mode-toggle";

const nav = [
  { label: "Work", href: "#work" },
  { label: "Lab", href: "#lab" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/80 backdrop-blur-[10px]">
      <div className="shell flex h-15 items-center justify-between gap-6">
        <a href="#top" className="group flex items-center gap-3" aria-label={`${identity.name} — back to top`}>
          <span className="grid size-7 place-items-center rounded-xs bg-ink font-mono text-[11px] font-medium tracking-[0.06em] text-white transition-colors duration-500 group-hover:bg-accent">
            {identity.monogram}
          </span>
          <span className="flex items-baseline gap-2">
            <span className="text-[14px] font-medium tracking-[-0.02em]">{identity.name}</span>
            {identity.nameAlt ? (
              <span className="hidden text-[13px] text-ink-3 sm:inline">{identity.nameAlt}</span>
            ) : null}
          </span>
        </a>

        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="link-underline text-[13px] text-ink-2 hover:text-ink">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ModeToggle />
      </div>
    </header>
  );
}

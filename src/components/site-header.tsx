import { navigation, site } from "@/data/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label={`${site.name} — back to top`}>
        <span className="wordmark__mark">LZ</span>
        <span className="wordmark__name">
          Linhua Zhou
          <span>周琳桦</span>
        </span>
      </a>

      <nav className="site-nav" aria-label="Main navigation">
        {navigation.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <a className="header-cta" href="#contact">
        Let&apos;s talk
        <span aria-hidden="true">↗</span>
      </a>
    </header>
  );
}

import { ArrowIcon } from "@/components/arrow-icon";
import { SiteHeader } from "@/components/site-header";
import { TechScreen } from "@/components/tech-screen";
import { contentIndex, projectPlaceholders, site } from "@/data/site";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  alternateName: site.nameZh,
  url: site.url,
};

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <div className="hero-shell" id="top">
        <SiteHeader />
        <main id="main-content">
          <section className="hero" aria-labelledby="hero-title">
            <TechScreen />

            <div className="hero__meta" aria-label="Site status">
              <span>Personal index</span>
              <span>Edition 01 / 2026</span>
            </div>

            <div className="hero__content">
              <p className="hero__kicker">Linhua Zhou / 周琳桦</p>
              <h1 id="hero-title">
                Ideas,
                <br />
                under <span>focus.</span>
              </h1>
              <p className="hero__intro">
                A personal index for selected work, writing, and experiments — designed
                to make the thinking behind the work visible.
              </p>
              <a className="button button--light" href="#index">
                Enter the index
                <ArrowIcon />
              </a>
            </div>

            <p className="hero__scroll">
              <span aria-hidden="true" /> Scroll to explore
            </p>
          </section>
        </main>
      </div>

      <section className="index-section section" id="index" aria-labelledby="index-title">
        <div className="section-label">
          <span>01</span>
          <p>Index</p>
        </div>
        <div className="index-section__heading">
          <h2 id="index-title">A clear place for work in progress.</h2>
          <p>
            The system is intentionally simple: strong hierarchy, open space, and a
            blue-first visual language that lets each future project keep its own voice.
          </p>
        </div>

        <div className="index-list">
          {contentIndex.map((item) => (
            <a className="index-row" href={item.href} key={item.number}>
              <span className="index-row__number">{item.number}</span>
              <span className="index-row__title">{item.title}</span>
              <span className="index-row__note">{item.note}</span>
              <ArrowIcon />
            </a>
          ))}
        </div>
      </section>

      <section className="work-section section" id="work" aria-labelledby="work-title">
        <div className="section-label section-label--light">
          <span>02</span>
          <p>Selected work</p>
        </div>
        <div className="work-section__intro">
          <h2 id="work-title">
            Built around the story,
            <br />
            not just the screenshot.
          </h2>
          <p>
            Project cards are structured as case studies. The copy below is deliberately
            marked as placeholder content until your real project details are available.
          </p>
        </div>

        <div className="project-grid">
          {projectPlaceholders.map((project) => (
            <article
              className={`project-card project-card--${project.tone}`}
              key={project.number}
            >
              <div className="project-card__topline">
                <span>{project.number}</span>
                <span>Content placeholder</span>
              </div>
              <div className="project-card__visual" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className="project-card__copy">
                <p>{project.eyebrow}</p>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-section section" id="about" aria-labelledby="about-title">
        <div className="section-label">
          <span>03</span>
          <p>About the system</p>
        </div>
        <div className="about-section__layout">
          <h2 id="about-title">Technical by nature. Editorial by design.</h2>
          <div className="about-section__copy">
            <p>
              The large screen motif gives the homepage its identity. Beyond the hero,
              thin rules, numbered sections, oversized type, and asymmetric cards keep the
              experience precise without becoming sterile.
            </p>
            <p>
              Everything essential is local and static: no remote fonts, embedded feeds,
              or third-party scripts are required to read the site.
            </p>
          </div>
        </div>

        <div className="principle-grid">
          <div>
            <span>01 / Color</span>
            <strong>Cobalt, sky, ice, white</strong>
          </div>
          <div>
            <span>02 / Type</span>
            <strong>Large, direct, tightly set</strong>
          </div>
          <div>
            <span>03 / Space</span>
            <strong>Wide margins, deliberate rhythm</strong>
          </div>
          <div>
            <span>04 / Motion</span>
            <strong>Quiet, functional, optional</strong>
          </div>
        </div>
      </section>

      <section className="writing-section section" id="writing" aria-labelledby="writing-title">
        <div>
          <p className="writing-section__eyebrow">Notes / Writing</p>
          <h2 id="writing-title">Space reserved for ideas worth returning to.</h2>
        </div>
        <p>
          This section is ready for future writing. No articles or topics have been
          invented for the draft.
        </p>
      </section>

      <footer className="footer section" id="contact">
        <div className="footer__topline">
          <span>04 / Contact</span>
          <span>Details pending</span>
        </div>
        <div className="footer__main">
          <p>Have something in mind?</p>
          <h2>Let&apos;s make it clear.</h2>
        </div>
        <div className="footer__bottom">
          <div className="wordmark wordmark--footer">
            <span className="wordmark__mark">LZ</span>
            <span className="wordmark__name">
              Linhua Zhou
              <span>周琳桦</span>
            </span>
          </div>
          <p>Add your email and professional links here.</p>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}

import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Subpage } from "@/components/subpage";
import { ArrowUpRight } from "@/components/icons";
import { identity, resume } from "@/data/personal";

export const metadata: Metadata = {
  title: "Résumé",
  description:
    "Linhua Zhou's one-page résumé — read it inline or download the PDF.",
  alternates: { canonical: "/resume" },
};

/**
 * The résumé page exists so the PDF has an address on the site rather than
 * being a bare file link, and so both ends of the device range get the reading
 * experience that actually works there.
 *
 * On a laptop the sheet is embedded and read in place. On a phone it is not:
 * iOS Safari renders an embedded PDF as a dead, unscrollable first-page
 * thumbnail — no zoom, no toolbar, no way out — so below `md` the embed is
 * replaced by a full-width card that hands the file to the system viewer,
 * which pinches, scrolls and shares properly. Same file, same URL, two
 * presentations; nothing is hidden from either.
 */
export default function ResumePage() {
  const openInNewTab = { target: "_blank", rel: "noreferrer noopener" } as const;

  return (
    <>
      <SiteHeader current="/resume" />
      <Subpage
        label="Résumé"
        title="The short version, on one page."
        aside={resume.note}
      >
        {/* Actions first: whoever came here for the file should not have to
            scroll past a preview to get it. */}
        <div className="mt-[clamp(28px,4vw,44px)] flex flex-wrap items-center gap-x-3 gap-y-4">
          <a
            href={resume.file}
            {...openInNewTab}
            className="group inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[13px] font-medium text-paper transition-colors duration-300 hover:bg-accent-deep"
          >
            Open the PDF
            <ArrowUpRight className="text-paper/70 transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-paper" />
            <span className="sr-only">— opens in a new tab</span>
          </a>

          <a
            href={resume.file}
            download={resume.downloadAs}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-line-2 bg-paper-2 px-5 text-[13px] font-medium text-ink-2 transition-colors duration-300 hover:border-ink hover:text-ink focus-visible:border-ink"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              focusable="false"
              className="text-ink-3"
            >
              <path
                d="M8 2.6v7.6m0 0L5.2 7.4M8 10.2l2.8-2.8M2.8 12.2v.4a.8.8 0 0 0 .8.8h8.8a.8.8 0 0 0 .8-.8v-.4"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Download
          </a>

          {/* Its own full-width line on a phone, where `ml-auto` would strand it
              right-aligned under the buttons; back on their line from `sm`. */}
          <p className="mono-xs w-full text-ink-3 sm:ml-auto sm:w-auto">
            {resume.pages} · PDF · Updated {resume.updated}
          </p>
        </div>

        {/* Phones and small tablets: a real tap target instead of a PDF embed
            they cannot scroll. */}
        <a
          href={resume.file}
          {...openInNewTab}
          className="cat-card group mt-9 min-h-0 flex-row items-center justify-between gap-5 md:hidden"
        >
          <span className="relative z-[1]">
            <span className="subheading block">Read it here</span>
            <span className="mt-2 block max-w-[34ch] text-[14px] leading-[1.55] text-ink-2">
              Opens the PDF in your reader, where it pinches, scrolls and shares
              like any other document.
            </span>
          </span>
          <span
            aria-hidden="true"
            className="relative z-[1] text-ink-3 transition-transform duration-500 group-hover:translate-x-0.5"
          >
            &rarr;
          </span>
        </a>

        {/* Laptops and up: the sheet itself, at roughly the proportions it
            prints at, sitting on the paper like a physical page. */}
        <figure className="mt-[clamp(32px,4vw,52px)] hidden md:block">
          <div className="mx-auto max-w-[760px] overflow-hidden rounded-md border border-line bg-paper-2 shadow-[var(--shadow-card)]">
            <object
              /* view=FitH sizes the page to the frame's width; navpanes=0 drops
                 the thumbnail rail, which a one-page document has no use for.
                 Both are hints — a viewer that ignores them still shows the
                 document, just at its own default zoom. */
              data={`${resume.file}#view=FitH&navpanes=0`}
              type="application/pdf"
              // Letter proportions, so the frame matches the document rather
              // than boxing it inside grey filler.
              className="block aspect-[8.5/11] w-full"
              aria-label={`${identity.name} — résumé (PDF)`}
            >
              {/* Shown only when the browser has no built-in PDF viewer. */}
              <div className="flex h-full flex-col items-start justify-center gap-3 p-10">
                <p className="lead max-w-[38ch]">
                  Your browser will not display the PDF inline.
                </p>
                <a
                  href={resume.file}
                  {...openInNewTab}
                  className="group inline-flex items-center gap-2 text-[14px] font-medium text-accent"
                >
                  <span className="link-underline">Open it in a new tab</span>
                  <ArrowUpRight className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>
            </object>
          </div>
          <figcaption className="mono-xs mt-4 text-center text-ink-3">
            {identity.name} — résumé, {resume.updated}
          </figcaption>
        </figure>
      </Subpage>
      <SiteFooter />
    </>
  );
}

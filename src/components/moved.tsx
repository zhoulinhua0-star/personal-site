import Link from "next/link";

/**
 * A page that used to live at this path and does not any more.
 *
 * The sections are named Projects, Experiments and Approach, so their URLs say
 * so too — but /work, /lab and /about were the addresses for the site's first
 * months, and they are in Google's index and in whatever links have already
 * been handed out. Deleting them would answer those with a 404.
 *
 * `next.config.ts` has `output: "export"`, and a redirect in a Next config is a
 * server behaviour — with a static export it is silently not applied, and
 * GitHub Pages has no rewrite layer of its own. So the redirect is the one kind
 * a flat file can carry: a meta refresh, which every browser honours without
 * JavaScript. The visible line is for the fraction of a second before it fires,
 * and for anything that ignores it.
 *
 * The page is `noindex`, and names the new URL as its canonical, so a crawler
 * that arrives here credits the destination rather than this stub.
 */
export function Moved({ to, name }: { to: string; name: string }) {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${to}`} />
      <main id="main" className="shell flex min-h-[60vh] flex-col justify-center py-24">
        <p className="label">Moved</p>
        <p className="lead mt-4 max-w-[46ch]">
          This page is now at <code className="mono-xs">{to}</code>.
        </p>
        <Link
          href={to}
          className="link-underline mt-6 inline-flex w-fit items-center gap-2 text-[15px] text-ink"
        >
          Continue to {name}
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </main>
    </>
  );
}

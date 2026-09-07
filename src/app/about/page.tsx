import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Subpage } from "@/components/subpage";
import { about } from "@/data/personal";

export const metadata: Metadata = {
  title: "About",
  description:
    "A developer who likes building the tools other developers end up using — software engineering, AI and agent systems, and the interface layer where they meet.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader current="/about" />
      <Subpage
        number="03"
        label="About"
        title="Engineering with a bias toward things people can actually use."
      >
        <div className="grid gap-[clamp(36px,5vw,80px)] lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-7">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="lead max-w-[58ch] text-[1.0625rem]">
                {paragraph}
              </p>
            ))}
          </div>

          <dl className="lg:col-span-4 lg:col-start-9">
            {about.facts.map((fact) => (
              <div
                key={fact.label}
                className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4 border-t border-line py-4 last:border-b"
              >
                <dt className="label pt-0.5">{fact.label}</dt>
                <dd className="text-[14px] leading-[1.5] text-ink-2">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Subpage>
      <SiteFooter />
    </>
  );
}

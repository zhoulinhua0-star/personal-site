import type { Metadata } from "next";
import { ExperimentList } from "@/components/experiment-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Subpage } from "@/components/subpage";

export const metadata: Metadata = {
  title: "Experiments",
  description:
    "Smaller things — open-source libraries, prototypes, and studies that each answered a question I had.",
  alternates: { canonical: "/experiments" },
};

export default function LabPage() {
  return (
    <>
      <SiteHeader current="/experiments" />
      <Subpage
        number="02"
        label="Experiments"
        title="Open source and small studies."
        aside="Smaller things: libraries, prototypes, and studies that answered a question I had."
      >
        <ExperimentList />
      </Subpage>
      <SiteFooter />
    </>
  );
}

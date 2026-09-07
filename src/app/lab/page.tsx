import type { Metadata } from "next";
import { LabList } from "@/components/lab-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Subpage } from "@/components/subpage";

export const metadata: Metadata = {
  title: "Lab",
  description:
    "Smaller things — open-source libraries, prototypes, and studies that each answered a question I had.",
  alternates: { canonical: "/lab" },
};

export default function LabPage() {
  return (
    <>
      <SiteHeader current="/lab" />
      <Subpage
        number="02"
        label="Lab"
        title="Open source and experiments."
        aside="Smaller things: libraries, prototypes, and studies that answered a question I had."
      >
        <LabList />
      </Subpage>
      <SiteFooter />
    </>
  );
}

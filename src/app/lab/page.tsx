import type { Metadata } from "next";
import { Moved } from "@/components/moved";

export const metadata: Metadata = {
  title: "Moved",
  robots: { index: false, follow: true },
  alternates: { canonical: "/experiments" },
};

export default function ExperimentsRedirect() {
  return <Moved to="/experiments/" name="Experiments" />;
}

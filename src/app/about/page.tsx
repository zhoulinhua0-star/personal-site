import type { Metadata } from "next";
import { Moved } from "@/components/moved";

export const metadata: Metadata = {
  title: "Moved",
  robots: { index: false, follow: true },
  alternates: { canonical: "/approach" },
};

export default function ApproachRedirect() {
  return <Moved to="/approach/" name="Approach" />;
}

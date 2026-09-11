import type { Metadata } from "next";
import { Moved } from "@/components/moved";

export const metadata: Metadata = {
  title: "Moved",
  robots: { index: false, follow: true },
  alternates: { canonical: "/projects" },
};

export default function ProjectsRedirect() {
  return <Moved to="/projects/" name="Projects" />;
}

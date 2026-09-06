import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";

export const metadata: Metadata = {
  title: "Page not found",
  description: "That page does not exist.",
};

export default function NotFound() {
  return (
    <main className="shell flex min-h-dvh flex-col justify-center py-24">
      <p className="label label-accent">Error 404</p>
      <h1 className="display mt-6">Not found</h1>
      <p className="lead mt-6 max-w-[42ch]">
        That page does not exist — it may have been renamed, or never existed at all.
      </p>
      <Link href="/" className="group mt-10 inline-flex items-center gap-2 self-start text-[15px] font-medium text-accent">
        <span className="link-underline">Back to the homepage</span>
        <ArrowUpRight className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>
    </main>
  );
}

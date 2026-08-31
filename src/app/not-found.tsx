import { ArrowIcon } from "@/components/arrow-icon";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <p>404 / Signal lost</p>
      <h1>This page is outside the index.</h1>
      <Link className="button button--light" href="/">
        Return home <ArrowIcon />
      </Link>
    </main>
  );
}

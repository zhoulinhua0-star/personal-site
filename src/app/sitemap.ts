import type { MetadataRoute } from "next";
import { site } from "@/data/personal";

export const dynamic = "force-static";

const routes = [
  { path: "/", priority: 1 },
  { path: "/work/", priority: 0.8 },
  { path: "/lab/", priority: 0.7 },
  { path: "/about/", priority: 0.6 },
  { path: "/resume/", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map(({ path, priority }) => ({
    url: `${site.url}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}

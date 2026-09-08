import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/produtos", priority: 0.9, changeFrequency: "weekly" },
    { path: "/orcamento", priority: 0.8, changeFrequency: "monthly" },
    { path: "/contato", priority: 0.6, changeFrequency: "yearly" },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency,
    priority,
  }));
}

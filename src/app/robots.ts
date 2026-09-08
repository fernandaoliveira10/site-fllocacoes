import type { MetadataRoute } from "next";

import { absoluteUrl, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Admin app — no value in search, and it sits behind auth anyway.
      disallow: ["/dashboard", "/agenda", "/orcamentos", "/login", "/api/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteUrl,
  };
}

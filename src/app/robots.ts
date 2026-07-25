/**
 * Robots.txt Generator for Next.js App Router
 */

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: "https://pizzahouse.eg/sitemap.xml",
  };
}

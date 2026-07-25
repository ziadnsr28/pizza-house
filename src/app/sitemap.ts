/**
 * Sitemap XML Generator for Next.js App Router
 */

import { MetadataRoute } from "next";
import { FULL_MENU_PIZZAS } from "@/constants/landing-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://pizzahouse.eg";

  const pizzaRoutes = FULL_MENU_PIZZAS.map((pizza) => ({
    url: `${baseUrl}/menu/${pizza.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/menu`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/orders`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.5,
    },
    ...pizzaRoutes,
  ];
}

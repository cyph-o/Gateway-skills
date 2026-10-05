import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/brand";

/** Campaign routes are intentionally excluded: they canonicalise to the
 *  evergreen programme pages, so indexing both would split ranking signals. */
const ROUTES = [
  { path: "/", priority: 1 },
  { path: "/programmes/leadership", priority: 0.9 },
  { path: "/programmes/ai-automation", priority: 0.9 },
  { path: "/care-show", priority: 0.7 },
  { path: "/about", priority: 0.6 },
  { path: "/contact", priority: 0.6 },
  { path: "/privacy", priority: 0.3 },
  { path: "/cookies", priority: 0.3 },
  { path: "/accessibility", priority: 0.3 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const lastModified = new Date();
  return ROUTES.map((route) => ({
    url: `${base}${route.path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route.priority,
  }));
}

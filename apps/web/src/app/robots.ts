import type { MetadataRoute } from "next";
import { siteUrl } from "@/content/brand";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Confirmation pages carry a reference in the URL; keep them out of search.
      disallow: ["/enquiry-received", "/api/"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}

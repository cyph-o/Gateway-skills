import type { Metadata } from "next";
import { brand, siteUrl } from "@/content/brand";

interface PageMetaInput {
  title: string;
  description: string;
  /** Path including leading slash, e.g. "/programmes/leadership". */
  path: string;
  /** Campaign pages point their canonical at the evergreen programme page. */
  canonicalPath?: string;
  noIndex?: boolean;
  /** Overrides the shared Open Graph image for this page. */
  image?: string;
}

/**
 * One metadata builder for every route, so no page can quietly ship without a
 * canonical, an Open Graph card or a locale. Descriptions are written per page
 * rather than templated: duplicated descriptions are one of the few on-page
 * signals Google actively discounts.
 */
export function pageMetadata({
  title,
  description,
  path,
  canonicalPath,
  noIndex = false,
  image,
}: PageMetaInput): Metadata {
  const base = siteUrl();
  const canonical = `${base}${canonicalPath ?? path}`;
  const ogImage = image ?? `${base}/opengraph-image`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | ${brand.legalName}`,
      description,
      url: `${base}${path}`,
      siteName: brand.legalName,
      locale: "en_GB",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: brand.strapline }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

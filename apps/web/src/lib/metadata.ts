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
}

export function pageMetadata({
  title,
  description,
  path,
  canonicalPath,
  noIndex = false,
}: PageMetaInput): Metadata {
  const canonical = `${siteUrl()}${canonicalPath ?? path}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | ${brand.legalName}`,
      description,
      url: `${siteUrl()}${path}`,
      siteName: brand.legalName,
      locale: "en_GB",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

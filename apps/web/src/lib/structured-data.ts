import { brand, siteUrl } from "@/content/brand";

/**
 * JSON-LD. Only facts we can actually substantiate go in here: name, address,
 * contact details, and the programmes offered. No aggregateRating or review
 * markup — Gateway does not use testimonials, and inventing them would be both
 * false and a search-spam penalty waiting to happen.
 */
export function organisationSchema() {
  const url = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}/#organisation`,
    name: brand.legalName,
    alternateName: "Gateway Skills Network",
    url,
    logo: `${url}/icon.svg`,
    image: `${url}/opengraph-image`,
    slogan: brand.strapline,
    description:
      "Independent B2B workforce development broker connecting UK employers to " +
      "government-funded higher-level qualifications in leadership, service " +
      "transformation and AI & automation.",
    email: brand.email,
    telephone: brand.telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "71-75 Shelton Street, Covent Garden",
      addressLocality: "London",
      postalCode: "WC2H 9JQ",
      addressCountry: "GB",
    },
    areaServed: { "@type": "Country", name: "United Kingdom" },
    knowsAbout: [
      "Apprenticeship levy funding",
      "Adult social care workforce development",
      "CQC Single Assessment Framework",
      "AI and automation skills",
      "Leadership and management qualifications",
    ],
  };
}

export interface ProgrammeSchemaInput {
  name: string;
  description: string;
  path: string;
}

/** EducationalOccupationalProgram is the correct type for a funded vocational
 *  pathway. Gateway brokers rather than delivers, so the provider is described
 *  as the authorised network rather than claimed as Gateway itself. */
export function programmeSchema({ name, description, path }: ProgrammeSchemaInput) {
  const url = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    name,
    description,
    url: `${url}${path}`,
    programType: "Apprenticeship and funded vocational qualification",
    educationalProgramMode: "part-time",
    occupationalCategory: "Adult social care",
    provider: {
      "@type": "Organization",
      name: "Authorised ESFA registered training providers and Ofsted-approved colleges",
    },
    offers: {
      "@type": "Offer",
      category: "Government funded",
      availability: "https://schema.org/InStock",
      priceCurrency: "GBP",
    },
    sponsor: { "@id": `${url}/#organisation` },
  };
}

export function breadcrumbSchema(trail: readonly { name: string; path: string }[]) {
  const url = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${url}${item.path}`,
    })),
  };
}

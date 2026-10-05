/** Single source of truth for brand identity and public contact details. */

export const brand = {
  legalName: "Gateway Skills Network Ltd",
  wordmarkPrimary: "GATEWAY",
  wordmarkSecondary: "Skills Network Ltd",
  strapline: "Connecting Business to Future Skills",
  disciplines: "Leadership. Service Transformation. AI & Automation.",
  email: "info@gatewayskillsnetwork.co.uk",
  webLabel: "www.gatewayskillsnetwork.co.uk",
} as const;

/**
 * Canonical origin. Vercel injects VERCEL_PROJECT_PRODUCTION_URL on deploys;
 * NEXT_PUBLIC_SITE_URL overrides it once the custom domain is live.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

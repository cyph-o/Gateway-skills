export interface NavItem {
  href: string;
  label: string;
}

/**
 * Primary navigation points at sections of the homepage rather than separate
 * pages, so a visitor exploring the offer scrolls through one narrative
 * instead of reloading. Only genuinely separate destinations get their own
 * route.
 *
 * Care Show routes are intentionally absent — they are campaign destinations
 * reached by QR code, not browsable sections.
 */
export const primaryNav: readonly NavItem[] = [
  { href: "/#leadership", label: "Leadership" },
  { href: "/#ai-automation", label: "AI & Automation" },
  { href: "/#funding", label: "Funding" },
  { href: "/#approach", label: "Approach" },
  { href: "/#enquire", label: "Contact" },
] as const;

/** Full programme detail lives on its own page, linked from each section. */
export const programmeNav: readonly NavItem[] = [
  { href: "/programmes/leadership", label: "Leadership & Service Design" },
  { href: "/programmes/ai-automation", label: "AI & Automation Practitioner" },
  { href: "/about", label: "About Gateway" },
  { href: "/contact", label: "Contact" },
] as const;

export const legalNav: readonly NavItem[] = [
  { href: "/privacy", label: "Privacy notice" },
  { href: "/cookies", label: "Cookies" },
  { href: "/accessibility", label: "Accessibility" },
] as const;

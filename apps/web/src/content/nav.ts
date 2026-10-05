export interface NavItem {
  href: string;
  label: string;
}

/** Primary navigation. Care Show routes are intentionally absent — they are
 *  campaign destinations reached by QR code, not browsable site sections. */
export const primaryNav: readonly NavItem[] = [
  { href: "/programmes/leadership", label: "Leadership" },
  { href: "/programmes/ai-automation", label: "AI & Automation" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const legalNav: readonly NavItem[] = [
  { href: "/privacy", label: "Privacy notice" },
  { href: "/cookies", label: "Cookies" },
  { href: "/accessibility", label: "Accessibility" },
] as const;

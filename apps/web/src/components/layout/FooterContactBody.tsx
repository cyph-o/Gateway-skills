"use client";

import { usePathname } from "next/navigation";
import { footerContact } from "@/content/footer";

/**
 * The footer sits in the root layout, so it cannot see which page it is on.
 * The homepage carries its own call-to-action sentence; every other page
 * keeps the original. Rendered on the server too, so it works without JS.
 */
export function FooterContactBody() {
  return usePathname() === "/" ? footerContact.homeBody : footerContact.body;
}

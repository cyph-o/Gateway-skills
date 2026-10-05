import { LegalDocument } from "@/components/sections/LegalDocument";
import { accessibilityStatement } from "@/content/legal/accessibility";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Accessibility",
  description: "Gateway Skills Network's accessibility commitments and known limitations.",
  path: "/accessibility",
});

export default function AccessibilityPage() {
  return <LegalDocument doc={accessibilityStatement} />;
}

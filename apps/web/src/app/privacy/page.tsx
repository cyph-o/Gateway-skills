import { LegalDocument } from "@/components/sections/LegalDocument";
import { privacyNotice } from "@/content/legal/privacy";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Privacy notice",
  description: "How Gateway Skills Network collects and uses enquiry details.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return <LegalDocument doc={privacyNotice} />;
}

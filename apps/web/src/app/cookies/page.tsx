import { LegalDocument } from "@/components/sections/LegalDocument";
import { cookiePolicy } from "@/content/legal/cookies";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Cookies",
  description: "Gateway Skills Network uses cookieless analytics and sets no tracking cookies.",
  path: "/cookies",
});

export default function CookiesPage() {
  return <LegalDocument doc={cookiePolicy} />;
}

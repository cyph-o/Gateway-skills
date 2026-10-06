import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { LogoLockup } from "@/components/brand/LogoLockup";
import { brand } from "@/content/brand";
import { footerContact } from "@/content/footer";
import { legalNav, programmeNav } from "@/content/nav";
import { Container } from "./Container";
import { CorporateStatement } from "./CorporateStatement";

const year = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer data-surface="forest" className="mt-24 bg-forest">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.2fr_1fr] md:gap-16">
          <div>
            <LogoLockup tone="forest" />
            <p className="mt-6 max-w-md font-display text-2xl text-on-forest md:text-3xl">
              {footerContact.heading}
            </p>
            <p className="mt-4 max-w-md leading-relaxed">{footerContact.body}</p>
            <address className="mt-6 space-y-3 not-italic">
              <a
                href={`mailto:${brand.email}`}
                className="flex items-center gap-2 text-emerald-lift underline decoration-emerald-lift/40 underline-offset-4 transition-colors hover:decoration-emerald-lift"
              >
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                {brand.email}
              </a>
              <a
                href={brand.telephoneHref}
                className="flex items-center gap-2 text-emerald-lift underline decoration-emerald-lift/40 underline-offset-4 transition-colors hover:decoration-emerald-lift"
              >
                <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                {brand.telephone}
              </a>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{brand.address}</span>
              </p>
            </address>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <nav aria-label="Footer">
              <h2 className="label-mono text-emerald-lift">Programmes</h2>
              <ul className="mt-5 space-y-3">
                {programmeNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="transition-colors hover:text-on-forest">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Legal">
              <h2 className="label-mono text-emerald-lift">Legal</h2>
              <ul className="mt-5 space-y-3">
                {legalNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="transition-colors hover:text-on-forest">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </Container>

      <CorporateStatement />

      <Container className="flex flex-wrap items-center justify-between gap-4 py-6">
        <p className="label-mono text-on-forest-muted">
          © {year} {brand.legalName}
        </p>
        <p className="label-mono text-on-forest-muted">{brand.webLabel}</p>
      </Container>
    </footer>
  );
}

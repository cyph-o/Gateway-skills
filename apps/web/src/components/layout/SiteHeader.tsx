import Link from "next/link";
import { LogoLockup } from "@/components/brand/LogoLockup";
import { ButtonLink } from "@/components/primitives/Button";
import { primaryNav } from "@/content/nav";
import { Container } from "./Container";
import { MobileNav } from "./MobileNav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ground/90 backdrop-blur-sm">
      <Container className="flex h-18 items-center justify-between gap-6">
        <Link href="/" aria-label={"Gateway Skills Network home"} className="shrink-0">
          <LogoLockup size="sm" />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[0.9375rem] text-ink transition-colors hover:text-emerald"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* Visibility lives on a wrapper, not on the button: `hidden` and the
              button's own `inline-flex` are both display utilities of equal
              specificity, so stylesheet order — not class order — would decide
              the winner, and the button would never actually hide. */}
          <span className="hidden sm:block">
            <ButtonLink href="/contact">Check funding</ButtonLink>
          </span>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}

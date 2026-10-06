import { Container } from "@/components/layout/Container";
import { trustBanner } from "@/content/home";

/** Horizontal trust strip directly beneath the hero. */
export function TrustBanner() {
  return (
    <div className="border-b border-emerald/20 bg-emerald/8">
      <Container className="py-5">
        <p className="text-center text-sm leading-relaxed font-medium text-ink-strong md:text-base">
          {trustBanner}
        </p>
      </Container>
    </div>
  );
}

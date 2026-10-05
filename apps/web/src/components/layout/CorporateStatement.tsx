import { corporateStatement } from "@/content/footer";
import { Container } from "./Container";

/** The compliance disclosure, reproduced verbatim at the base of every page. */
export function CorporateStatement() {
  return (
    <div className="border-t border-on-forest-line/60 py-8">
      <Container>
        <p className="max-w-5xl text-[0.8125rem] leading-relaxed text-on-forest-muted">
          {corporateStatement}
        </p>
      </Container>
    </div>
  );
}

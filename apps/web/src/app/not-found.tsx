import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/primitives/Button";
import { Eyebrow } from "@/components/primitives/Eyebrow";

export default function NotFound() {
  return (
    <Container width="text" className="py-24 md:py-32">
      <Eyebrow>Error 404</Eyebrow>
      <h1 className="mt-6 text-display-md">We could not find that page</h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-muted">
        The link may be out of date. Both funded programmes are listed below.
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <ButtonLink href="/programmes/leadership" size="lg">
          Leadership programme
        </ButtonLink>
        <ButtonLink href="/programmes/ai-automation" size="lg" variant="outline">
          AI &amp; Automation programme
        </ButtonLink>
      </div>
    </Container>
  );
}

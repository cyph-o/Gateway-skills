import { Mail } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/primitives/Button";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { brand } from "@/content/brand";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Enquiry received",
  description: "Your funding audit enquiry has been received.",
  path: "/enquiry-received",
  noIndex: true,
});

/** Reference is displayed only — it is a public handle, not a secret, and is
 *  never used to look anything up from the client. */
export default async function EnquiryReceivedPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const reference = typeof ref === "string" ? ref.slice(0, 16) : null;

  return (
    <Container width="text" className="py-20 md:py-28">
      <Eyebrow>Enquiry received</Eyebrow>
      <h1 className="mt-6 text-display-md">
        Thank you — your funding audit request is with our advisers
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-muted">
        A senior adviser will be in touch directly to confirm your levy position and the
        funded cohorts your organisation qualifies for. We use the details you provided to
        respond to this enquiry.
      </p>

      {reference ? (
        <div className="mt-10 border-t border-line pt-6">
          <p className="label-mono text-ink-muted">Your reference</p>
          <p className="mt-2 font-display text-3xl text-ink-strong">{reference}</p>
          <p className="mt-3 text-sm text-ink-muted">
            Quote this if you contact us before we reach you.
          </p>
        </div>
      ) : null}

      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/" size="lg" variant="outline">
          Back to Gateway
        </ButtonLink>
        <a
          href={`mailto:${brand.email}`}
          className="inline-flex min-h-13 items-center gap-2 rounded-sm px-5 text-base text-emerald underline decoration-emerald/30 underline-offset-4 hover:decoration-emerald"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          {brand.email}
        </a>
      </div>
    </Container>
  );
}

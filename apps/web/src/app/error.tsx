"use client";

import { useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/primitives/Button";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { brand } from "@/content/brand";

/**
 * Last-resort boundary. It must never imply an enquiry was lost: if a
 * submission reached the database it is already safe, and if it did not the
 * visitor needs a route that does not depend on this page working.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(JSON.stringify({ level: "error", event: "ui.boundary", digest: error.digest }));
  }, [error]);

  return (
    <Container width="text" className="py-24 md:py-32">
      <Eyebrow>Something went wrong</Eyebrow>
      <h1 className="mt-6 text-display-md">This page could not load</h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-muted">
        Please try again. If you were sending us an enquiry and did not see a confirmation
        reference, email us directly and we will pick it up.
      </p>
      <div className="mt-9 flex flex-wrap items-center gap-3">
        <Button size="lg" onClick={reset}>
          Try again
        </Button>
        <a
          href={`mailto:${brand.email}`}
          className="inline-flex min-h-13 items-center px-5 text-emerald underline decoration-emerald/30 underline-offset-4 hover:decoration-emerald"
        >
          {brand.email}
        </a>
      </div>
    </Container>
  );
}

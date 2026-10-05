import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import type { LegalDocument as LegalDocumentData } from "@/content/legal/types";

const formatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** Single renderer for every legal page, so they cannot drift apart in
 *  structure, typography or reading width. */
export function LegalDocument({ doc }: { doc: LegalDocumentData }) {
  return (
    <Container width="text" className="py-16 md:py-24">
      <Eyebrow>{doc.version ? `Version ${doc.version}` : "Legal"}</Eyebrow>
      <h1 className="mt-6 text-display-md">{doc.title}</h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-muted">{doc.standfirst}</p>
      <p className="label-mono mt-6 text-ink-muted">
        Last updated {formatter.format(new Date(doc.updated))}
      </p>

      {doc.sections.map((section) => (
        <section key={section.heading} className="mt-12 border-t border-line pt-8">
          <h2 className="text-2xl">{section.heading}</h2>
          {section.paragraphs?.map((p) => (
            <p key={p} className="mt-4 leading-relaxed text-ink">
              {p}
            </p>
          ))}
          {section.bullets ? (
            <ul className="mt-4 space-y-2">
              {section.bullets.map((b) => (
                <li key={b} className="flex gap-3 leading-relaxed text-ink">
                  <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 bg-emerald" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </Container>
  );
}

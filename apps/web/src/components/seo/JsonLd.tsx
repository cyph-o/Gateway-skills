/**
 * Renders JSON-LD. The payload is built from our own typed modules, never from
 * user input, so there is nothing injectable here — but it is still serialised
 * with the closing-tag sequence escaped, which is the one way a string inside
 * JSON can break out of a script element.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/primitives/Icon";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import type { SectionHeader } from "@/content/types";

interface TwinListsProps {
  header: SectionHeader;
  left: { title: string; items: readonly string[] };
  right: { title: string; items: readonly string[] };
}

/** Two parallel checklists — what participants learn, and what they build.
 *  Paired because neither list means much without the other. */
export function TwinLists({ header, left, right }: TwinListsProps) {
  return (
    <section className="border-t border-line bg-ground py-20 md:py-28">
      <Container>
        <SectionHeading {...header} />
        <div className="mt-14 grid gap-px bg-line md:grid-cols-2">
          {[left, right].map((column) => (
            <div key={column.title} className="bg-ground p-7 md:p-10">
              <h3 className="label-mono text-emerald">{column.title}</h3>
              <ul className="mt-6 space-y-4">
                {column.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <Icon name="badge-check" className="h-5 w-5 shrink-0 text-emerald" />
                    <span className="leading-relaxed text-ink">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

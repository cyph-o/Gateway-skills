import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/primitives/Icon";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import type { RoleItem, SectionHeader } from "@/content/types";

/** The five eligible internal roles. Answers the question a care owner asks
 *  first: who on my existing payroll can actually do this? */
export function RoleGrid({
  header,
  items,
}: {
  header: SectionHeader;
  items: readonly RoleItem[];
}) {
  return (
    <section className="border-t border-line bg-surface py-20 md:py-28">
      <Container>
        <SectionHeading {...header} />
        <ul className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.label} className="flex items-center gap-4 bg-surface p-6">
              <Icon name={item.icon} className="h-6 w-6 shrink-0 text-emerald" />
              <span className="font-sans text-[0.9375rem] leading-snug font-medium text-ink-strong">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

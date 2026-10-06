import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/primitives/Icon";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import type { Proposition, SectionHeader } from "@/content/types";

type Capability = Proposition & { href: string };

/** Three routes into the offer. Cards sit on white with a hairline and a
 *  colour bar that fills on hover — structure without drop shadows. */
export function CapabilityCards({
  header,
  items,
}: {
  header: SectionHeader;
  items: readonly Capability[];
}) {
  return (
    <section className="border-t border-line bg-surface py-16 md:py-24">
      <Container>
        <SectionHeading {...header} />
        <ul className="reveal-stagger mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <li key={item.title}>
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-md border border-line bg-ground p-7 transition-colors hover:border-emerald/40 hover:bg-mist/40 md:p-8"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-emerald/10 text-emerald transition-colors group-hover:bg-emerald group-hover:text-white">
                  <Icon name={item.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-6 text-xl leading-snug md:text-2xl">{item.title}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-ink-muted">{item.body}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-emerald">
                  View programme
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

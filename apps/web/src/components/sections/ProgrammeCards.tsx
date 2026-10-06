import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/primitives/Icon";
import { SectionHeading } from "@/components/primitives/SectionHeading";
import type { ProgrammeCard } from "@/content/home";
import type { SectionHeader } from "@/content/types";

/** The three funded routes. Cards stretch to equal height so the grid stays
 *  level even though one carries a role list the others do not. */
export function ProgrammeCards({
  header,
  items,
}: {
  header: SectionHeader;
  items: readonly ProgrammeCard[];
}) {
  return (
    <section id="programmes" className="scroll-mt-24 border-t border-line bg-surface py-16 md:py-24">
      <Container>
        <SectionHeading {...header} />

        <ul className="reveal-stagger mt-12 grid items-stretch gap-6 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.title} className="flex">
              <Link
                href={item.href}
                className="group flex flex-1 flex-col rounded-md border border-line bg-ground p-7 transition-colors hover:border-emerald/40 hover:bg-mist/40 md:p-8"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-emerald/10 text-emerald transition-colors group-hover:bg-emerald group-hover:text-white">
                  <Icon name={item.icon} className="h-5 w-5" />
                </span>

                <h3 className="mt-6 text-xl leading-snug">{item.title}</h3>

                {item.fundingTag ? (
                  <span className="mt-4 inline-flex w-fit rounded-full bg-emerald px-3 py-1 text-xs font-semibold text-white">
                    {item.fundingTag}
                  </span>
                ) : null}

                <p className="mt-4 leading-relaxed text-ink-muted">{item.body}</p>

                {item.roles ? (
                  <ul className="mt-5 space-y-2 border-t border-line pt-5">
                    {item.roles.map((role) => (
                      <li key={role} className="flex gap-2 text-sm leading-snug text-ink">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald" aria-hidden="true" />
                        {role}
                      </li>
                    ))}
                  </ul>
                ) : null}

                <span className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-medium text-emerald">
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

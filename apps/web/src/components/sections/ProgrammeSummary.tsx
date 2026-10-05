import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Icon } from "@/components/primitives/Icon";
import type { Proposition } from "@/content/types";

interface ProgrammeSummaryProps {
  eyebrow: string;
  heading: string;
  items: readonly Proposition[];
  href: string;
  linkLabel: string;
  tone?: "surface" | "ground";
}

/** Compact three-up summary beneath each overlay chapter, with one route on
 *  to the full programme page. */
export function ProgrammeSummary({
  eyebrow,
  heading,
  items,
  href,
  linkLabel,
  tone = "surface",
}: ProgrammeSummaryProps) {
  return (
    <section
      className={`border-t border-line py-16 md:py-20 ${
        tone === "surface" ? "bg-surface" : "bg-ground"
      }`}
    >
      <Container>
        <div className="reveal flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="mt-4 text-display-sm">{heading}</h2>
          </div>
          <Link
            href={href}
            className="group inline-flex items-center gap-2 text-sm font-medium text-emerald"
          >
            {linkLabel}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        <ul className="reveal-stagger mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
          {items.map((item) => (
            <li key={item.title} className="border-t-2 border-emerald/25 pt-5">
              <Icon name={item.icon} className="h-6 w-6 text-emerald" />
              <h3 className="mt-4 text-lg leading-snug">{item.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

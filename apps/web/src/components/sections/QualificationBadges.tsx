import { Icon } from "@/components/primitives/Icon";
import type { QualificationBadge } from "@/content/types";

/**
 * Four qualification marks as labelled rows rather than cramped chips — the
 * full awarding-body titles are long, and truncating a qualification name is
 * exactly the kind of imprecision this sector notices.
 */
export function QualificationBadges({ items }: { items: readonly QualificationBadge[] }) {
  return (
    // Light tiles that may sit inside a forest hero: data-surface resets the
    // inherited dark-surface text colours, or the headings render light on a
    // light tile and vanish.
    <ul
      data-surface="light"
      className="reveal-stagger grid grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-4"
    >
      {items.map((item) => (
        <li key={item.label} className="bg-ground p-5 md:p-6">
          <Icon name={item.icon} className="h-6 w-6 text-emerald" />
          <h2 className="mt-4 font-sans text-[0.9375rem] leading-snug font-semibold text-ink-strong">
            {item.label}
          </h2>
          {item.detail ? (
            <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-muted">{item.detail}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

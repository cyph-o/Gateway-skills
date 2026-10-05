const nodes = [
  { cx: 40, cy: 60, r: 4.5, delay: 0 },
  { cx: 150, cy: 28, r: 3.5, delay: 0.6 },
  { cx: 252, cy: 86, r: 5.5, delay: 1.2 },
  { cx: 104, cy: 148, r: 4, delay: 0.3 },
  { cx: 214, cy: 196, r: 4.5, delay: 0.9 },
  { cx: 58, cy: 236, r: 3.5, delay: 1.5 },
  { cx: 286, cy: 288, r: 4, delay: 0.45 },
  { cx: 148, cy: 300, r: 5, delay: 1.05 },
] as const;

const edges = [
  "M40 60 150 28 252 86",
  "M40 60 104 148 214 196",
  "M150 28 104 148",
  "M252 86 214 196 286 288",
  "M104 148 58 236 148 300",
  "M214 196 148 300",
  "M58 236 40 60",
] as const;

/**
 * Decorative node field for hero compositions — the brand mark's geometry at
 * page scale. Pure inline SVG: no bitmap, no library, nothing to download on
 * event wifi. The pulse is suppressed globally by the reduced-motion rule.
 */
export function NetworkField({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 326 340"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="currentColor" strokeWidth="1" opacity="0.28" strokeLinecap="round">
        {edges.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g fill="currentColor">
        {nodes.map((n) => (
          <circle
            key={`${n.cx}-${n.cy}`}
            cx={n.cx}
            cy={n.cy}
            r={n.r}
            className="animate-pulse"
            style={{ animationDelay: `${n.delay}s`, animationDuration: "4s" }}
          />
        ))}
      </g>
    </svg>
  );
}

/** Pointy-top regular hexagon as an SVG points string. */
function hexagon(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = ((60 * i - 90) * Math.PI) / 180;
    return `${(cx + r * Math.cos(angle)).toFixed(2)},${(cy + r * Math.sin(angle)).toFixed(2)}`;
  }).join(" ");
}

/** Hexagonal "stations" anchor the outer frame. */
const STATIONS = [
  { cx: 7, cy: 12 },
  { cx: 7, cy: 30 },
  { cx: 33, cy: 12 },
  { cx: 33, cy: 30 },
] as const;

/** Circular "hubs" carry the zigzag through the centre. */
const HUBS = [
  { cx: 14, cy: 26, r: 2.5 },
  { cx: 20, cy: 8, r: 3.2 },
  { cx: 26, cy: 26, r: 2.5 },
] as const;

interface NodeMarkProps {
  className?: string;
}

/**
 * Gateway mark — built from Louis's concept: hexagonal data stations wired to
 * circular hubs along an angular path that peaks at the centre.
 *
 * Refined for small sizes: four stations hold a stable frame so the silhouette
 * still reads at 16px favicon scale, where the original's denser lattice would
 * close up. Monochrome via `currentColor` so it inverts cleanly on forest
 * sections and survives a single-colour print.
 */
export function NodeMark({ className = "" }: NodeMarkProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {/* Outer frame: the gateway posts */}
      <g strokeWidth="1.4" strokeLinecap="round" opacity="0.4">
        <path d="M7 12v18M33 12v18" />
      </g>

      {/* Zigzag circuit, peaking at the apex hub */}
      <g strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 12 14 26 20 8 26 26 33 12" />
        <path d="M14 26 7 30M26 26 33 30" />
      </g>

      <g fill="currentColor" stroke="none">
        {STATIONS.map((s) => (
          <polygon key={`${s.cx}-${s.cy}`} points={hexagon(s.cx, s.cy, 3.4)} />
        ))}
        {HUBS.map((h) => (
          <circle key={`${h.cx}-${h.cy}`} cx={h.cx} cy={h.cy} r={h.r} />
        ))}
      </g>
    </svg>
  );
}

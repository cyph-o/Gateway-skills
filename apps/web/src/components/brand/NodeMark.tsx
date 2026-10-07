import type { CSSProperties } from "react";

/**
 * Coordinates are traced from the master logo artwork (1699×926 px) and kept
 * in that space; the viewBox crops to the mark. Gaps in the crossing lines
 * are drawn as separate segments so the weave reads on any background.
 */
const LINES = [
  "M158 360V565", // left rail
  "M192 343 258 384M292 406 338 437", // top-left node to centre, passing under
  "M158 465H232L350 295", // left rail up to top hub
  "M392 295 465 388", // top hub down to the centre-right line
  "M405 440 565 318", // centre to top-right node
  "M205 588 340 488", // bottom-left node to centre
  "M408 482 455 510M490 532 560 578", // centre to bottom-right, passing under
  "M293 525 352 610", // branch down to bottom hub
  "M396 612 515 455H598", // bottom hub up to right rail
  "M598 342V553", // right rail
] as const;

/** Hollow hubs: centre, ring radius, stroke width, colour. */
const RINGS = [
  { cx: 370, cy: 265, r: 29.5, w: 25, color: "#1c8fd0" },
  { cx: 373, cy: 462, r: 31.5, w: 25, color: "#1aa3d6" },
  { cx: 376, cy: 645, r: 29, w: 26, color: "#1747a6" },
] as const;

/**
 * Fixed rather than from useId so the mark also renders in next/og. Every
 * instance defines identical gradients, so duplicate ids resolve the same.
 */
const LINE_GRADIENT = "gateway-mark-line";
const GREEN_GRADIENT = "gateway-mark-green";

interface NodeMarkProps {
  className?: string;
  /** For next/og, which ignores className. */
  style?: CSSProperties;
}

/**
 * Gateway mark: a network of nodes and circuit lines, blue through to green.
 * Hubs are rings rather than discs-with-holes so the background shows through
 * on both light and forest sections.
 */
export function NodeMark({ className = "", style }: NodeMarkProps) {
  return (
    <svg
      viewBox="90 218 572 474"
      className={className}
      style={style}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={LINE_GRADIENT}
          gradientUnits="userSpaceOnUse"
          x1="150"
          y1="620"
          x2="610"
          y2="280"
        >
          <stop offset="0" stopColor="#1747a6" />
          <stop offset="0.55" stopColor="#1a9fd4" />
          <stop offset="1" stopColor="#5cc12c" />
        </linearGradient>
        <linearGradient id={GREEN_GRADIENT} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9bd318" />
          <stop offset="1" stopColor="#3fae4a" />
        </linearGradient>
      </defs>

      <g
        stroke={`url(#${LINE_GRADIENT})`}
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {LINES.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      {/* Top-left station: rounded square with a punched hole */}
      <path
        fill="#1747a6"
        fillRule="evenodd"
        d="M122 272h62a14 14 0 0 1 14 14v62a14 14 0 0 1-14 14h-62a14 14 0 0 1-14-14v-62a14 14 0 0 1 14-14ZM153 299a17 17 0 1 0 0 34a17 17 0 1 0 0-34Z"
      />

      {RINGS.map((ring) => (
        <circle
          key={`${ring.cx}-${ring.cy}`}
          cx={ring.cx}
          cy={ring.cy}
          r={ring.r}
          stroke={ring.color}
          strokeWidth={ring.w}
        />
      ))}

      {/* Top-right node in green */}
      <circle
        cx="606"
        cy="288"
        r="38"
        stroke={`url(#${GREEN_GRADIENT})`}
        strokeWidth="32"
      />

      {/* Lit nodes: solid outer with a bright core */}
      <circle cx="158" cy="625" r="62" fill="#1747a6" />
      <circle cx="158" cy="625" r="32" fill="#35b4e6" />
      <circle cx="598" cy="603" r="50" fill="#1e7fd0" />
      <circle cx="598" cy="603" r="28" fill="#79cdf2" />
    </svg>
  );
}

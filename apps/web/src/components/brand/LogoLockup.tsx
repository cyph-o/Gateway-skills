import { brand } from "@/content/brand";
import { NodeMark } from "./NodeMark";

interface LogoLockupProps {
  className?: string;
  /** "forest" inverts the lockup for dark sections. */
  tone?: "default" | "forest";
  size?: "sm" | "md";
}

/**
 * The first A of GATEWAY: a crossbar-less A whose counter holds a green
 * triangle, pointing up like the network's path forward.
 */
function GatewayA() {
  return (
    <svg
      viewBox="0 0 84 100"
      className="mx-[0.02em] inline-block h-[0.72em] w-auto align-baseline"
      aria-hidden="true"
      focusable="false"
    >
      <path fill="currentColor" d="M0 100 32 0h20l32 100H62L42 38 22 100Z" />
      <path fill="var(--signal)" d="M29 100 42 60l13 40Z" />
    </svg>
  );
}

/**
 * GATEWAY in heavy caps with "Skills Network Ltd" beneath, set beside the
 * network mark. Presentational only; callers wrap it in a link.
 */
export function LogoLockup({
  className = "",
  tone = "default",
  size = "md",
}: LogoLockupProps) {
  const primaryTone = tone === "forest" ? "text-white" : "text-ink-strong";
  // The action token, not a lighter tint: at 10px bold the lighter blue
  // measured 3.26:1 on the header ground, below the 4.5:1 AA floor, and the
  // lockup sits in the header of every page.
  const secondaryTone = tone === "forest" ? "text-emerald-lift" : "text-emerald";
  const markSize = size === "sm" ? "h-9" : "h-11";
  const primarySize = size === "sm" ? "text-lg" : "text-xl md:text-2xl";
  const [first, , ...rest] = brand.wordmarkPrimary;

  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <NodeMark className={`${markSize} w-auto shrink-0`} />
      <span className="flex flex-col leading-none">
        <span
          className={`font-sans font-extrabold tracking-[0.04em] ${primarySize} ${primaryTone}`}
        >
          <span className="sr-only">{brand.wordmarkPrimary}</span>
          <span aria-hidden="true">
            {first}
            <GatewayA />
            {rest.join("")}
          </span>
        </span>
        <span
          className={`mt-1 font-sans text-[0.625rem] font-bold tracking-[0.08em] uppercase ${secondaryTone}`}
        >
          {brand.wordmarkSecondary}
        </span>
      </span>
    </span>
  );
}

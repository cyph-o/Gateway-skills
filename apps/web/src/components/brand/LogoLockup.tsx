import { brand } from "@/content/brand";
import { NodeMark } from "./NodeMark";

interface LogoLockupProps {
  className?: string;
  /** "forest" inverts the lockup for dark sections. */
  tone?: "default" | "forest";
  size?: "sm" | "md";
}

/**
 * GATEWAY in bold caps with "Skills Network Ltd" beneath in a lighter weight,
 * set beside the node mark. Presentational only — callers wrap it in a link.
 */
export function LogoLockup({ className = "", tone = "default", size = "md" }: LogoLockupProps) {
  const primaryTone = tone === "forest" ? "text-white" : "text-forest";
  const secondaryTone = tone === "forest" ? "text-on-forest-muted" : "text-ink-muted";
  const markTone = tone === "forest" ? "text-emerald-lift" : "text-emerald";
  const markSize = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const primarySize = size === "sm" ? "text-base" : "text-lg md:text-xl";

  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <NodeMark className={`${markSize} shrink-0 ${markTone}`} />
      <span className="flex flex-col leading-none">
        <span
          className={`font-sans font-bold tracking-[0.1em] ${primarySize} ${primaryTone}`}
        >
          {brand.wordmarkPrimary}
        </span>
        <span
          className={`mt-1 font-sans text-[0.625rem] font-light tracking-[0.18em] uppercase ${secondaryTone}`}
        >
          {brand.wordmarkSecondary}
        </span>
      </span>
    </span>
  );
}

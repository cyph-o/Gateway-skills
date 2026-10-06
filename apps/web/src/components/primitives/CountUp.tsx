"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: number;
  suffix?: string;
  /** Milliseconds for the full count. */
  duration?: number;
}

/** Decelerating ease so the number settles rather than stopping dead. */
const easeOut = (t: number) => 1 - (1 - t) ** 3;

/**
 * Counts up once, when the figure first scrolls into view.
 *
 * Renders the final value on the server and for anyone who prefers reduced
 * motion, so the number is correct before any JavaScript runs — the animation
 * is decoration layered on top, never the source of the content.
 */
export function CountUp({ value, suffix = "", duration = 1600 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries, obs) => {
        if (!entries[0]?.isIntersecting) return;
        obs.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          setDisplay(Math.round(easeOut(progress) * value));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        setDisplay(0);
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {display.toLocaleString("en-GB")}
      {suffix}
    </span>
  );
}

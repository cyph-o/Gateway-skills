"use client";

import { useEffect } from "react";

const SELECTOR = ".reveal, .reveal-image, .reveal-left, .reveal-right, .reveal-stagger > *";

/**
 * Fallback reveals for browsers without scroll-driven animations.
 *
 * The CSS path (`animation-timeline: view()`) is gated behind @supports, so in
 * Firefox — and in Safari before 26 — nothing animated at all. That is almost
 * certainly why the site looked static.
 *
 * Ordering here is deliberate and the whole point: the opt-in class is only
 * added once an IntersectionObserver exists to take responsibility for
 * revealing things. If anything throws, or the observer never fires, a
 * failsafe reveals everything. Content is never left hidden by a decoration.
 */
export function RevealEngine() {
  useEffect(() => {
    const root = document.documentElement;

    const supportsTimeline =
      typeof CSS !== "undefined" &&
      CSS.supports?.("animation-timeline: view()") &&
      CSS.supports?.("animation-range: entry");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (supportsTimeline || reducedMotion || !("IntersectionObserver" in window)) return;

    const targets = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
    if (targets.length === 0) return;

    const revealAll = () => {
      for (const el of targets) el.classList.add("is-revealed");
    };

    let observer: IntersectionObserver | undefined;
    try {
      observer = new IntersectionObserver(
        (entries, obs) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("is-revealed");
            obs.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
      );
      // Only now is it safe to let CSS hide them.
      root.classList.add("js-reveals");
      for (const el of targets) observer.observe(el);
    } catch {
      revealAll();
      return;
    }

    // Belt and braces: whatever happens, nothing stays invisible.
    const failsafe = window.setTimeout(revealAll, 2500);

    return () => {
      window.clearTimeout(failsafe);
      observer?.disconnect();
      root.classList.remove("js-reveals");
    };
  }, []);

  return null;
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { legalNav, primaryNav } from "@/content/nav";

/** Disclosure nav for small screens. Closes on route change via pathname key
 *  in the parent tree, and on Escape. Focus returns to the trigger on close. */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    // No body scroll lock. Setting `overflow: hidden` on <body> makes it a
    // scroll container, which stops the sticky header sticking — the panel is
    // anchored to that header, so opening the menu part-way down the page threw
    // it off-screen entirely. The panel scrolls internally instead (max-h +
    // overflow-y-auto), so there is nothing to lock.
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-line-strong text-ink-strong"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        {open ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Menu className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      <div
        id="mobile-nav-panel"
        hidden={!open}
        className="absolute inset-x-0 top-full z-40 max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-b border-line bg-ground px-6 pt-6 pb-10 shadow-sm"
      >
        <nav aria-label="Primary, mobile">
          <ul className="flex flex-col divide-y divide-line">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-4 font-display text-xl text-ink-strong"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          {legalNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="label-mono text-ink-muted"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

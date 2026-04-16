"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRightLeft, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinkClass = cn(
  "px-3 py-1.5 text-sm rounded-md transition-colors",
  "text-dim hover:text-ink hover:bg-raised"
);

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on outside click
  useEffect(() => {
    if (!mobileOpen) return;

    function handleClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileOpen]);

  // Close mobile menu on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [mobileOpen]);

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-40 border-b border-edge bg-canvas/90 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Logo / wordmark */}
          <Link
            href="/"
            className="flex items-center gap-2.5 text-ink hover:text-violet transition-colors"
            aria-label="Sitecore Migration Simulator — home"
          >
            <span
              className="flex h-7 w-7 items-center justify-center rounded-md
                         bg-[color-mix(in_srgb,var(--color-violet)_15%,transparent)]
                         border border-[color-mix(in_srgb,var(--color-violet)_30%,transparent)]"
              aria-hidden="true"
            >
              <ArrowRightLeft size={14} className="text-violet" />
            </span>
            <span className="text-sm font-semibold">
              Sitecore{" "}
              <span className="text-dim font-normal">Migration Simulator</span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Site navigation" className="hidden md:flex items-center gap-1">
            <a href="#simulator" className={navLinkClass}>
              Simulator
            </a>
            <a href="#roadmap" className={navLinkClass}>
              Roadmap
            </a>
            <Link
              href="/print/checklist"
              target="_blank"
              rel="noopener noreferrer"
              className={navLinkClass}
            >
              Checklist
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-md
                       text-dim hover:text-ink hover:bg-raised transition-colors"
          >
            {mobileOpen ? (
              <X size={18} aria-hidden="true" />
            ) : (
              <Menu size={18} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="md:hidden border-t border-edge bg-canvas/95 backdrop-blur-sm"
        >
          <ul className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex flex-col gap-1">
            <li>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  document
                    .getElementById("simulator")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className={cn(navLinkClass, "w-full text-left")}
              >
                Simulator
              </button>
            </li>
            <li>
              <Link
                href="/print/checklist"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className={cn(navLinkClass, "block w-full")}
              >
                Checklist
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

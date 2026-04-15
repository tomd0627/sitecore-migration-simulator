import Link from "next/link";
import { ArrowRightLeft, Github } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-edge bg-canvas/90 backdrop-blur-sm">
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
            <span className="text-sm font-semibold hidden sm:block">
              Sitecore{" "}
              <span className="text-dim font-normal">Migration Simulator</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav aria-label="Site navigation">
            <ul className="flex items-center gap-1">
              <li>
                <a
                  href="#simulator"
                  className="px-3 py-1.5 text-sm text-dim hover:text-ink
                             rounded-md hover:bg-raised transition-colors"
                >
                  Simulator
                </a>
              </li>
              <li>
                <a
                  href="#roadmap"
                  className="px-3 py-1.5 text-sm text-dim hover:text-ink
                             rounded-md hover:bg-raised transition-colors"
                >
                  Roadmap
                </a>
              </li>
              <li>
                <Link
                  href="/print/checklist"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-sm text-dim hover:text-ink
                             rounded-md hover:bg-raised transition-colors"
                >
                  Checklist
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

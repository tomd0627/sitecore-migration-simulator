import { cn } from "@/lib/utils";
import type { PreparedStep } from "@/data/types";

interface CodeComparisonProps {
  before: PreparedStep["before"];
  after: PreparedStep["after"];
}

export function CodeComparison({ before, after }: CodeComparisonProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {/* Before — Sitecore */}
      <figure className="flex flex-col min-w-0">
        <figcaption className="flex items-center gap-2 px-3 py-2 bg-sitecore-muted rounded-t-lg border border-b-0 border-[color-mix(in_srgb,var(--color-sitecore)_30%,transparent)]">
          <span
            className="w-2 h-2 rounded-full bg-sitecore shrink-0"
            aria-hidden="true"
          />
          <span className="text-xs font-medium text-sitecore truncate">
            {before.label}
          </span>
        </figcaption>
        <div
          className={cn(
            "flex-1 overflow-auto rounded-b-lg",
            "border border-t-0 border-[color-mix(in_srgb,var(--color-sitecore)_30%,transparent)]",
            "bg-[#0d1117] p-4"
          )}
        >
          <div
            dangerouslySetInnerHTML={{ __html: before.highlightedHtml }}
            className="text-xs"
          />
        </div>
      </figure>

      {/* After — Next.js */}
      <figure className="flex flex-col min-w-0">
        <figcaption className="flex items-center gap-2 px-3 py-2 bg-nextjs-muted rounded-t-lg border border-b-0 border-[color-mix(in_srgb,var(--color-nextjs)_30%,transparent)]">
          <span
            className="w-2 h-2 rounded-full bg-nextjs shrink-0"
            aria-hidden="true"
          />
          <span className="text-xs font-medium text-nextjs truncate">
            {after.label}
          </span>
        </figcaption>
        <div
          className={cn(
            "flex-1 overflow-auto rounded-b-lg",
            "border border-t-0 border-[color-mix(in_srgb,var(--color-nextjs)_30%,transparent)]",
            "bg-[#0d1117] p-4"
          )}
        >
          <div
            dangerouslySetInnerHTML={{ __html: after.highlightedHtml }}
            className="text-xs"
          />
        </div>
      </figure>
    </div>
  );
}

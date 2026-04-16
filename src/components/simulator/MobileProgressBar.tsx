"use client";

import { cn } from "@/lib/utils";

const TOTAL_STEPS = 10;

interface MobileProgressBarProps {
  currentStep: number;
  completedCount: number;
}

export function MobileProgressBar({
  currentStep,
  completedCount,
}: MobileProgressBarProps) {
  const progressPct = Math.round((completedCount / TOTAL_STEPS) * 100);

  return (
    <div className="md:hidden mb-6 p-4 bg-surface rounded-xl border border-edge">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-dim">
          Step{" "}
          <span className="text-ink font-semibold">{currentStep + 1}</span>
          {" / "}
          {TOTAL_STEPS}
        </span>
        <span className="text-xs text-success">
          {completedCount} completed
        </span>
      </div>

      {/* Progress track */}
      <div
        className="relative h-1.5 bg-edge rounded-full overflow-hidden mb-3"
        role="progressbar"
        aria-valuenow={progressPct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Migration progress: ${progressPct}%`}
      >
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-nextjs transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="flex gap-1 flex-wrap" aria-hidden="true">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <span
            key={i}
            className={cn(
              "w-2 h-2 rounded-full transition-colors duration-200",
              i < completedCount
                ? "bg-success"
                : i === currentStep
                ? "bg-violet"
                : "bg-edge"
            )}
          />
        ))}
      </div>

    </div>
  );
}

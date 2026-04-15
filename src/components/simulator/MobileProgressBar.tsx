"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TOTAL_STEPS = 10;

interface MobileProgressBarProps {
  currentStep: number;
  completedCount: number;
  onPrev: () => void;
  onNext: () => void;
}

export function MobileProgressBar({
  currentStep,
  completedCount,
  onPrev,
  onNext,
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

      {/* Nav buttons */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={onPrev}
          disabled={currentStep === 0}
          aria-label="Previous step"
          className={cn(
            "flex-1 flex items-center justify-center gap-1 py-1.5",
            "text-xs rounded-lg border border-edge transition-colors",
            "disabled:opacity-30 disabled:cursor-not-allowed",
            "hover:bg-raised hover:text-ink text-dim"
          )}
        >
          <ChevronLeft size={14} aria-hidden="true" />
          Prev
        </button>
        <button
          onClick={onNext}
          disabled={currentStep === TOTAL_STEPS - 1}
          aria-label="Next step"
          className={cn(
            "flex-1 flex items-center justify-center gap-1 py-1.5",
            "text-xs rounded-lg border border-edge transition-colors",
            "disabled:opacity-30 disabled:cursor-not-allowed",
            "hover:bg-raised hover:text-ink text-dim"
          )}
        >
          Next
          <ChevronRight size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

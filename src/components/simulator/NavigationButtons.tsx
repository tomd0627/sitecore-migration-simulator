"use client";

import { AlertTriangle, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationButtonsProps {
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  canProceed?: boolean;
  showWarning?: boolean;
}

export function NavigationButtons({
  onPrev,
  onNext,
  isFirst,
  isLast,
  canProceed = true,
  showWarning = false,
}: NavigationButtonsProps) {
  return (
    <div className="flex items-center justify-between pt-6 border-t border-edge mt-6">
      <button
        type="button"
        onClick={onPrev}
        disabled={isFirst}
        aria-label="Go to previous step"
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-xl",
          "text-sm font-medium transition-all duration-150",
          "border border-edge",
          "disabled:opacity-30 disabled:cursor-not-allowed",
          "hover:bg-raised hover:text-ink text-dim"
        )}
      >
        <ChevronLeft size={16} aria-hidden="true" />
        Previous
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={isLast}
        aria-label={
          isLast
            ? "Simulation complete"
            : canProceed
            ? "Go to next step"
            : "Select an approach to continue"
        }
        className={cn(
          "flex items-center gap-2 px-5 py-2.5 rounded-xl",
          "text-sm font-semibold transition-all duration-150",
          isLast
            ? "bg-success/20 text-success border border-success/30 cursor-default"
            : showWarning
            ? "bg-caution/10 text-caution border border-caution/40 ring-2 ring-caution/20"
            : "bg-violet text-canvas hover:bg-[color-mix(in_srgb,var(--color-violet)_85%,white)] active:scale-[0.98]"
        )}
      >
        {isLast ? (
          <>
            <CheckCircle size={16} aria-hidden="true" />
            Complete
          </>
        ) : showWarning ? (
          <>
            <AlertTriangle size={16} aria-hidden="true" />
            Next Step
          </>
        ) : (
          <>
            Next Step
            <ChevronRight size={16} aria-hidden="true" />
          </>
        )}
      </button>
    </div>
  );
}

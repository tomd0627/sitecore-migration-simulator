"use client";

import { CheckCircle2, Download, RotateCcw } from "lucide-react";

interface CompletionScreenProps {
  onReset: () => void;
}

export function CompletionScreen({ onReset }: CompletionScreenProps) {
  function handlePrintChecklist() {
    window.open("/print/checklist", "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex flex-col items-center text-center py-12 px-6 space-y-6">
      {/* Icon */}
      <div
        className="w-16 h-16 rounded-full bg-success/10 border border-success/30
                    flex items-center justify-center"
        aria-hidden="true"
      >
        <CheckCircle2 size={32} className="text-success" />
      </div>

      {/* Heading */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-ink">
          Migration path complete
        </h2>
        <p className="text-sm text-dim max-w-md leading-relaxed">
          You&apos;ve reviewed all 10 decisions across the four migration phases.
          Download the printable checklist to use in your planning meetings.
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-6 py-4 border-y border-edge w-full max-w-sm justify-center">
        {[
          { label: "Steps Reviewed", value: "10" },
          { label: "Phases", value: "4" },
          { label: "Decision Points", value: "30+" },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <p className="text-2xl font-bold text-nextjs">{value}</p>
            <p className="text-xs text-dim mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <button
          onClick={handlePrintChecklist}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3
                     bg-nextjs text-canvas text-sm font-semibold rounded-xl
                     hover:bg-[color-mix(in_srgb,var(--color-nextjs)_85%,white)]
                     active:scale-[0.98] transition-all duration-150"
        >
          <Download size={16} aria-hidden="true" />
          Download Checklist
        </button>
        <button
          onClick={onReset}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3
                     border border-edge text-sm text-dim font-medium rounded-xl
                     hover:bg-raised hover:text-ink active:scale-[0.98]
                     transition-all duration-150"
        >
          <RotateCcw size={16} aria-hidden="true" />
          Start Over
        </button>
      </div>
    </div>
  );
}

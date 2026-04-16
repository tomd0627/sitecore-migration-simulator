"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import type { DecisionOption } from "@/data/types";

interface DecisionPointProps {
  decisions: DecisionOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  stepId: number;
  showValidation?: boolean;
}

export function DecisionPoint({
  decisions,
  selectedId,
  onSelect,
  stepId,
  showValidation = false,
}: DecisionPointProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  const groupName = `step-${stepId}-decision`;

  return (
    <fieldset>
      <legend className="text-sm font-semibold text-ink mb-3">
        Choose your approach
      </legend>

      <div className="space-y-2">
        {decisions.map((decision) => {
          const isSelected = selectedId === decision.id;
          const isExpanded = expandedId === decision.id;

          return (
            <div
              key={decision.id}
              className={cn(
                "rounded-xl border transition-all duration-150",
                "has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-violet/50 has-[input:focus-visible]:ring-offset-1",
                isSelected
                  ? "border-violet bg-violet-muted"
                  : "border-edge bg-surface hover:border-[color-mix(in_srgb,var(--color-edge)_50%,var(--color-faint))]"
              )}
            >
              {/* Option header row */}
              <div className="flex items-start gap-2 p-4">
                {/* Label covers radio + content — full card selection */}
                <label className="flex items-start gap-3 flex-1 cursor-pointer min-w-0">
                  <input
                    type="radio"
                    name={groupName}
                    value={decision.id}
                    checked={isSelected}
                    onChange={() => onSelect(decision.id)}
                    className="sr-only peer"
                  />
                  {/* Custom radio indicator */}
                  <span
                    className={cn(
                      "mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors",
                      "peer-focus-visible:ring-2 peer-focus-visible:ring-violet/50 peer-focus-visible:ring-offset-1",
                      isSelected ? "border-violet bg-violet" : "border-faint"
                    )}
                    aria-hidden="true"
                  >
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-canvas" />
                    )}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-ink">
                        {decision.title}
                      </span>
                      {decision.recommended && (
                        <Badge variant="nextjs">
                          <CheckCircle2 size={10} aria-hidden="true" />
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-dim leading-relaxed">
                      {decision.description}
                    </p>
                  </div>
                </label>

                {/* Expand trade-offs toggle — outside label so it doesn't trigger selection */}
                <button
                  type="button"
                  onClick={() => toggleExpand(decision.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`tradeoffs-${decision.id}`}
                  aria-label={isExpanded ? "Hide trade-offs" : "Show trade-offs"}
                  className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center
                             border border-edge text-dim hover:text-ink hover:bg-raised
                             transition-colors"
                >
                  {isExpanded ? (
                    <Minus size={13} aria-hidden="true" />
                  ) : (
                    <Plus size={13} aria-hidden="true" />
                  )}
                </button>
              </div>

              {/* Trade-offs panel */}
              {isExpanded && (
                <div id={`tradeoffs-${decision.id}`} className="px-4 pb-4 pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-edge">
                    <div>
                      <p className="text-xs font-semibold text-success mb-2 flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full bg-success/20 flex items-center justify-center"
                          aria-hidden="true"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-success" />
                        </span>
                        Advantages
                      </p>
                      <ul className="space-y-1.5" aria-label="Advantages">
                        {decision.pros.map((pro) => (
                          <li
                            key={pro}
                            className="text-xs text-dim leading-relaxed flex gap-2"
                          >
                            <span
                              className="text-success mt-0.5 shrink-0"
                              aria-hidden="true"
                            >
                              +
                            </span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-caution mb-2 flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full bg-caution/20 flex items-center justify-center"
                          aria-hidden="true"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-caution" />
                        </span>
                        Trade-offs
                      </p>
                      <ul className="space-y-1.5" aria-label="Trade-offs">
                        {decision.cons.map((con) => (
                          <li
                            key={con}
                            className="text-xs text-dim leading-relaxed flex gap-2"
                          >
                            <span
                              className="text-caution mt-0.5 shrink-0"
                              aria-hidden="true"
                            >
                              −
                            </span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Inline validation message */}
      {showValidation && !selectedId && (
        <p
          role="alert"
          className="flex items-center gap-1.5 mt-3 text-xs text-caution"
        >
          <AlertTriangle size={12} aria-hidden="true" />
          Select an approach before continuing.
        </p>
      )}
    </fieldset>
  );
}

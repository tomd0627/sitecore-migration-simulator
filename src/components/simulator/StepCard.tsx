import { Badge } from "@/components/ui/Badge";
import { CodeComparison } from "./CodeComparison";
import { DecisionPoint } from "./DecisionPoint";
import { PracticalNote } from "./PracticalNote";
import type { PreparedStep, Severity } from "@/data/types";
import { SEVERITY_LABELS, PHASE_LABELS } from "@/lib/utils";
import { AlertOctagon, Star, Info } from "lucide-react";

const severityConfig: Record<
  Severity,
  {
    variant: "critical" | "recommended" | "optional";
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }
> = {
  "architecture-critical": { variant: "critical", icon: AlertOctagon },
  recommended: { variant: "recommended", icon: Star },
  optional: { variant: "optional", icon: Info },
};

interface StepCardProps {
  step: PreparedStep;
  selectedDecision: string | null;
  onDecisionSelect: (id: string) => void;
}

export function StepCard({
  step,
  selectedDecision,
  onDecisionSelect,
}: StepCardProps) {
  const { variant, icon: SeverityIcon } = severityConfig[step.severity];

  return (
    <article aria-labelledby={`step-title-${step.id}`} className="space-y-6">
      {/* Step header */}
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="neutral">
            Phase {step.phase} — {PHASE_LABELS[step.phase]}
          </Badge>
          <Badge variant={variant}>
            <SeverityIcon size={10} aria-hidden="true" />
            {SEVERITY_LABELS[step.severity]}
          </Badge>
        </div>

        <div>
          <p className="text-xs font-mono text-faint mb-1" aria-hidden="true">
            Step {String(step.id).padStart(2, "0")} / 10
          </p>
          <h2
            id={`step-title-${step.id}`}
            className="text-xl sm:text-2xl font-bold text-ink leading-snug"
          >
            {step.title}
          </h2>
          <p className="text-sm text-dim mt-1">{step.subtitle}</p>
        </div>
      </header>

      {/* Context */}
      <section aria-labelledby={`context-${step.id}`}>
        <h3 id={`context-${step.id}`} className="sr-only">
          Context
        </h3>
        <p className="text-sm text-dim leading-relaxed border-l-2 border-edge pl-4">
          {step.context}
        </p>
      </section>

      {/* Code comparison */}
      <section aria-labelledby={`code-${step.id}`}>
        <h3
          id={`code-${step.id}`}
          className="text-xs font-semibold text-faint uppercase tracking-wider mb-3"
        >
          Code Comparison
        </h3>
        <CodeComparison before={step.before} after={step.after} />
      </section>

      {/* Decision points */}
      <section aria-labelledby={`decisions-${step.id}`}>
        <h3
          id={`decisions-${step.id}`}
          className="text-xs font-semibold text-faint uppercase tracking-wider mb-3"
        >
          Architecture Decision
        </h3>
        <DecisionPoint
          decisions={step.decisions}
          selectedId={selectedDecision}
          onSelect={onDecisionSelect}
        />
      </section>

      {/* Practical note */}
      <PracticalNote note={step.practicalNote} />
    </article>
  );
}

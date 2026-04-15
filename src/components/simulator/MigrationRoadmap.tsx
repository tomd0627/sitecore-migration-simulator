"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";

const PHASES = [
  {
    id: 1,
    title: "Audit & Architecture",
    color: "violet",
    stepIds: [1, 2, 3],
  },
  {
    id: 2,
    title: "Component Migration",
    color: "sitecore",
    stepIds: [4, 5, 6],
  },
  {
    id: 3,
    title: "Advanced Features",
    color: "nextjs",
    stepIds: [7, 8, 9],
  },
  {
    id: 4,
    title: "DevOps & Launch",
    color: "success",
    stepIds: [10],
  },
] as const;

const STEP_TITLES: Record<number, string> = {
  1: "Assess Your Installation",
  2: "Choose Headless Approach",
  3: "Rendering Mode Decision",
  4: "Map SXA Renderings",
  5: "Integrate Layout Service",
  6: "Migrate Media Library",
  7: "Migrate Personalization",
  8: "Migrate Search",
  9: "Multisite Configuration",
  10: "CI/CD Pipeline Setup",
};

const phaseColorClass: Record<string, string> = {
  violet: "text-violet",
  sitecore: "text-sitecore",
  nextjs: "text-nextjs",
  success: "text-success",
};

const phaseDotClass: Record<string, string> = {
  violet: "bg-violet",
  sitecore: "bg-sitecore",
  nextjs: "bg-nextjs",
  success: "bg-success",
};

interface MigrationRoadmapProps {
  currentStep: number;
  completedSteps: Set<number>;
  onSelect: (index: number) => void;
}

export function MigrationRoadmap({
  currentStep,
  completedSteps,
  onSelect,
}: MigrationRoadmapProps) {
  return (
    <nav aria-label="Migration roadmap" className="relative">
      {/* Vertical connecting line */}
      <div
        className="absolute left-2 top-4 bottom-4 w-px bg-edge"
        aria-hidden="true"
      />

      <ol className="space-y-5">
        {PHASES.map((phase) => (
          <li key={phase.id}>
            {/* Phase header */}
            <div className="flex items-center gap-3 mb-2">
              <span
                className={cn(
                  "relative z-10 w-5 h-5 rounded-full border-2 border-canvas flex-shrink-0",
                  phaseDotClass[phase.color]
                )}
                aria-hidden="true"
              />
              <span
                className={cn(
                  "text-xs font-semibold uppercase tracking-wider",
                  phaseColorClass[phase.color]
                )}
              >
                Phase {phase.id} — {phase.title}
              </span>
            </div>

            {/* Steps list */}
            <ol className="ml-8 space-y-0.5" aria-label={`Phase ${phase.id} steps`}>
              {phase.stepIds.map((stepId) => {
                const stepIndex = stepId - 1;
                const isCurrent = stepIndex === currentStep;
                const isCompleted = completedSteps.has(stepIndex);

                return (
                  <li key={stepId}>
                    <button
                      onClick={() => onSelect(stepIndex)}
                      aria-current={isCurrent ? "step" : undefined}
                      aria-label={`Step ${stepId}: ${STEP_TITLES[stepId]}${isCompleted ? " (completed)" : ""}`}
                      className={cn(
                        "w-full text-left flex items-center gap-2.5 px-2.5 py-1.5",
                        "rounded-md text-xs transition-all duration-150",
                        isCurrent
                          ? "bg-raised text-ink font-medium"
                          : "text-dim hover:text-ink hover:bg-raised/50",
                        isCompleted && !isCurrent && "text-faint"
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2
                          size={13}
                          className="text-success shrink-0"
                          aria-hidden="true"
                        />
                      ) : (
                        <Circle
                          size={13}
                          className={cn(
                            "shrink-0",
                            isCurrent ? "text-violet" : "text-faint"
                          )}
                          aria-hidden="true"
                        />
                      )}
                      <span className="leading-tight">
                        <span className="text-faint mr-1">
                          {String(stepId).padStart(2, "0")}
                        </span>
                        {STEP_TITLES[stepId]}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </li>
        ))}
      </ol>
    </nav>
  );
}

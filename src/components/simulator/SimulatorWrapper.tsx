"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PreparedStep } from "@/data/types";
import { CompletionScreen } from "./CompletionScreen";
import { MigrationRoadmap } from "./MigrationRoadmap";
import { MobileProgressBar } from "./MobileProgressBar";
import { NavigationButtons } from "./NavigationButtons";
import { StepCard } from "./StepCard";

interface SimulatorWrapperProps {
  steps: PreparedStep[];
}

export function SimulatorWrapper({ steps }: SimulatorWrapperProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(
    new Set()
  );
  const [selectedDecisions, setSelectedDecisions] = useState<
    Record<number, string>
  >({});
  const [finished, setFinished] = useState(false);
  const [attemptedNext, setAttemptedNext] = useState(false);

  const stepContentRef = useRef<HTMLDivElement>(null);

  const scrollToTop = useCallback(() => {
    stepContentRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const currentStepHasDecision = steps[currentStep]?.decisions?.length > 0;
  const currentDecisionMade = !!selectedDecisions[currentStep];
  const canProceed = !currentStepHasDecision || currentDecisionMade;
  const showValidation = attemptedNext && !canProceed;

  const goToStep = useCallback(
    (index: number) => {
      setCurrentStep(index);
      setAttemptedNext(false);
      setFinished(false);
      scrollToTop();
    },
    [scrollToTop]
  );

  const handleNext = useCallback(() => {
    if (!canProceed) {
      setAttemptedNext(true);
      return;
    }
    setAttemptedNext(false);
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      scrollToTop();
    } else {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setFinished(true);
      scrollToTop();
    }
  }, [canProceed, currentStep, steps.length, scrollToTop]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setFinished(false);
      scrollToTop();
    }
  }, [currentStep, scrollToTop]);

  const handleDecisionSelect = useCallback(
    (decisionId: string) => {
      setAttemptedNext(false);
      setSelectedDecisions((prev) => ({
        ...prev,
        [currentStep]: decisionId,
      }));
    },
    [currentStep]
  );

  const handleReset = useCallback(() => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setSelectedDecisions({});
    setFinished(false);
    scrollToTop();
  }, [scrollToTop]);

  // Announce step changes to screen readers
  const [announcement, setAnnouncement] = useState("");
  useEffect(() => {
    if (!finished) {
      setAnnouncement(
        `Step ${currentStep + 1} of ${steps.length}: ${steps[currentStep].title}`
      );
    } else {
      setAnnouncement("Migration simulation complete. All 10 steps reviewed.");
    }
  }, [currentStep, finished, steps]);

  const currentStepData = steps[currentStep];

  return (
    <div className="relative">
      {/* Screen reader live region */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Mobile progress bar */}
      <MobileProgressBar
        currentStep={currentStep}
        completedCount={completedSteps.size}
      />

      <div className="flex gap-8">
        {/* Desktop sidebar roadmap */}
        <aside
          id="roadmap"
          className="hidden md:block w-64 shrink-0 sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto"
          aria-label="Migration roadmap navigation"
        >
          <div className="p-4 bg-surface rounded-xl border border-edge">
            <p className="text-xs font-semibold text-faint uppercase tracking-wider mb-4">
              Migration Roadmap
            </p>
            <MigrationRoadmap
              currentStep={currentStep}
              completedSteps={completedSteps}
              onSelect={goToStep}
            />

            {/* Progress summary */}
            <div className="mt-5 pt-4 border-t border-edge">
              <div className="flex justify-between text-xs text-dim mb-2">
                <span>Progress</span>
                <span className="text-success">
                  {completedSteps.size} / {steps.length}
                </span>
              </div>
              <div
                className="h-1.5 bg-edge rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={Math.round(
                  (completedSteps.size / steps.length) * 100
                )}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Overall migration progress"
              >
                <div
                  className="h-full bg-nextjs rounded-full transition-all duration-500"
                  style={{
                    width: `${(completedSteps.size / steps.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Main step content */}
        <main
          id="main-content"
          className="flex-1 min-w-0"
          ref={stepContentRef}
          tabIndex={-1}
        >
          <div className="bg-surface rounded-2xl border border-edge p-6 sm:p-8">
            {finished ? (
              <CompletionScreen onReset={handleReset} />
            ) : (
              <>
                <StepCard
                  step={currentStepData}
                  selectedDecision={
                    selectedDecisions[currentStep] ?? null
                  }
                  onDecisionSelect={handleDecisionSelect}
                  showValidation={showValidation}
                />
                <NavigationButtons
                  onPrev={handlePrev}
                  onNext={handleNext}
                  isFirst={currentStep === 0}
                  isLast={currentStep === steps.length - 1}
                  canProceed={canProceed}
                  showWarning={showValidation}
                />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

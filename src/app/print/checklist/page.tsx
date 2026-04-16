"use client";

import { useEffect } from "react";
import { checklistPhases } from "@/data/checklist";

export default function ChecklistPage() {
  // Auto-print when opened from the simulator's download button
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("autoprint") === "1") {
      const timer = setTimeout(() => window.print(), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {/* ── Print trigger button (hidden when printing) ─────────── */}
      <div className="print:hidden bg-canvas min-h-screen">
        <div className="max-w-3xl mx-auto px-6 pt-8 pb-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-xl font-bold text-ink">
                Migration Checklist
              </h1>
              <p className="text-sm text-dim mt-1">
                Sitecore SXA → Headless Next.js
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-violet text-canvas
                         text-sm font-semibold rounded-xl hover:bg-[color-mix(in_srgb,var(--color-violet)_85%,white)]
                         transition-colors"
            >
              Print / Save PDF
            </button>
          </div>

          <p className="text-sm text-dim mb-8 p-4 bg-surface rounded-xl border border-edge">
            This checklist covers every key decision and task in the four-phase
            migration. Items marked{" "}
            <span className="font-semibold text-sitecore">critical</span> should
            be addressed before go-live. Print or save as PDF for use in planning
            meetings.
          </p>

          <ChecklistContent />
        </div>
      </div>

      {/* ── Print-only layout ────────────────────────────────────── */}
      <div className="hidden print:block">
        <style>{`
          @page {
            margin: 1.5cm 2cm;
            size: A4;
          }
          body {
            font-family: Georgia, 'Times New Roman', serif;
            font-size: 10.5pt;
            color: #000;
            background: #fff;
          }
          .print-title {
            font-size: 18pt;
            font-weight: bold;
            margin-bottom: 2pt;
          }
          .print-subtitle {
            font-size: 11pt;
            color: #555;
            margin-bottom: 16pt;
            border-bottom: 1pt solid #ccc;
            padding-bottom: 8pt;
          }
          .print-phase {
            margin-top: 14pt;
            margin-bottom: 6pt;
            font-size: 11pt;
            font-weight: bold;
            padding: 4pt 0;
            border-bottom: 1.5pt solid #333;
          }
          .print-item {
            display: flex;
            align-items: flex-start;
            gap: 8pt;
            padding: 3pt 0;
            border-bottom: 0.5pt solid #eee;
            font-size: 9.5pt;
          }
          .print-checkbox {
            width: 10pt;
            height: 10pt;
            border: 1pt solid #555;
            border-radius: 2pt;
            flex-shrink: 0;
            margin-top: 1pt;
          }
          .print-critical {
            color: #c0392b;
            font-size: 7.5pt;
            font-weight: bold;
            margin-left: 4pt;
            text-transform: uppercase;
          }
          .print-footer {
            margin-top: 20pt;
            font-size: 8pt;
            color: #999;
            border-top: 0.5pt solid #ccc;
            padding-top: 6pt;
            text-align: center;
          }
        `}</style>

        <p className="print-title">Sitecore Migration Checklist</p>
        <p className="print-subtitle">
          Sitecore SXA → Headless Next.js · 4 phases · 44 checklist items
        </p>

        {checklistPhases.map((phase) => (
          <div key={phase.phase}>
            <p className="print-phase">
              Phase {phase.phase} — {phase.title}
            </p>
            {phase.items.map((item) => (
              <div key={item.id} className="print-item">
                <div className="print-checkbox" aria-hidden="true" />
                <span>
                  {item.text}
                  {item.critical && (
                    <span className="print-critical"> ★ Critical</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

// ── Screen version of checklist ───────────────────────────────────────────
function ChecklistContent() {
  return (
    <div className="space-y-8">
      {checklistPhases.map((phase) => (
        <section key={phase.phase} aria-labelledby={`phase-${phase.phase}`}>
          <div className="flex items-center gap-3 mb-4">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: phase.color }}
              aria-hidden="true"
            />
            <h2
              id={`phase-${phase.phase}`}
              className="text-sm font-bold text-ink"
            >
              Phase {phase.phase} — {phase.title}
            </h2>
            <span className="text-xs text-faint">
              ({phase.items.length} items)
            </span>
          </div>

          <ul className="space-y-2" aria-label={`${phase.title} checklist`}>
            {phase.items.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-3 p-3 bg-surface rounded-lg border border-edge"
              >
                {/* Checkbox */}
                <div
                  className="w-4 h-4 rounded border border-edge flex-shrink-0 mt-0.5"
                  role="checkbox"
                  aria-checked="false"
                  aria-label={item.text}
                  tabIndex={0}
                />
                <span className="text-sm text-dim flex-1 leading-snug">
                  {item.text}
                </span>
                {item.critical && (
                  <span
                    className="text-xs font-semibold text-sitecore flex-shrink-0"
                    aria-label="Critical item"
                  >
                    ★
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

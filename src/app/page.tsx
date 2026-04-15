import { steps as rawSteps } from "@/data/steps";
import { highlight } from "@/lib/highlight";
import type { PreparedStep } from "@/data/types";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SimulatorWrapper } from "@/components/simulator/SimulatorWrapper";
import {
  Search,
  Layers,
  Rocket,
  ClipboardList,
  ArrowRight,
  Download,
} from "lucide-react";

// ── Build-time step preparation (Shiki runs server-side) ─────────────────
async function prepareSteps(): Promise<PreparedStep[]> {
  return Promise.all(
    rawSteps.map(async (step) => ({
      ...step,
      before: {
        ...step.before,
        highlightedHtml: await highlight(step.before.code, step.before.language),
      },
      after: {
        ...step.after,
        highlightedHtml: await highlight(step.after.code, step.after.language),
      },
    }))
  );
}

// ── Phase overview data ───────────────────────────────────────────────────
const phases = [
  {
    number: 1,
    title: "Audit & Architecture",
    description:
      "Catalogue your Sitecore install, choose the headless approach, and map rendering modes before writing a line of code.",
    icon: Search,
    stepCount: 3,
    colorClass: "text-violet",
    bgClass: "bg-violet-muted",
    borderClass: "border-[color-mix(in_srgb,var(--color-violet)_30%,transparent)]",
  },
  {
    number: 2,
    title: "Component Migration",
    description:
      "Map SXA renderings to React components, wire the Layout Service, and migrate the Media Library to next/image.",
    icon: Layers,
    stepCount: 3,
    colorClass: "text-sitecore",
    bgClass: "bg-sitecore-muted",
    borderClass: "border-[color-mix(in_srgb,var(--color-sitecore)_30%,transparent)]",
  },
  {
    number: 3,
    title: "Advanced Features",
    description:
      "Migrate personalization, replace Solr search, and configure multisite middleware routing.",
    icon: ClipboardList,
    stepCount: 3,
    colorClass: "text-nextjs",
    bgClass: "bg-nextjs-muted",
    borderClass: "border-[color-mix(in_srgb,var(--color-nextjs)_30%,transparent)]",
  },
  {
    number: 4,
    title: "DevOps & Launch",
    description:
      "Replace TDS/Unicorn pipelines with GitHub Actions and atomic Netlify deploys.",
    icon: Rocket,
    stepCount: 1,
    colorClass: "text-success",
    bgClass: "bg-[color-mix(in_srgb,var(--color-success)_8%,transparent)]",
    borderClass: "border-[color-mix(in_srgb,var(--color-success)_25%,transparent)]",
  },
];

// ── Page ─────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const preparedSteps = await prepareSteps();

  return (
    <>
      <Header />

      <main>
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section
          aria-labelledby="hero-heading"
          className="relative overflow-hidden border-b border-edge"
        >
          {/* Background gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-[0.04]
                            bg-violet blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-[0.04]
                            bg-nextjs blur-[120px]" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            {/* Label */}
            <div className="flex items-center gap-2 mb-6">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                               bg-sitecore-muted border border-[color-mix(in_srgb,var(--color-sitecore)_30%,transparent)]
                               text-sitecore">
                <span className="w-1.5 h-1.5 rounded-full bg-sitecore" aria-hidden="true" />
                Sitecore SXA
              </span>
              <span className="text-faint" aria-hidden="true">→</span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                               bg-nextjs-muted border border-[color-mix(in_srgb,var(--color-nextjs)_30%,transparent)]
                               text-nextjs">
                <span className="w-1.5 h-1.5 rounded-full bg-nextjs" aria-hidden="true" />
                Headless Next.js
              </span>
            </div>

            {/* Heading */}
            <h1
              id="hero-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink leading-tight max-w-3xl"
            >
              The decisions you&apos;ll face{" "}
              <span className="text-violet">migrating Sitecore</span>{" "}
              to headless Next.js
            </h1>

            <p className="mt-4 text-base sm:text-lg text-dim max-w-2xl leading-relaxed">
              An interactive walkthrough of every architecture decision in a
              Sitecore SXA → headless Next.js migration. Real code examples.
              Real trade-offs. No hand-waving.
            </p>

            {/* Stats */}
            <div
              className="flex flex-wrap gap-6 mt-8 text-sm"
              aria-label="Project statistics"
            >
              {[
                { value: "10", label: "migration steps" },
                { value: "4", label: "phases" },
                { value: "30+", label: "decision points" },
                { value: "20+", label: "real code examples" },
              ].map(({ value, label }) => (
                <div key={label} className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-violet">{value}</span>
                  <span className="text-dim">{label}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mt-8">
              <a
                href="#simulator"
                className="inline-flex items-center gap-2 px-5 py-2.5
                           bg-violet text-canvas text-sm font-semibold rounded-xl
                           hover:bg-[color-mix(in_srgb,var(--color-violet)_85%,white)]
                           transition-colors"
              >
                Start Simulation
                <ArrowRight size={15} aria-hidden="true" />
              </a>
              <a
                href="/print/checklist"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5
                           border border-edge text-sm text-dim font-medium rounded-xl
                           hover:bg-raised hover:text-ink transition-colors"
              >
                <Download size={15} aria-hidden="true" />
                Download Checklist
              </a>
            </div>
          </div>
        </section>

        {/* ── Phase overview ───────────────────────────────────────── */}
        <section
          aria-labelledby="phases-heading"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12"
        >
          <h2
            id="phases-heading"
            className="text-lg font-bold text-ink mb-6"
          >
            Migration phases
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {phases.map((phase) => {
              const Icon = phase.icon;
              return (
                <div
                  key={phase.number}
                  className={`rounded-xl border p-5 ${phase.bgClass} ${phase.borderClass}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center
                                  bg-canvas/40 ${phase.colorClass}`}
                      aria-hidden="true"
                    >
                      <Icon size={16} />
                    </div>
                    <span className="text-xs font-mono text-faint">
                      Phase {phase.number}
                    </span>
                  </div>
                  <h3 className={`text-sm font-semibold mb-2 ${phase.colorClass}`}>
                    {phase.title}
                  </h3>
                  <p className="text-xs text-dim leading-relaxed">
                    {phase.description}
                  </p>
                  <p className="text-xs text-faint mt-3">
                    {phase.stepCount} step{phase.stepCount !== 1 ? "s" : ""}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Simulator ────────────────────────────────────────────── */}
        <section
          id="simulator"
          aria-labelledby="simulator-heading"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16"
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              id="simulator-heading"
              className="text-lg font-bold text-ink"
            >
              Interactive simulator
            </h2>
            <a
              href="/print/checklist"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5
                         text-xs text-dim border border-edge rounded-lg
                         hover:bg-raised hover:text-ink transition-colors"
            >
              <Download size={13} aria-hidden="true" />
              Checklist PDF
            </a>
          </div>

          <SimulatorWrapper steps={preparedSteps} />
        </section>
      </main>

      <Footer />
    </>
  );
}

export type Phase = 1 | 2 | 3 | 4;

export type Severity = "architecture-critical" | "recommended" | "optional";

export interface CodeExample {
  label: string;
  language: string;
  code: string;
  highlightedHtml?: string;
}

export interface DecisionOption {
  id: string;
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  recommended?: boolean;
}

export interface Step {
  id: number;
  phase: Phase;
  title: string;
  subtitle: string;
  context: string;
  severity: Severity;
  before: CodeExample;
  after: CodeExample;
  decisions: DecisionOption[];
  practicalNote: string;
}

export interface PreparedStep extends Omit<Step, "before" | "after"> {
  before: Required<CodeExample>;
  after: Required<CodeExample>;
}

export interface ChecklistItem {
  id: string;
  text: string;
  critical: boolean;
}

export interface ChecklistPhase {
  phase: Phase;
  title: string;
  color: string;
  items: ChecklistItem[];
}

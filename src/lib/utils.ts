import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const PHASE_LABELS: Record<number, string> = {
  1: "Audit & Architecture",
  2: "Component Migration",
  3: "Advanced Features",
  4: "DevOps & Launch",
};

export const PHASE_COLORS: Record<number, string> = {
  1: "violet",
  2: "sitecore",
  3: "nextjs",
  4: "success",
};

export const SEVERITY_LABELS: Record<string, string> = {
  "architecture-critical": "Architecture Critical",
  recommended: "Recommended",
  optional: "Optional",
};

import { cn } from "@/lib/utils";

type BadgeVariant =
  | "sitecore"
  | "nextjs"
  | "decision"
  | "success"
  | "caution"
  | "neutral"
  | "critical"
  | "recommended"
  | "optional";

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  sitecore:
    "bg-[color-mix(in_srgb,var(--color-sitecore)_15%,transparent)] text-sitecore border border-[color-mix(in_srgb,var(--color-sitecore)_30%,transparent)]",
  nextjs:
    "bg-[color-mix(in_srgb,var(--color-nextjs)_15%,transparent)] text-nextjs border border-[color-mix(in_srgb,var(--color-nextjs)_30%,transparent)]",
  decision:
    "bg-[color-mix(in_srgb,var(--color-violet)_15%,transparent)] text-violet border border-[color-mix(in_srgb,var(--color-violet)_30%,transparent)]",
  success:
    "bg-[color-mix(in_srgb,var(--color-success)_15%,transparent)] text-success border border-[color-mix(in_srgb,var(--color-success)_30%,transparent)]",
  caution:
    "bg-[color-mix(in_srgb,var(--color-caution)_15%,transparent)] text-caution border border-[color-mix(in_srgb,var(--color-caution)_30%,transparent)]",
  neutral:
    "bg-raised text-dim border border-edge",
  critical:
    "bg-[color-mix(in_srgb,var(--color-sitecore)_15%,transparent)] text-sitecore border border-[color-mix(in_srgb,var(--color-sitecore)_30%,transparent)]",
  recommended:
    "bg-[color-mix(in_srgb,var(--color-nextjs)_15%,transparent)] text-nextjs border border-[color-mix(in_srgb,var(--color-nextjs)_30%,transparent)]",
  optional:
    "bg-raised text-dim border border-edge",
};

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5",
        "rounded-full text-xs font-medium leading-none whitespace-nowrap",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

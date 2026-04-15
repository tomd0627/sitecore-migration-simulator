import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "sitecore" | "nextjs";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-violet text-canvas font-semibold hover:bg-[color-mix(in_srgb,var(--color-violet)_85%,white)] active:scale-[0.98]",
  secondary:
    "bg-raised text-ink border border-edge hover:bg-[color-mix(in_srgb,var(--color-raised)_70%,var(--color-edge))] active:scale-[0.98]",
  ghost:
    "text-dim hover:text-ink hover:bg-raised active:scale-[0.98]",
  sitecore:
    "bg-[color-mix(in_srgb,var(--color-sitecore)_20%,transparent)] text-sitecore border border-[color-mix(in_srgb,var(--color-sitecore)_40%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-sitecore)_30%,transparent)] active:scale-[0.98]",
  nextjs:
    "bg-[color-mix(in_srgb,var(--color-nextjs)_20%,transparent)] text-nextjs border border-[color-mix(in_srgb,var(--color-nextjs)_40%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-nextjs)_30%,transparent)] active:scale-[0.98]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md gap-1.5",
  md: "px-4 py-2 text-sm rounded-lg gap-2",
  lg: "px-6 py-3 text-base rounded-xl gap-2.5",
};

export function Button({
  variant = "secondary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium",
        "transition-all duration-150",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

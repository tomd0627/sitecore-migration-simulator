import { cn } from "@/lib/utils";
import { Info, AlertTriangle, Lightbulb, CheckCircle } from "lucide-react";

type CalloutType = "info" | "warning" | "tip" | "success";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const config: Record<
  CalloutType,
  { icon: React.ComponentType<{ className?: string; size?: number }>; styles: string; titleColor: string }
> = {
  info: {
    icon: Info,
    styles:
      "bg-[color-mix(in_srgb,var(--color-violet)_10%,transparent)] border-[color-mix(in_srgb,var(--color-violet)_40%,transparent)] border-l-violet",
    titleColor: "text-violet",
  },
  warning: {
    icon: AlertTriangle,
    styles:
      "bg-[color-mix(in_srgb,var(--color-caution)_8%,transparent)] border-[color-mix(in_srgb,var(--color-caution)_30%,transparent)] border-l-caution",
    titleColor: "text-caution",
  },
  tip: {
    icon: Lightbulb,
    styles:
      "bg-[color-mix(in_srgb,var(--color-nextjs)_8%,transparent)] border-[color-mix(in_srgb,var(--color-nextjs)_25%,transparent)] border-l-nextjs",
    titleColor: "text-nextjs",
  },
  success: {
    icon: CheckCircle,
    styles:
      "bg-[color-mix(in_srgb,var(--color-success)_8%,transparent)] border-[color-mix(in_srgb,var(--color-success)_25%,transparent)] border-l-success",
    titleColor: "text-success",
  },
};

export function Callout({
  type = "info",
  title,
  children,
  className,
}: CalloutProps) {
  const { icon: Icon, styles, titleColor } = config[type];

  return (
    <aside
      className={cn(
        "rounded-lg border border-l-[3px] p-4",
        styles,
        className
      )}
    >
      <div className="flex gap-3">
        <Icon
          size={18}
          className={cn("shrink-0 mt-0.5", titleColor)}
          aria-hidden="true"
        />
        <div className="min-w-0 text-sm leading-relaxed">
          {title && (
            <p className={cn("font-semibold mb-1", titleColor)}>{title}</p>
          )}
          <div className="text-dim">{children}</div>
        </div>
      </div>
    </aside>
  );
}

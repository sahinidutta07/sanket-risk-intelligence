import { cn } from "@/lib/utils";
import { Trend } from "./primitives";

export function KpiCard({
  label,
  value,
  unit,
  caption,
  trend,
  accent,
  children,
  className,
}: {
  label: string;
  value?: React.ReactNode;
  unit?: string;
  caption?: React.ReactNode;
  trend?: number;
  accent?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("panel panel-hover flex flex-col px-4 py-3.5", className)}>
      <div className="label-xs">{label}</div>
      {children ?? (
        <div className="mt-2 flex items-baseline gap-1">
          <span
            className="mono-num text-[28px] leading-none font-semibold"
            style={accent ? { color: accent } : undefined}
          >
            {value}
          </span>
          {unit && <span className="text-[13px] text-muted-foreground">{unit}</span>}
        </div>
      )}
      <div className="mt-2 flex items-center gap-2">
        {typeof trend === "number" && <Trend value={trend} invert />}
        {caption && <span className="text-[11.5px] text-muted-foreground">{caption}</span>}
      </div>
    </div>
  );
}

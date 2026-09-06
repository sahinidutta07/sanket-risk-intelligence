import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { RISK_TOKEN, riskLevel, type RiskLevel } from "@/lib/risk-engine";

export const riskText: Record<RiskLevel, string> = {
  LOW: "text-risk-low",
  MODERATE: "text-risk-moderate",
  HIGH: "text-risk-high",
  "VERY HIGH": "text-risk-vhigh",
  CRITICAL: "text-risk-critical",
};

export const riskBg: Record<RiskLevel, string> = {
  LOW: "bg-risk-low",
  MODERATE: "bg-risk-moderate",
  HIGH: "bg-risk-high",
  "VERY HIGH": "bg-risk-vhigh",
  CRITICAL: "bg-risk-critical",
};

export function RiskBadge({
  level,
  className,
  size = "sm",
}: {
  level: RiskLevel;
  className?: string;
  size?: "sm" | "xs";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border font-mono uppercase tracking-[0.12em]",
        size === "sm" ? "px-2 py-1 text-[10px]" : "px-1.5 py-0.5 text-[9px]",
        riskText[level],
        className,
      )}
      style={{ borderColor: "currentColor", backgroundColor: "color-mix(in oklab, currentColor 12%, transparent)" }}
    >
      <span className={cn("size-1.5 rounded-full", riskBg[level])} />
      {level}
    </span>
  );
}

export function LiveDot({ className, tone = "low" }: { className?: string; tone?: "low" | "critical" | "primary" }) {
  const color =
    tone === "critical" ? "bg-risk-critical" : tone === "primary" ? "bg-primary" : "bg-risk-low";
  return <span className={cn("live-dot inline-block size-1.5 rounded-full", color, className)} />;
}

/** Animated number that eases toward its target. */
export function AnimatedNumber({
  value,
  decimals = 0,
  className,
}: {
  value: number;
  decimals?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);
  const ref = useRef(value);
  useEffect(() => {
    let frame: number;
    const tick = () => {
      const diff = value - ref.current;
      if (Math.abs(diff) < 0.01) {
        ref.current = value;
        setDisplay(value);
        return;
      }
      ref.current += diff * 0.18;
      setDisplay(ref.current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <span className={cn("mono-num", className)}>{display.toFixed(decimals)}</span>;
}

export function RiskMeter({ score, size = 132 }: { score: number; size?: number }) {
  const level = riskLevel(score);
  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-border"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className={cn("transition-[stroke-dashoffset] duration-700 ease-out", `stroke-${RISK_TOKEN[level]}`)}
          style={{ stroke: `var(--${RISK_TOKEN[level]})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={cn("text-[30px] leading-none font-semibold", riskText[level])}>
          <AnimatedNumber value={score} />
        </div>
        <div className="label-xs mt-1">/ 100</div>
      </div>
    </div>
  );
}

export function PanelHeader({
  title,
  subtitle,
  right,
  className,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4 border-b border-border px-4 py-3", className)}>
      <div>
        <h2 className="font-mono text-[12px] tracking-[0.14em] text-foreground uppercase">{title}</h2>
        {subtitle && <p className="mt-1 text-[12px] text-muted-foreground">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function Trend({ value, invert = false }: { value: number; invert?: boolean }) {
  const up = value >= 0;
  const bad = invert ? !up : up;
  return (
    <span
      className={cn(
        "mono-num text-[11px]",
        bad ? "text-risk-high" : "text-risk-low",
      )}
    >
      {up ? "↑" : "↓"} {Math.abs(value).toFixed(0)}%
    </span>
  );
}

/** Tiny inline sparkline, deterministic from the given series. */
export function Sparkline({
  data,
  color = "var(--primary)",
  height = 34,
}: {
  data: number[];
  color?: string;
  height?: number;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = height - ((d - min) / span) * (height - 4) - 2;
    return `${x},${y}`;
  });
  const area = `0,${height} ${pts.join(" ")} 100,${height}`;
  return (
    <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
      <polygon points={area} fill={color} opacity={0.12} />
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Deterministic pseudo-series so charts never jitter between renders. */
export function series(seed: number, n: number, base: number, amp: number) {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const v = Math.sin((i + seed) * 0.7) * 0.5 + Math.sin((i + seed) * 0.23) * 0.5;
    out.push(+(base + v * amp).toFixed(2));
  }
  return out;
}

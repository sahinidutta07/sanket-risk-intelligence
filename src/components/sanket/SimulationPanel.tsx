import { useState } from "react";
import { CloudRain, RotateCcw, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SIM_STAGES,
  resetSimulation,
  snapshotArea,
  startSimulation,
  useSanketState,
} from "@/lib/sanket-store";
import { AnimatedNumber, RiskBadge } from "./primitives";
import { riskLevel } from "@/lib/risk-engine";

function Row({
  label,
  from,
  to,
  unit,
  decimals = 0,
}: {
  label: string;
  from: number;
  to: number;
  unit: string;
  decimals?: number;
}) {
  const changed = Math.abs(to - from) > 0.001;
  return (
    <div className="flex items-center justify-between py-1.5 text-[12px]">
      <span className="text-muted-foreground">{label}</span>
      <span className="mono-num flex items-center gap-1.5">
        <span className="text-muted-foreground/70">
          {from.toFixed(decimals)}
          {unit}
        </span>
        <span className="text-border-strong">→</span>
        <span className={cn(changed ? "text-risk-high" : "text-foreground")}>
          <AnimatedNumber value={to} decimals={decimals} />
          {unit}
        </span>
      </span>
    </div>
  );
}

export function SimulationPanel() {
  const [open, setOpen] = useState(false);
  const { simProgress, simRunning, simStage } = useSanketState();

  const now = snapshotArea("lebong", simProgress);
  const base = snapshotArea("lebong", 0);

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "fixed right-5 bottom-5 z-40 flex items-center gap-2 rounded-md border px-3.5 py-2.5 font-mono text-[11px] tracking-[0.12em] uppercase shadow-2xl transition-all duration-200",
          simProgress > 0
            ? "border-risk-critical/60 bg-risk-critical/15 text-risk-critical"
            : "border-primary/50 bg-primary/12 text-primary hover:bg-primary/20",
        )}
      >
        <Zap className="size-3.5" />
        Simulation mode
      </button>

      {open && (
        <div className="fixed right-5 bottom-20 z-40 w-[330px] overflow-hidden rounded-lg border border-border bg-popover shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <div className="font-mono text-[11px] tracking-[0.14em] text-foreground uppercase">
                Simulation mode
              </div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">
                Scenario: heavy rainfall event — Lebong
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close simulation panel">
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-3 px-4 py-3">
            <div className="divide-y divide-border/60">
              <Row label="Rainfall" from={base.factors.rainfall} to={now.factors.rainfall} unit=" mm" />
              <Row
                label="Soil moisture"
                from={base.factors.soilMoisture}
                to={now.factors.soilMoisture}
                unit="%"
              />
              <Row
                label="Ground movement"
                from={base.factors.groundMovement}
                to={now.factors.groundMovement}
                unit=" mm/hr"
                decimals={1}
              />
              <Row label="Risk score" from={base.score} to={now.score} unit="" />
            </div>

            <div className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2">
              <RiskBadge level={riskLevel(base.score)} size="xs" />
              <span className="text-border-strong">→</span>
              <RiskBadge level={now.level} size="xs" />
            </div>

            <div>
              <div className="h-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-150"
                  style={{ width: `${simProgress * 100}%` }}
                />
              </div>
              <div className="mt-2 space-y-1">
                {SIM_STAGES.map((s, i) => (
                  <div
                    key={s}
                    className={cn(
                      "flex items-center gap-2 font-mono text-[10px] tracking-[0.08em] uppercase transition-colors",
                      simProgress > 0 && i <= simStage ? "text-foreground" : "text-muted-foreground/45",
                    )}
                  >
                    <span
                      className={cn(
                        "size-1 rounded-full",
                        simProgress > 0 && i <= simStage ? "bg-primary" : "bg-border-strong",
                      )}
                    />
                    {s}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={startSimulation}
                disabled={simRunning || simProgress >= 1}
                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 font-mono text-[10px] tracking-[0.12em] text-primary-foreground uppercase transition-colors duration-200 hover:bg-primary/90 disabled:opacity-40"
              >
                <CloudRain className="size-3.5" />
                {simRunning ? "Running…" : "Simulate rainfall"}
              </button>
              <button
                onClick={resetSimulation}
                className="flex items-center justify-center gap-2 rounded-md border border-border px-3 py-2 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase transition-colors duration-200 hover:border-border-strong hover:text-foreground"
              >
                <RotateCcw className="size-3.5" />
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

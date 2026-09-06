import { Link } from "@tanstack/react-router";
import { ArrowRight, Droplets, CloudRain, Mountain, Radio, Trees } from "lucide-react";
import {
  FACTOR_LABEL,
  FACTOR_UNIT,
  factorContributions,
  impactLabel,
  type RiskFactors,
} from "@/lib/risk-engine";
import { snapshotArea, useSanketState } from "@/lib/sanket-store";
import { AnimatedNumber, RiskBadge, riskText } from "./primitives";
import { cn } from "@/lib/utils";

const ICONS: Record<keyof RiskFactors, React.ComponentType<{ className?: string }>> = {
  rainfall: CloudRain,
  soilMoisture: Droplets,
  slope: Mountain,
  groundMovement: Radio,
  landCover: Trees,
};

export function AreaDetails({
  compact = false,
  showAction = true,
}: {
  compact?: boolean;
  showAction?: boolean;
}) {
  const { simProgress, selectedAreaId } = useSanketState();
  const snap = snapshotArea(selectedAreaId, simProgress);
  const contributions = factorContributions(snap.factors);
  const critical = snap.score >= 72;

  return (
    <div className="panel flex h-full flex-col">
      <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <div className="label-xs">Why is this area at risk?</div>
          <h3 className="mt-1 text-[16px] font-medium text-foreground">
            {snap.area.name}, {snap.area.district}
          </h3>
          <div className="mono-num mt-0.5 text-[11px] text-muted-foreground">
            {snap.area.elevation} m · pop. {snap.area.population}
          </div>
        </div>
        <RiskBadge level={snap.level} />
      </div>

      <div className="flex items-baseline gap-3 border-b border-border px-4 py-3">
        <div className={cn("text-[32px] leading-none font-semibold", riskText[snap.level])}>
          <AnimatedNumber value={snap.score} />
          <span className="text-[16px]">%</span>
        </div>
        <div className="label-xs">Risk score</div>
        <div className="ml-auto text-right">
          <div className="mono-num text-[16px] text-foreground">{snap.confidence}%</div>
          <div className="label-xs">AI confidence</div>
        </div>
      </div>

      <div className="flex-1 px-4 py-3">
        <div className="label-xs mb-2.5">Risk drivers</div>
        <ul className="space-y-2.5">
          {contributions.map((c) => {
            const Icon = ICONS[c.key];
            const raw = snap.factors[c.key];
            const impact = impactLabel(c.share);
            return (
              <li key={c.key} className="flex items-center gap-3">
                <Icon className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="w-[112px] shrink-0 text-[12px] text-foreground">
                  {FACTOR_LABEL[c.key]}
                </span>
                <span className="mono-num w-[74px] shrink-0 text-[12px] text-foreground">
                  {c.key === "landCover" ? `${Math.round(raw * 100)}%` : `${raw}${FACTOR_UNIT[c.key]}`}
                </span>
                <span className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                  <span
                    className={cn(
                      "block h-full rounded-full transition-[width] duration-500",
                      impact === "High impact"
                        ? "bg-risk-high"
                        : impact === "Moderate impact"
                          ? "bg-risk-moderate"
                          : "bg-primary",
                    )}
                    style={{ width: `${c.share * 2.4}%` }}
                  />
                </span>
                <span className="label-xs w-[96px] shrink-0 text-right">{impact}</span>
              </li>
            );
          })}
        </ul>

        {!compact && (
          <div className="mt-4 rounded-md border border-border bg-surface/60 px-3 py-2.5">
            <div className="label-xs mb-1.5">AI assessment</div>
            <p className="text-[12.5px] leading-relaxed text-foreground/85">
              {critical
                ? `High probability of slope instability at ${snap.area.name} due to sustained rainfall (${snap.factors.rainfall} mm), elevated soil moisture (${snap.factors.soilMoisture}%) and steep terrain (${snap.factors.slope}°). Ground movement is trending upward at ${snap.factors.groundMovement} mm/hr.`
                : `Slope conditions at ${snap.area.name} are currently within tolerance. Rainfall (${snap.factors.rainfall} mm) and soil moisture (${snap.factors.soilMoisture}%) remain below escalation thresholds; continue routine monitoring.`}
            </p>
          </div>
        )}

        <div className="mt-3 rounded-md border-l-2 border-primary bg-primary/5 px-3 py-2.5">
          <div className="label-xs mb-1">Recommended action</div>
          <p className="text-[12.5px] text-foreground/85">
            {critical
              ? "Increase monitoring frequency to 5-minute intervals and initiate local authority verification of the NH-110 slope corridor."
              : "Maintain standard 15-minute polling. No field verification required at present."}
          </p>
        </div>
      </div>

      {showAction && (
        <div className="border-t border-border px-4 py-3">
          <Link
            to="/predictions"
            className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.12em] text-primary uppercase transition-colors hover:text-foreground"
          >
            View full prediction <ArrowRight className="size-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}

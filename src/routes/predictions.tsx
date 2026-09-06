import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, BrainCircuit, Clock, ShieldCheck, TrendingUp } from "lucide-react";
import { AppShell, PageTitle } from "@/components/sanket/AppShell";
import {
  AnimatedNumber,
  PanelHeader,
  RiskBadge,
  RiskMeter,
  Sparkline,
  riskText,
  series,
} from "@/components/sanket/primitives";
import { AreaDetails } from "@/components/sanket/AreaDetails";
import {
  FACTOR_LABEL,
  FACTOR_UNIT,
  RISK_TOKEN,
  factorContributions,
  impactLabel,
  riskLevel,
  type RiskFactors,
} from "@/lib/risk-engine";
import { overallRisk, snapshotArea, useSanketState } from "@/lib/sanket-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/predictions")({
  head: () => ({
    meta: [
      { title: "Predictions — SANKET Landslide Intelligence" },
      {
        name: "description",
        content:
          "AI landslide probability forecasts with per-factor contribution analysis, model performance scores and recommended protective actions for each monitored zone.",
      },
      { property: "og:title", content: "Predictions — SANKET" },
      {
        property: "og:description",
        content:
          "Explainable AI risk forecasts: factor contributions, confidence, 24–72 hour outlook and recommended actions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PredictionsPage,
});

const MODEL_SCORES = [
  { label: "Accuracy", value: 94.2 },
  { label: "Precision", value: 91.6 },
  { label: "Recall", value: 89.8 },
  { label: "F1 score", value: 90.7 },
];

function PredictionsPage() {
  const { simProgress, selectedAreaId } = useSanketState();
  const { score, level, snaps } = overallRisk(simProgress);
  const snap = snapshotArea(selectedAreaId, simProgress);
  const contributions = factorContributions(snap.factors);

  const horizon = [
    { label: "Next 6 hours", value: Math.min(100, Math.round(snap.score * 1.02)) },
    { label: "Next 24 hours", value: Math.min(100, Math.round(snap.score * 1.08)) },
    { label: "Next 48 hours", value: Math.min(100, Math.round(snap.score * 0.96)) },
    { label: "Next 72 hours", value: Math.min(100, Math.round(snap.score * 0.84)) },
  ];

  const actions =
    snap.score >= 85
      ? [
          "Issue immediate evacuation advisory for downslope settlements",
          "Close NH-110 corridor traffic through the affected stretch",
          "Deploy NDRF / SDRF team to the staging point",
          "Alert district magistrate and local disaster cell",
        ]
      : snap.score >= 72
        ? [
            "Place response teams on standby",
            "Issue public advisory: avoid slope-adjacent roads",
            "Increase sensor polling frequency to 1 minute",
            "Pre-position relief supplies at the nearest shelter",
          ]
        : [
            "Continue routine monitoring at standard interval",
            "Verify drainage clearance on vulnerable slopes",
            "Schedule field inspection for warning-state sensors",
          ];

  return (
    <AppShell>
      <PageTitle
        title="Predictions"
        subtitle="AI landslide probability forecasts and explainability"
      />

      <div className="mb-4 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="panel flex flex-col items-center justify-center gap-4 px-4 py-6">
          <div className="label-xs">Predicted risk · {snap.area.name}</div>
          <RiskMeter score={snap.score} size={168} />
          <RiskBadge level={snap.level} />
          <div className="grid w-full grid-cols-2 gap-3 border-t border-border pt-4">
            <div className="text-center">
              <div className="mono-num text-[20px] text-foreground">{snap.confidence}%</div>
              <div className="label-xs mt-1">Model confidence</div>
            </div>
            <div className="text-center">
              <div className="mono-num text-[20px] text-foreground">{score}</div>
              <div className="label-xs mt-1">Regional index</div>
            </div>
          </div>
        </div>

        <div className="panel overflow-hidden">
          <PanelHeader
            title="Why the model predicts this"
            subtitle="Contribution of each input factor to the current score"
            right={<BrainCircuit className="size-4 text-muted-foreground" />}
          />
          <ul className="divide-y divide-border/60">
            {contributions.map((c) => {
              const key = c.key as keyof RiskFactors;
              return (
                <li key={c.key} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-foreground">{FACTOR_LABEL[key]}</span>
                    <span className="flex items-center gap-3">
                      <span className="mono-num text-[12px] text-muted-foreground">
                        {snap.factors[key]} {FACTOR_UNIT[key]}
                      </span>
                      <span className="mono-num text-[13px] text-foreground">{c.share}%</span>
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full transition-[width] duration-700 ease-out"
                      style={{
                        width: `${c.share}%`,
                        backgroundColor: `var(--${RISK_TOKEN[snap.level]})`,
                      }}
                    />
                  </div>
                  <div className="label-xs mt-1.5">{impactLabel(c.share)}</div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="panel overflow-hidden">
          <PanelHeader
            title="Forecast horizon"
            subtitle="Projected probability window for the selected zone"
            right={<Clock className="size-4 text-muted-foreground" />}
          />
          <div className="grid grid-cols-2 divide-x divide-y divide-border/60 sm:grid-cols-4">
            {horizon.map((h, i) => {
              const lvl = riskLevel(h.value);
              return (
                <div key={h.label} className="px-4 py-4">
                  <div className="label-xs">{h.label}</div>
                  <div className={cn("mono-num mt-2 text-[26px] leading-none", riskText[lvl])}>
                    <AnimatedNumber value={h.value} />
                    <span className="text-[13px] text-muted-foreground">%</span>
                  </div>
                  <div className="mt-2">
                    <Sparkline
                      data={series(i * 4, 12, h.value, 6)}
                      height={26}
                      color={`var(--${RISK_TOKEN[lvl]})`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel overflow-hidden">
          <PanelHeader
            title="Model performance"
            subtitle="Validated on 12 years of regional landslide records"
            right={<ShieldCheck className="size-4 text-muted-foreground" />}
          />
          <div className="grid grid-cols-2 divide-x divide-y divide-border/60">
            {MODEL_SCORES.map((m) => (
              <div key={m.label} className="px-4 py-4">
                <div className="label-xs">{m.label}</div>
                <div className="mono-num mt-2 text-[24px] leading-none text-foreground">
                  <AnimatedNumber value={m.value} decimals={1} />
                  <span className="text-[13px] text-muted-foreground">%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border px-4 py-3">
            <div className="label-xs">Ensemble · Gradient Boosting + LSTM temporal model</div>
            <p className="mt-1.5 text-[12.5px] text-muted-foreground">
              Retrained weekly on incoming sensor telemetry, IMD rainfall records and satellite
              land-cover change detection.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="panel overflow-hidden">
          <PanelHeader
            title="Zone forecast ranking"
            subtitle="All monitored zones, highest predicted probability first"
            right={<TrendingUp className="size-4 text-muted-foreground" />}
          />
          <ul className="divide-y divide-border/60">
            {[...snaps]
              .sort((a, b) => b.score - a.score)
              .map((s) => (
                <li key={s.area.id} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="min-w-[110px] text-[13px] text-foreground">{s.area.name}</span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                    <span
                      className="block h-full rounded-full transition-[width] duration-700"
                      style={{
                        width: `${s.score}%`,
                        backgroundColor: `var(--${RISK_TOKEN[s.level]})`,
                      }}
                    />
                  </span>
                  <span className="mono-num w-8 text-right text-[12px] text-foreground">
                    {s.score}
                  </span>
                  <span className="mono-num w-12 text-right text-[11px] text-muted-foreground">
                    {s.confidence}%
                  </span>
                </li>
              ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <div className="panel overflow-hidden">
            <PanelHeader
              title="Recommended actions"
              subtitle={`Generated for ${snap.area.name} · ${snap.level}`}
              right={<AlertTriangle className="size-4" style={{ color: `var(--${RISK_TOKEN[snap.level]})` }} />}
            />
            <ol className="divide-y divide-border/60">
              {actions.map((a, i) => (
                <li key={a} className="flex gap-3 px-4 py-2.5 text-[12.5px] text-muted-foreground">
                  <span className="mono-num text-[11px] text-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {a}
                </li>
              ))}
            </ol>
          </div>
          <AreaDetails compact showAction={false} />
        </div>
      </div>
    </AppShell>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CloudRain, Droplets, Radio, Thermometer } from "lucide-react";
import { AppShell, PageTitle } from "@/components/sanket/AppShell";
import { KpiCard } from "@/components/sanket/KpiCard";
import { RiskMap } from "@/components/sanket/RiskMap";
import { AreaDetails } from "@/components/sanket/AreaDetails";
import { AlertTimeline } from "@/components/sanket/AlertTimeline";
import { DataPipeline } from "@/components/sanket/DataPipeline";
import {
  AnimatedNumber,
  LiveDot,
  PanelHeader,
  RiskBadge,
  RiskMeter,
  Sparkline,
  Trend,
  riskText,
  series,
} from "@/components/sanket/primitives";
import { overallRisk, useSanketState } from "@/lib/sanket-store";
import { NETWORK } from "@/lib/risk-engine";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SANKET Dashboard — Landslide Early Warning Command Center" },
      {
        name: "description",
        content:
          "Real-time landslide risk command center for the Darjeeling–Kalimpong region: live sensor telemetry, AI risk scoring, geospatial hotspots and actionable early warnings.",
      },
      { property: "og:title", content: "SANKET Dashboard — Landslide Early Warning" },
      {
        property: "og:description",
        content:
          "AI + IoT landslide early warning command center with live risk map, sensor network health and explainable risk predictions.",
      },
    ],
  }),
  component: Dashboard,
});

const SNAPSHOTS = [
  { label: "Rainfall", icon: CloudRain, unit: "mm", key: "rainfall" as const, trend: 12, seed: 2 },
  { label: "Soil Moisture", icon: Droplets, unit: "%", key: "soilMoisture" as const, trend: 8, seed: 5 },
  { label: "Ground Movement", icon: Radio, unit: "mm/hr", key: "groundMovement" as const, trend: 10, seed: 9 },
  { label: "Ground Temperature", icon: Thermometer, unit: "°C", key: null, trend: 2, seed: 13 },
];

function Dashboard() {
  const { simProgress, lastSync } = useSanketState();
  const { score, level, snaps } = overallRisk(simProgress);
  const critical = snaps.filter((s) => s.level === "CRITICAL" || s.level === "VERY HIGH");
  const top = [...snaps].sort((a, b) => b.score - a.score)[0]!;
  const highRisk = snaps.filter((s) => s.score >= 55).length;
  const activeAlerts = useSanketState().alerts.filter((a) => a.status === "ACTIVE");

  return (
    <AppShell>
      <PageTitle
        title="Dashboard"
        subtitle="Regional landslide risk command center — Darjeeling & Kalimpong districts"
      />

      {/* command bar */}
      <div className="panel mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <div className="flex items-center gap-2">
          <LiveDot />
          <span className="font-mono text-[11px] tracking-[0.12em] text-foreground uppercase">
            All systems operational
          </span>
        </div>
        <div className="label-xs">
          Last synchronized <span className="mono-num text-foreground">{lastSync}</span>
        </div>
        <div className="label-xs">
          Data sources{" "}
          <span className="text-foreground">
            40 Sensors · Weather · Terrain · Historical Records
          </span>
        </div>
        <div className="label-xs ml-auto flex items-center gap-2">
          <span className="relative h-1 w-16 overflow-hidden rounded-full bg-muted">
            <span className="stream-sweep absolute inset-y-0 w-4 rounded-full bg-primary" />
          </span>
          Data stream active
        </div>
      </div>

      {/* KPI row */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Overall risk">
          <div className="mt-1 flex items-center gap-3">
            <RiskMeter score={score} size={92} />
            <div>
              <RiskBadge level={level} />
              <div className="mt-2">
                <Trend value={simProgress > 0 ? 34 : 8} invert />
              </div>
              <div className="label-xs mt-1">from previous hour</div>
            </div>
          </div>
        </KpiCard>
        <KpiCard
          label="Affected areas"
          value={<AnimatedNumber value={highRisk + 6} />}
          caption="at high risk or above"
          trend={simProgress > 0 ? 18 : 4}
        />
        <KpiCard
          label="Active alerts"
          value={activeAlerts.length}
          accent="var(--risk-critical)"
          caption={`${activeAlerts.filter((a) => a.severity === "CRITICAL").length} critical`}
        />
        <KpiCard label="Monitored areas" value="48" caption="across Darjeeling region" />
        <KpiCard
          label="Sensor network"
          value={`${NETWORK.online}/${NETWORK.total}`}
          accent="var(--risk-low)"
          caption="90% online · 1.8s latency"
        />
      </div>

      {/* critical banner */}
      {critical.length > 0 && (
        <div className="critical-edge panel mb-4 flex flex-wrap items-center gap-x-8 gap-y-3 border-risk-critical/40 bg-risk-critical/[0.07] px-4 py-3.5">
          <div>
            <div className="flex items-center gap-2">
              <LiveDot tone="critical" />
              <span className="font-mono text-[11px] tracking-[0.14em] text-risk-critical uppercase">
                Critical risk detected
              </span>
            </div>
            <div className="mt-1.5 text-[15px] font-medium text-foreground">
              {top.area.name}, {top.area.district}
            </div>
            <div className="mono-num mt-0.5 text-[12px] text-muted-foreground">
              Risk score <span className={riskText[top.level]}>{top.score}%</span> · Primary factors:
              heavy rainfall + high soil moisture
            </div>
            <div className="mt-1 text-[12px] text-muted-foreground">
              Immediate field assessment recommended.
            </div>
          </div>
          <div className="ml-auto flex flex-wrap gap-2">
            <Link
              to="/risk-map"
              className="inline-flex items-center gap-2 rounded-md border border-risk-critical/50 bg-risk-critical/10 px-3 py-2 font-mono text-[10px] tracking-[0.12em] text-risk-critical uppercase transition-colors duration-200 hover:bg-risk-critical/20"
            >
              View risk area <ArrowRight className="size-3.5" />
            </Link>
            <Link
              to="/predictions"
              className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 font-mono text-[10px] tracking-[0.12em] text-foreground uppercase transition-colors duration-200 hover:border-border-strong"
            >
              View prediction <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* map + explanation */}
      <div className="mb-4 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="panel overflow-hidden">
          <PanelHeader
            title="Live landslide risk map"
            right={
              <span className="flex items-center gap-1.5 rounded-sm border border-risk-critical/40 px-2 py-1">
                <LiveDot tone="critical" />
                <span className="label-xs">Live</span>
              </span>
            }
          />
          <div className="p-3">
            <RiskMap height={430} />
          </div>
        </div>
        <AreaDetails />
      </div>

      {/* alerts + sensor snapshot */}
      <div className="mb-4 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="panel overflow-hidden">
          <PanelHeader
            title="Recent alerts"
            right={<span className="label-xs">{activeAlerts.length} active</span>}
          />
          <AlertTimeline limit={5} />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SNAPSHOTS.map((s) => {
            const value =
              s.key === "rainfall"
                ? top.factors.rainfall
                : s.key === "soilMoisture"
                  ? top.factors.soilMoisture
                  : s.key === "groundMovement"
                    ? top.factors.groundMovement
                    : 23.7;
            const color =
              s.key === "groundMovement" ? "var(--risk-high)" : s.key ? "var(--primary)" : "var(--risk-low)";
            return (
              <div key={s.label} className="panel panel-hover px-4 py-3.5">
                <div className="flex items-center justify-between">
                  <span className="label-xs">{s.label}</span>
                  <s.icon className="size-3.5 text-muted-foreground" />
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className={cn("mono-num text-[26px] leading-none font-semibold")}>
                    <AnimatedNumber value={value} decimals={s.key === "groundMovement" ? 1 : 1} />
                  </span>
                  <span className="text-[12px] text-muted-foreground">{s.unit}</span>
                  <span className="ml-auto">
                    <Trend value={s.trend} invert />
                  </span>
                </div>
                <div className="mt-2">
                  <Sparkline data={series(s.seed, 18, value, value * 0.12)} color={color} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <DataPipeline />
    </AppShell>
  );
}

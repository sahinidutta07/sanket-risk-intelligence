import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  CloudRain,
  Droplets,
  Eye,
  Gauge,
  Mountain,
  Thermometer,
  Wind,
  X,
} from "lucide-react";
import { AppShell, PageTitle } from "@/components/sanket/AppShell";
import { RiskMap } from "@/components/sanket/RiskMap";
import { AlertTimeline } from "@/components/sanket/AlertTimeline";
import {
  AnimatedNumber,
  LiveDot,
  PanelHeader,
  RiskBadge,
  Sparkline,
  riskText,
  series,
} from "@/components/sanket/primitives";
import { overallRisk, snapshotArea, useSanketState } from "@/lib/sanket-store";
import { NETWORK, SENSORS, AREAS } from "@/lib/risk-engine";

export const Route = createFileRoute("/live-monitoring")({
  head: () => ({
    meta: [
      { title: "Live Monitoring — SANKET Landslide Intelligence" },
      {
        name: "description",
        content:
          "Real-time environmental and ground-condition monitoring console: live sensor stream, current conditions, alert timeline and weather overview for landslide-prone zones.",
      },
      { property: "og:title", content: "Live Monitoring — SANKET" },
      {
        property: "og:description",
        content:
          "Operations console streaming rainfall, soil moisture, ground movement and sensor health in real time.",
      },
    ],
  }),
  component: LiveMonitoring,
});

const WEATHER = [
  { label: "Temperature", value: "18.4", unit: "°C", icon: Thermometer },
  { label: "Rainfall (1h)", value: "12.8", unit: "mm", icon: CloudRain },
  { label: "Humidity", value: "94", unit: "%", icon: Droplets },
  { label: "Wind", value: "18", unit: "km/h", icon: Wind },
  { label: "Visibility", value: "1.2", unit: "km", icon: Eye },
  { label: "Pressure", value: "1004", unit: "hPa", icon: Gauge },
];

function LiveMonitoring() {
  const { simProgress, lastSync, selectedAreaId } = useSanketState();
  const { score, level } = overallRisk(simProgress);
  const snap = snapshotArea(selectedAreaId, simProgress);
  const [sensorId, setSensorId] = useState<string | null>(null);
  const sensor = SENSORS.find((s) => s.id === sensorId);
  const sensorArea = AREAS.find((a) => a.id === sensor?.areaId);

  const conditions = [
    {
      label: "Risk level",
      value: score,
      unit: `/100`,
      badge: level,
      decimals: 0,
      icon: Gauge,
    },
    { label: "Rainfall", value: snap.factors.rainfall, unit: "mm", caption: simProgress > 0.4 ? "Severe" : "Moderate", decimals: 1, icon: CloudRain },
    { label: "Soil moisture", value: snap.factors.soilMoisture, unit: "%", caption: snap.factors.soilMoisture > 75 ? "Saturated" : "Normal", decimals: 1, icon: Droplets },
    { label: "Elevation", value: snap.area.elevation, unit: "m", caption: "Above sea level", decimals: 0, icon: Mountain },
  ];

  return (
    <AppShell>
      <PageTitle
        title="Live Monitoring"
        subtitle="Real-time environmental and ground-condition monitoring"
      />

      <div className="panel mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
        <span className="flex items-center gap-2">
          <LiveDot tone="critical" />
          <span className="font-mono text-[11px] tracking-[0.12em] text-foreground uppercase">
            Live data stream
          </span>
        </span>
        <span className="label-xs">
          <span className="mono-num text-foreground">
            {NETWORK.online}/{NETWORK.total}
          </span>{" "}
          sensors online
        </span>
        <span className="label-xs">
          Last update <span className="mono-num text-foreground">{lastSync}</span>
        </span>
        <span className="label-xs">
          Data latency <span className="mono-num text-foreground">1.8 sec</span>
        </span>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {conditions.map((c) => (
          <div key={c.label} className="panel panel-hover px-4 py-4">
            <div className="flex items-center justify-between">
              <span className="label-xs">{c.label}</span>
              <c.icon className="size-3.5 text-muted-foreground" />
            </div>
            <div className="mt-2.5 flex items-baseline gap-1.5">
              <span className={`mono-num text-[30px] leading-none font-semibold ${c.badge ? riskText[level] : ""}`}>
                <AnimatedNumber value={c.value} decimals={c.decimals} />
              </span>
              <span className="text-[13px] text-muted-foreground">{c.unit}</span>
            </div>
            <div className="mt-2.5">
              {c.badge ? (
                <RiskBadge level={level} size="xs" />
              ) : (
                <span className="label-xs">{c.caption}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="panel overflow-hidden">
          <PanelHeader
            title="Live sensor map"
            subtitle="Click a sensor node for telemetry detail"
            right={
              <span className="mono-num text-[11px] text-muted-foreground">Updated {lastSync}</span>
            }
          />
          <div className="p-3">
            <RiskMap height={440} showSensorStatus onSensorSelect={setSensorId} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {sensor ? (
            <div className="panel">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div>
                  <div className="mono-num text-[15px] text-foreground">{sensor.id}</div>
                  <div className="label-xs mt-1">{sensor.type} sensor</div>
                </div>
                <button onClick={() => setSensorId(null)} aria-label="Close sensor detail">
                  <X className="size-4 text-muted-foreground" />
                </button>
              </div>
              <dl className="divide-y divide-border/60">
                {[
                  ["Location", sensorArea?.name ?? "—"],
                  ["Type", sensor.type],
                  ["Current", `${(sensor.type === "Rainfall" ? snap.factors.rainfall : sensor.type === "Soil Moisture" ? snap.factors.soilMoisture : sensor.type === "Ground Movement" ? snap.factors.groundMovement : 23.7).toString()} ${sensor.unit}`],
                  ["Status", sensor.status],
                  ["Battery", `${sensor.battery}%`],
                  ["Signal", sensor.signal],
                  ["Last update", lastSync],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between px-4 py-2.5">
                    <dt className="text-[12px] text-muted-foreground">{k}</dt>
                    <dd className="mono-num text-[12px] text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : (
            <div className="panel px-4 py-6 text-center">
              <div className="label-xs">Sensor detail</div>
              <p className="mt-2 text-[12.5px] text-muted-foreground">
                Select a sensor node on the map to inspect its live telemetry, battery and uplink
                status.
              </p>
            </div>
          )}

          <div className="panel flex-1 overflow-hidden">
            <PanelHeader title="Alert stream" subtitle="What · where · when · severity" />
            <div className="max-h-[300px] overflow-y-auto">
              <AlertTimeline timeline />
            </div>
          </div>
        </div>
      </div>

      <div className="panel overflow-hidden">
        <PanelHeader
          title="Weather overview"
          subtitle="IMD Darjeeling station · forecast: heavy rain likely next 12h"
        />
        <div className="grid grid-cols-2 divide-x divide-y divide-border/60 sm:grid-cols-3 xl:grid-cols-6">
          {WEATHER.map((w, i) => (
            <div key={w.label} className="px-4 py-3.5">
              <div className="flex items-center justify-between">
                <span className="label-xs">{w.label}</span>
                <w.icon className="size-3.5 text-muted-foreground" />
              </div>
              <div className="mono-num mt-2 text-[22px] leading-none">
                {w.value}
                <span className="ml-1 text-[12px] text-muted-foreground">{w.unit}</span>
              </div>
              <div className="mt-2">
                <Sparkline data={series(i * 3, 14, Number(w.value), Number(w.value) * 0.1)} height={24} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BatteryCharging, Radio, Search, SignalHigh, Wifi } from "lucide-react";
import { AppShell, PageTitle } from "@/components/sanket/AppShell";
import {
  PanelHeader,
  Sparkline,
  series,
} from "@/components/sanket/primitives";
import { NETWORK, SENSORS, AREAS, type SensorStatus } from "@/lib/risk-engine";
import { snapshotArea, useSanketState } from "@/lib/sanket-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/sensor-data")({
  head: () => ({
    meta: [
      { title: "Sensor Data — SANKET Landslide Intelligence" },
      {
        name: "description",
        content:
          "IoT sensor network health for the SANKET landslide warning system: uplink status, battery, signal strength and live readings for every field node.",
      },
      { property: "og:title", content: "Sensor Data — SANKET" },
      {
        property: "og:description",
        content:
          "Field sensor registry with battery, signal and live telemetry for rainfall, soil moisture, tilt and ground-movement nodes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SensorDataPage,
});

const STATUS_COLOR: Record<SensorStatus, string> = {
  Online: "var(--risk-low)",
  Warning: "var(--risk-moderate)",
  Critical: "var(--risk-critical)",
  Offline: "var(--border-strong)",
};

const FILTERS = ["All", "Online", "Warning", "Critical", "Offline"] as const;

export default function _noop() {
  return null;
}

function SensorDataPage() {
  const { simProgress, lastSync } = useSanketState();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [query, setQuery] = useState("");

  const rows = useMemo(
    () =>
      SENSORS.filter((s) => (filter === "All" ? true : s.status === filter)).filter((s) =>
        query
          ? `${s.id} ${s.type} ${AREAS.find((a) => a.id === s.areaId)?.name ?? ""}`
              .toLowerCase()
              .includes(query.toLowerCase())
          : true,
      ),
    [filter, query],
  );

  const reading = (type: string, areaId: string) => {
    const snap = snapshotArea(areaId, simProgress);
    switch (type) {
      case "Rainfall":
        return snap.factors.rainfall.toFixed(1);
      case "Soil Moisture":
        return snap.factors.soilMoisture.toFixed(1);
      case "Ground Movement":
        return snap.factors.groundMovement.toFixed(2);
      case "Tilt":
        return (snap.factors.groundMovement * 1.6).toFixed(2);
      case "Temperature":
        return (18.4 - snap.area.elevation / 900).toFixed(1);
      default:
        return (72 + snap.factors.soilMoisture * 0.25).toFixed(0);
    }
  };

  const stats = [
    { label: "Total nodes", value: NETWORK.total, icon: Radio, tone: "var(--foreground)" },
    { label: "Online", value: NETWORK.online, icon: Wifi, tone: "var(--risk-low)" },
    { label: "Warning", value: NETWORK.warning, icon: SignalHigh, tone: "var(--risk-moderate)" },
    { label: "Offline", value: NETWORK.offline, icon: BatteryCharging, tone: "var(--risk-critical)" },
  ];

  return (
    <AppShell>
      <PageTitle
        title="Sensor Data"
        subtitle="IoT field network health, uplink status and live readings"
      />

      <div className="mb-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="panel panel-hover px-4 py-4">
            <div className="flex items-center justify-between">
              <span className="label-xs">{s.label}</span>
              <s.icon className="size-3.5 text-muted-foreground" />
            </div>
            <div className="mono-num mt-2.5 text-[30px] leading-none" style={{ color: s.tone }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div className="panel overflow-hidden">
        <PanelHeader
          title="Sensor registry"
          subtitle={`${rows.length} of ${SENSORS.length} nodes shown · synced ${lastSync}`}
          right={
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-md border border-border px-2 py-1.5">
                <Search className="size-3 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search node"
                  className="w-28 bg-transparent font-mono text-[11px] text-foreground outline-none placeholder:text-muted-foreground/70"
                />
              </div>
            </div>
          }
        />

        <div className="flex flex-wrap gap-1.5 border-b border-border px-4 py-2.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-sm border px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] uppercase transition-colors",
                filter === f
                  ? "border-border-strong bg-muted text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-border">
                {["Node", "Type", "Location", "Reading", "Trend", "Battery", "Signal", "Status"].map(
                  (h) => (
                    <th key={h} className="label-xs px-4 py-2.5 font-normal">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {rows.map((s, i) => {
                const area = AREAS.find((a) => a.id === s.areaId);
                return (
                  <tr
                    key={s.id}
                    className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40"
                  >
                    <td className="mono-num px-4 py-2.5 text-[12px] text-foreground">{s.id}</td>
                    <td className="px-4 py-2.5 text-[12.5px] text-muted-foreground">{s.type}</td>
                    <td className="px-4 py-2.5 text-[12.5px] text-muted-foreground">
                      {area?.name ?? "—"}
                    </td>
                    <td className="mono-num px-4 py-2.5 text-[12px] text-foreground">
                      {s.status === "Offline" ? "—" : `${reading(s.type, s.areaId)} ${s.unit}`}
                    </td>
                    <td className="w-28 px-4 py-2">
                      {s.status === "Offline" ? (
                        <span className="label-xs">no uplink</span>
                      ) : (
                        <Sparkline
                          data={series(i * 5, 12, 40, 8)}
                          height={22}
                          color={STATUS_COLOR[s.status]}
                        />
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="flex items-center gap-2">
                        <span className="h-1 w-12 overflow-hidden rounded-full bg-border">
                          <span
                            className="block h-full rounded-full"
                            style={{
                              width: `${s.battery}%`,
                              backgroundColor:
                                s.battery > 50
                                  ? "var(--risk-low)"
                                  : s.battery > 20
                                    ? "var(--risk-moderate)"
                                    : "var(--risk-critical)",
                            }}
                          />
                        </span>
                        <span className="mono-num text-[11px] text-muted-foreground">
                          {s.battery}%
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-[12.5px] text-muted-foreground">{s.signal}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 font-mono text-[9px] tracking-[0.12em] uppercase"
                        style={{
                          color: STATUS_COLOR[s.status],
                          borderColor: STATUS_COLOR[s.status],
                          backgroundColor: `color-mix(in oklab, ${STATUS_COLOR[s.status]} 12%, transparent)`,
                        }}
                      >
                        <span
                          className="size-1.5 rotate-45"
                          style={{ backgroundColor: STATUS_COLOR[s.status] }}
                        />
                        {s.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}

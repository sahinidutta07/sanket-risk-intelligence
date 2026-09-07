import { useState } from "react";
import { Layers, Minus, Plus, Search, Crosshair } from "lucide-react";
import terrain from "@/assets/terrain.jpg";
import { cn } from "@/lib/utils";
import { RISK_TOKEN, SENSORS, type RiskLevel } from "@/lib/risk-engine";
import { selectArea, snapshotAreas, useSanketState } from "@/lib/sanket-store";
import { LiveDot, riskText } from "./primitives";

const LEGEND: { level: RiskLevel; label: string }[] = [
  { level: "LOW", label: "Low" },
  { level: "MODERATE", label: "Moderate" },
  { level: "HIGH", label: "High" },
  { level: "VERY HIGH", label: "Very high" },
  { level: "CRITICAL", label: "Critical" },
];

export const DEFAULT_LAYERS = {
  risk: true,
  sensors: true,
  rainfall: true,
  soil: false,
  movement: false,
  terrain: false,
};

export type MapLayers = typeof DEFAULT_LAYERS;

export const LAYER_LABELS: Record<keyof MapLayers, string> = {
  risk: "Risk zones",
  sensors: "Sensor network",
  rainfall: "Rainfall",
  soil: "Soil moisture",
  movement: "Ground movement",
  terrain: "Terrain / slope",
};

export function MapLayerControl({
  layers,
  onChange,
}: {
  layers: MapLayers;
  onChange: (l: MapLayers) => void;
}) {
  return (
    <div className="rounded-md border border-border bg-card/95 p-3 backdrop-blur">
      <div className="label-xs mb-2 flex items-center gap-1.5">
        <Layers className="size-3" /> Layers
      </div>
      <div className="space-y-1.5">
        {(Object.keys(LAYER_LABELS) as (keyof MapLayers)[]).map((k) => (
          <label
            key={k}
            className="flex cursor-pointer items-center gap-2 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <input
              type="checkbox"
              checked={layers[k]}
              onChange={() => onChange({ ...layers, [k]: !layers[k] })}
              className="size-3.5 accent-[var(--primary)]"
            />
            {LAYER_LABELS[k]}
          </label>
        ))}
      </div>
    </div>
  );
}

export function MapLegend({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-md border border-border bg-card/95 px-3 py-2 backdrop-blur",
        className,
      )}
    >
      {LEGEND.map((l) => (
        <span key={l.level} className="flex items-center gap-1.5">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: `var(--${RISK_TOKEN[l.level]})` }}
          />
          <span className="label-xs">{l.label}</span>
        </span>
      ))}
    </div>
  );
}

export function RiskMap({
  height = 420,
  layers = DEFAULT_LAYERS,
  showControls = true,
  showSensorStatus = false,
  onSensorSelect,
  className,
}: {
  height?: number | string;
  layers?: MapLayers;
  showControls?: boolean;
  showSensorStatus?: boolean;
  onSensorSelect?: (id: string) => void;
  className?: string;
}) {
  const { simProgress, selectedAreaId, lastSync } = useSanketState();
  const [zoom, setZoom] = useState(1);
  const [query, setQuery] = useState("");
  const snaps = snapshotAreas(simProgress);
  const visible = snaps.filter((s) =>
    query ? s.area.name.toLowerCase().includes(query.toLowerCase()) : true,
  );

  return (
    <div
      className="relative overflow-hidden rounded-lg border border-border bg-[#050B12]"
      style={{ height }}
    >
      <div
        className="absolute inset-0 origin-center transition-transform duration-500 ease-out"
        style={{ transform: `scale(${zoom})` }}
      >
        <img
          src={terrain}
          alt="Satellite terrain imagery of the Darjeeling–Kalimpong region"
          width={1536}
          height={1024}
          className={cn(
            "absolute inset-0 size-full object-cover transition-all duration-300",
            layers.terrain ? "opacity-90 contrast-125" : "opacity-70",
          )}
        />
        <div className="grid-backdrop absolute inset-0 opacity-60" />

        {layers.rainfall && (
          <div
            className="absolute inset-0 opacity-35 mix-blend-screen"
            style={{
              background:
                "radial-gradient(closest-side at 32% 32%, oklch(0.66 0.16 245 / 0.5), transparent), radial-gradient(closest-side at 24% 55%, oklch(0.66 0.16 245 / 0.35), transparent)",
            }}
          />
        )}
        {layers.soil && (
          <div
            className="absolute inset-0 opacity-30 mix-blend-screen"
            style={{
              background:
                "radial-gradient(closest-side at 45% 45%, oklch(0.72 0.17 55 / 0.45), transparent)",
            }}
          />
        )}
        {layers.movement && (
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, oklch(0.82 0.16 88 / 0.14) 0 2px, transparent 2px 14px)",
            }}
          />
        )}

        {/* risk zones */}
        {layers.risk &&
          snaps.map((s) => {
            const color = `var(--${RISK_TOKEN[s.level]})`;
            const r = 8 + (s.score / 100) * 12;
            return (
              <button
                key={s.area.id}
                onClick={() => selectArea(s.area.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500"
                style={{
                  left: `${s.area.x}%`,
                  top: `${s.area.y}%`,
                  width: `${r * 2}%`,
                  paddingBottom: `${r * 2}%`,
                  height: 0,
                  background: `radial-gradient(closest-side, color-mix(in oklab, ${color} 46%, transparent), transparent)`,
                }}
                aria-label={`${s.area.name} risk zone`}
              />
            );
          })}

        {/* area markers */}
        {visible.map((s) => {
          const color = `var(--${RISK_TOKEN[s.level]})`;
          const active = s.area.id === selectedAreaId;
          return (
            <button
              key={s.area.id}
              onClick={() => selectArea(s.area.id)}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${s.area.x}%`, top: `${s.area.y}%` }}
            >
              <span
                className={cn(
                  "block size-2.5 rounded-full ring-2 transition-all duration-200",
                  active ? "scale-125" : "group-hover:scale-125",
                )}
                style={{ backgroundColor: color, boxShadow: `0 0 0 4px color-mix(in oklab, ${color} 22%, transparent)` }}
              />
              <span
                className={cn(
                  "absolute top-4 left-1/2 -translate-x-1/2 rounded-sm border px-1.5 py-0.5 font-mono text-[10px] whitespace-nowrap backdrop-blur transition-colors",
                  active
                    ? "border-border-strong bg-card text-foreground"
                    : "border-border/70 bg-background/75 text-muted-foreground group-hover:text-foreground",
                )}
              >
                {s.area.name} <span style={{ color }}>{s.score}</span>
              </span>
            </button>
          );
        })}

        {/* sensor markers */}
        {layers.sensors &&
          SENSORS.map((sn) => {
            const tone =
              sn.status === "Online"
                ? "var(--risk-low)"
                : sn.status === "Warning"
                  ? "var(--risk-moderate)"
                  : sn.status === "Critical"
                    ? "var(--risk-critical)"
                    : "var(--border-strong)";
            return (
              <button
                key={sn.id}
                onClick={() => onSensorSelect?.(sn.id)}
                title={`${sn.id} · ${sn.type} · ${sn.status}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-150 hover:scale-150"
                style={{ left: `${sn.x}%`, top: `${sn.y}%` }}
              >
                <span
                  className="block size-1.5 rotate-45 border"
                  style={{ borderColor: tone, backgroundColor: `color-mix(in oklab, ${tone} 40%, transparent)` }}
                />
              </button>
            );
          })}
      </div>

      {/* overlays */}
      <div className="pointer-events-none absolute top-3 left-3 flex items-center gap-2 rounded-md border border-border bg-background/80 px-2.5 py-1.5 backdrop-blur">
        <LiveDot tone="critical" />
        <span className="label-xs">Live — updated</span>
        <span className="mono-num text-[10px] text-foreground">{lastSync}</span>
      </div>

      {showControls && (
        <>
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <div className="flex items-center gap-2 rounded-md border border-border bg-background/85 px-2 py-1.5 backdrop-blur">
              <Search className="size-3 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search location"
                className="w-28 bg-transparent font-mono text-[11px] text-foreground outline-none placeholder:text-muted-foreground/70"
              />
            </div>
            <div className="flex flex-col overflow-hidden rounded-md border border-border bg-background/85 backdrop-blur">
              <button
                onClick={() => setZoom((z) => Math.min(1.8, +(z + 0.2).toFixed(2)))}
                className="p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Zoom in"
              >
                <Plus className="size-3.5" />
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(1, +(z - 0.2).toFixed(2)))}
                className="border-t border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Zoom out"
              >
                <Minus className="size-3.5" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="border-t border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Reset view"
              >
                <Crosshair className="size-3.5" />
              </button>
            </div>
          </div>
          <MapLegend className="absolute bottom-3 left-3" />
          {showSensorStatus && (
            <div className="absolute right-3 bottom-3 flex items-center gap-3 rounded-md border border-border bg-card/95 px-3 py-2 backdrop-blur">
              {[
                ["Online", "var(--risk-low)"],
                ["Warning", "var(--risk-moderate)"],
                ["Critical", "var(--risk-critical)"],
                ["Offline", "var(--border-strong)"],
              ].map(([l, c]) => (
                <span key={l} className="flex items-center gap-1.5">
                  <span className="size-1.5 rotate-45" style={{ backgroundColor: c }} />
                  <span className="label-xs">{l}</span>
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export { riskText };

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageTitle } from "@/components/sanket/AppShell";
import {
  DEFAULT_LAYERS,
  MapLayerControl,
  RiskMap,
  type MapLayers,
} from "@/components/sanket/RiskMap";
import { AreaDetails } from "@/components/sanket/AreaDetails";
import { PanelHeader, RiskBadge } from "@/components/sanket/primitives";
import { selectArea, snapshotAreas, useSanketState } from "@/lib/sanket-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/risk-map")({
  head: () => ({
    meta: [
      { title: "Risk Map — SANKET Landslide Intelligence" },
      {
        name: "description",
        content:
          "Interactive landslide risk map of the Darjeeling–Kalimpong hills with toggleable rainfall, soil moisture, ground movement and terrain layers.",
      },
      { property: "og:title", content: "Risk Map — SANKET" },
      {
        property: "og:description",
        content:
          "Zone-by-zone landslide risk across monitored hill regions, with switchable environmental map layers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RiskMapPage,
});

function RiskMapPage() {
  const [layers, setLayers] = useState<MapLayers>(DEFAULT_LAYERS);
  const { simProgress, selectedAreaId } = useSanketState();
  const snaps = snapshotAreas(simProgress).sort((a, b) => b.score - a.score);

  return (
    <AppShell>
      <PageTitle
        title="Risk Map"
        subtitle="Geospatial landslide risk across all monitored zones"
      />

      <div className="grid grid-cols-1 items-start gap-3 xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="panel overflow-hidden">
          <PanelHeader
            title="Regional risk surface"
            subtitle="Click a zone marker to inspect its contributing factors"
          />
          <div className="p-3">
            <RiskMap height={520} layers={layers} showSensorStatus={layers.sensors} />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <MapLayerControl layers={layers} onChange={setLayers} />

          <div className="panel overflow-hidden">
            <PanelHeader title="Zones by risk" />
            <ul className="divide-y divide-border/60">
              {snaps.map((s) => (
                <li key={s.area.id}>
                  <button
                    onClick={() => selectArea(s.area.id)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted/40",
                      s.area.id === selectedAreaId && "bg-muted/50",
                    )}
                  >
                    <span>
                      <span className="block text-[13px] text-foreground">{s.area.name}</span>
                      <span className="label-xs">{s.area.district}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="mono-num text-[13px] text-foreground">{s.score}</span>
                      <RiskBadge level={s.level} size="xs" />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <AreaDetails compact />
        </div>
      </div>
    </AppShell>
  );
}

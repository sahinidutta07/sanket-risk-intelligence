import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarRange, Download, History } from "lucide-react";
import { AppShell, PageTitle } from "@/components/sanket/AppShell";
import { PanelHeader, RiskBadge, Sparkline, series } from "@/components/sanket/primitives";
import { RISK_TOKEN, riskLevel } from "@/lib/risk-engine";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/historical-data")({
  head: () => ({
    meta: [
      { title: "Historical Data — SANKET Landslide Intelligence" },
      {
        name: "description",
        content:
          "Twelve years of recorded landslide events, monsoon rainfall trends and seasonal risk patterns across the Darjeeling and Kalimpong hills.",
      },
      { property: "og:title", content: "Historical Data — SANKET" },
      {
        property: "og:description",
        content:
          "Past landslide events, monthly rainfall totals and seasonal risk patterns used to train and validate the SANKET model.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoricalDataPage,
});

const MONTHS = [
  { m: "Jan", rain: 18, events: 0 },
  { m: "Feb", rain: 26, events: 0 },
  { m: "Mar", rain: 48, events: 1 },
  { m: "Apr", rain: 96, events: 2 },
  { m: "May", rain: 214, events: 4 },
  { m: "Jun", rain: 612, events: 11 },
  { m: "Jul", rain: 834, events: 18 },
  { m: "Aug", rain: 706, events: 14 },
  { m: "Sep", rain: 486, events: 9 },
  { m: "Oct", rain: 128, events: 3 },
  { m: "Nov", rain: 22, events: 0 },
  { m: "Dec", rain: 12, events: 0 },
];

const EVENTS = [
  { id: "EV-2024-07", date: "12 Jul 2024", location: "Lebong, Darjeeling", rain: 168, score: 91, casualties: 3, damage: "Road washout, 14 homes" },
  { id: "EV-2023-08", date: "04 Aug 2023", location: "Kalimpong", rain: 142, score: 86, casualties: 1, damage: "NH-10 blockage 36 hrs" },
  { id: "EV-2023-06", date: "27 Jun 2023", location: "Mirik", rain: 121, score: 78, casualties: 0, damage: "Tea estate slope failure" },
  { id: "EV-2022-09", date: "09 Sep 2022", location: "Kurseong", rain: 108, score: 74, casualties: 2, damage: "Rail line displacement" },
  { id: "EV-2022-07", date: "18 Jul 2022", location: "Darjeeling", rain: 154, score: 88, casualties: 5, damage: "Retaining wall collapse" },
  { id: "EV-2021-08", date: "22 Aug 2021", location: "Sukhiapokhri", rain: 97, score: 69, casualties: 0, damage: "Debris flow across NH-110" },
  { id: "EV-2020-06", date: "26 Jun 2020", location: "Lebong, Darjeeling", rain: 133, score: 82, casualties: 2, damage: "Slope failure, 6 homes" },
  { id: "EV-2019-07", date: "11 Jul 2019", location: "Mirik", rain: 176, score: 93, casualties: 8, damage: "Major landslide, 30 homes" },
];

const RANGES = ["1 year", "3 years", "5 years", "12 years"] as const;

function HistoricalDataPage() {
  const [range, setRange] = useState<(typeof RANGES)[number]>("12 years");
  const maxRain = Math.max(...MONTHS.map((m) => m.rain));

  const summary = [
    { label: "Recorded events", value: "68" },
    { label: "Monsoon share", value: "78%" },
    { label: "Peak 24h rainfall", value: "176 mm" },
    { label: "Model hindcast hits", value: "62 / 68" },
  ];

  return (
    <AppShell>
      <PageTitle
        title="Historical Data"
        subtitle="Recorded landslide events, rainfall trends and seasonal patterns"
      />

      <div className="mb-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {summary.map((s) => (
          <div key={s.label} className="panel panel-hover px-4 py-4">
            <div className="label-xs">{s.label}</div>
            <div className="mono-num mt-2.5 text-[28px] leading-none text-foreground">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="panel overflow-hidden">
          <PanelHeader
            title="Monsoon rainfall vs landslide events"
            subtitle="Monthly averages across the monitored districts"
            right={
              <div className="flex gap-1.5">
                {RANGES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={cn(
                      "rounded-sm border px-2 py-1 font-mono text-[10px] tracking-[0.1em] uppercase transition-colors",
                      range === r
                        ? "border-border-strong bg-muted text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            }
          />
          <div className="px-4 py-5">
            <div className="flex h-[220px] items-end gap-2">
              {MONTHS.map((m) => (
                <div key={m.m} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="mono-num text-[10px] text-muted-foreground">{m.events || ""}</span>
                  <div
                    className="w-full rounded-t-sm transition-all duration-500"
                    style={{
                      height: `${(m.rain / maxRain) * 168}px`,
                      backgroundColor:
                        m.events >= 10
                          ? "var(--risk-critical)"
                          : m.events >= 4
                            ? "var(--risk-high)"
                            : m.events >= 1
                              ? "var(--risk-moderate)"
                              : "var(--border-strong)",
                      opacity: 0.85,
                    }}
                  />
                  <span className="label-xs">{m.m}</span>
                </div>
              ))}
            </div>
            <div className="label-xs mt-3">
              Bar height = mean monthly rainfall (mm) · number above = recorded landslide events
            </div>
          </div>
        </div>

        <div className="panel overflow-hidden">
          <PanelHeader
            title="Seasonal risk pattern"
            subtitle="Averaged regional risk index by season"
            right={<CalendarRange className="size-4 text-muted-foreground" />}
          />
          <ul className="divide-y divide-border/60">
            {[
              { s: "Pre-monsoon (Mar–May)", v: 41 },
              { s: "Monsoon (Jun–Sep)", v: 86 },
              { s: "Post-monsoon (Oct–Nov)", v: 48 },
              { s: "Winter (Dec–Feb)", v: 22 },
            ].map((row, i) => {
              const lvl = riskLevel(row.v);
              return (
                <li key={row.s} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-foreground">{row.s}</span>
                    <RiskBadge level={lvl} size="xs" />
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                      <span
                        className="block h-full rounded-full"
                        style={{ width: `${row.v}%`, backgroundColor: `var(--${RISK_TOKEN[lvl]})` }}
                      />
                    </span>
                    <span className="mono-num text-[12px] text-foreground">{row.v}</span>
                  </div>
                  <div className="mt-1.5">
                    <Sparkline
                      data={series(i * 6, 14, row.v, 8)}
                      height={22}
                      color={`var(--${RISK_TOKEN[lvl]})`}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="panel overflow-hidden">
        <PanelHeader
          title="Event archive"
          subtitle="Verified landslide incidents used for model training and hindcast validation"
          right={
            <span className="flex items-center gap-3">
              <History className="size-4 text-muted-foreground" />
              <button className="flex items-center gap-1.5 rounded-sm border border-border px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-muted-foreground uppercase transition-colors hover:text-foreground">
                <Download className="size-3" /> Export
              </button>
            </span>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-border">
                {["Event", "Date", "Location", "24h rainfall", "Risk score", "Severity", "Casualties", "Reported damage"].map((h) => (
                  <th key={h} className="label-xs px-4 py-2.5 font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EVENTS.map((e) => {
                const lvl = riskLevel(e.score);
                return (
                  <tr
                    key={e.id}
                    className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/40"
                  >
                    <td className="mono-num px-4 py-2.5 text-[12px] text-foreground">{e.id}</td>
                    <td className="mono-num px-4 py-2.5 text-[12px] text-muted-foreground">{e.date}</td>
                    <td className="px-4 py-2.5 text-[12.5px] text-muted-foreground">{e.location}</td>
                    <td className="mono-num px-4 py-2.5 text-[12px] text-foreground">{e.rain} mm</td>
                    <td className="mono-num px-4 py-2.5 text-[12px] text-foreground">{e.score}</td>
                    <td className="px-4 py-2.5">
                      <RiskBadge level={lvl} size="xs" />
                    </td>
                    <td className="mono-num px-4 py-2.5 text-[12px] text-muted-foreground">
                      {e.casualties}
                    </td>
                    <td className="px-4 py-2.5 text-[12.5px] text-muted-foreground">{e.damage}</td>
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

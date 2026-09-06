import { AlertTriangle, Info, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSanketState, type AlertItem } from "@/lib/sanket-store";

const TONE: Record<AlertItem["severity"], { color: string; icon: React.ElementType }> = {
  CRITICAL: { color: "var(--risk-critical)", icon: ShieldAlert },
  HIGH: { color: "var(--risk-high)", icon: AlertTriangle },
  MODERATE: { color: "var(--risk-moderate)", icon: AlertTriangle },
  INFO: { color: "var(--primary)", icon: Info },
};

export function AlertRow({ alert, timeline = false }: { alert: AlertItem; timeline?: boolean }) {
  const tone = TONE[alert.severity];
  const Icon = tone.icon;
  return (
    <li
      className={cn(
        "relative flex gap-3 px-4 py-3 transition-colors hover:bg-accent/25",
        timeline && "pl-9",
      )}
      style={{ boxShadow: `inset 2px 0 0 0 ${tone.color}` }}
    >
      {timeline && (
        <span
          className="absolute top-4 left-4 size-2 rounded-full"
          style={{ backgroundColor: tone.color }}
        />
      )}
      {!timeline && <Icon className="mt-0.5 size-4 shrink-0" style={{ color: tone.color }} />}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="font-mono text-[10px] tracking-[0.12em]"
            style={{ color: tone.color }}
          >
            {alert.severity}
          </span>
          <span className="text-[13px] font-medium text-foreground">{alert.location}</span>
          <span className="mono-num ml-auto text-[11px] text-muted-foreground">{alert.time}</span>
        </div>
        <p className="mt-0.5 text-[12px] text-muted-foreground">{alert.trigger}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span
            className={cn(
              "rounded-sm border px-1.5 py-0.5 font-mono text-[9px] tracking-[0.1em]",
              alert.status === "ACTIVE"
                ? "border-risk-critical/40 text-risk-critical"
                : alert.status === "ACKNOWLEDGED"
                  ? "border-risk-moderate/40 text-risk-moderate"
                  : "border-border text-muted-foreground",
            )}
          >
            {alert.status}
          </span>
          <span className="mono-num text-[10px] text-muted-foreground/70">{alert.id}</span>
        </div>
      </div>
    </li>
  );
}

export function AlertTimeline({ limit, timeline = false }: { limit?: number; timeline?: boolean }) {
  const { alerts } = useSanketState();
  const list = limit ? alerts.slice(0, limit) : alerts;
  return (
    <ul className={cn("divide-y divide-border/60", timeline && "relative")}>
      {timeline && <span className="absolute top-4 bottom-4 left-5 w-px bg-border" />}
      {list.map((a) => (
        <AlertRow key={a.id} alert={a} timeline={timeline} />
      ))}
    </ul>
  );
}

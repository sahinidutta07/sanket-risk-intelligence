import { AlertTriangle, BrainCircuit, Cpu, Gauge, Radio, Waves } from "lucide-react";

const STEPS = [
  { label: "Sensors", icon: Radio, note: "40 field nodes" },
  { label: "IoT Gateway", icon: Cpu, note: "LoRa / GSM" },
  { label: "Real-Time Data", icon: Waves, note: "1.8s latency" },
  { label: "AI Risk Engine", icon: BrainCircuit, note: "Random Forest" },
  { label: "Risk Prediction", icon: Gauge, note: "Score + confidence" },
  { label: "Early Warning", icon: AlertTriangle, note: "Authority alert" },
];

export function DataPipeline() {
  return (
    <div className="panel px-4 py-4">
      <div className="label-xs mb-3">Data pipeline</div>
      <div className="flex flex-wrap items-stretch gap-2">
        {STEPS.map((s, i) => (
          <div key={s.label} className="flex flex-1 items-center gap-2">
            <div className="min-w-0 flex-1 rounded-md border border-border bg-surface/60 px-3 py-2.5 transition-colors duration-200 hover:border-border-strong">
              <s.icon className="size-3.5 text-primary" />
              <div className="mt-1.5 truncate text-[12px] text-foreground">{s.label}</div>
              <div className="label-xs mt-0.5 truncate">{s.note}</div>
            </div>
            {i < STEPS.length - 1 && (
              <span className="hidden text-border-strong lg:inline">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

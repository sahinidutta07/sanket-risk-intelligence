import { useSyncExternalStore } from "react";
import {
  AREAS,
  blendFactors,
  computeRiskScore,
  modelConfidence,
  riskLevel,
  type MonitoredArea,
  type RiskFactors,
} from "./risk-engine";

export interface AlertItem {
  id: string;
  severity: "CRITICAL" | "HIGH" | "MODERATE" | "INFO";
  areaId: string;
  location: string;
  trigger: string;
  time: string;
  status: "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED";
}

export interface SanketState {
  /** 0 = baseline conditions, 1 = peak of simulated rainfall event */
  simProgress: number;
  simRunning: boolean;
  simStage: number;
  selectedAreaId: string;
  lastSync: string;
  alerts: AlertItem[];
  simAlertFired: boolean;
}

const BASE_ALERTS: AlertItem[] = [
  {
    id: "AL-2291",
    severity: "HIGH",
    areaId: "mirik",
    location: "Mirik, Darjeeling",
    trigger: "Soil moisture threshold exceeded (71%)",
    time: "10:18 AM",
    status: "ACTIVE",
  },
  {
    id: "AL-2290",
    severity: "MODERATE",
    areaId: "kalimpong",
    location: "Kalimpong",
    trigger: "Ground movement drift 1.4 mm/hr sustained",
    time: "09:52 AM",
    status: "ACKNOWLEDGED",
  },
  {
    id: "AL-2289",
    severity: "HIGH",
    areaId: "lebong",
    location: "Lebong, Darjeeling",
    trigger: "Rainfall intensity above 55 mm/24h",
    time: "09:31 AM",
    status: "ACTIVE",
  },
  {
    id: "AL-2288",
    severity: "INFO",
    areaId: "darjeeling",
    location: "Darjeeling",
    trigger: "Sensor SN-109 lost uplink — dispatched for service",
    time: "08:47 AM",
    status: "ACKNOWLEDGED",
  },
  {
    id: "AL-2287",
    severity: "MODERATE",
    areaId: "kurseong",
    location: "Kurseong",
    trigger: "Slope tilt variance detected on NH-110 corridor",
    time: "08:12 AM",
    status: "RESOLVED",
  },
];

let state: SanketState = {
  simProgress: 0,
  simRunning: false,
  simStage: 0,
  selectedAreaId: "lebong",
  lastSync: "10:24:30 AM",
  alerts: BASE_ALERTS,
  simAlertFired: false,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.add;
  listeners.forEach((l) => l());
}

function set(patch: Partial<SanketState>) {
  state = { ...state, ...patch };
  emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const getSnapshot = () => state;

export function useSanket<T>(selector: (s: SanketState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(getSnapshot()),
    () => selector(state),
  );
}

export function useSanketState() {
  return useSyncExternalStore(subscribe, getSnapshot, () => state);
}

export const SIM_STAGES = [
  "Ingesting rainfall telemetry",
  "Soil moisture rising",
  "Ground movement detected",
  "AI risk engine recalculating",
  "Risk level escalated — alert issued",
];

let timer: ReturnType<typeof setInterval> | null = null;

export function startSimulation() {
  if (state.simRunning) return;
  set({ simRunning: true, simAlertFired: false });
  const step = 0.02;
  timer = setInterval(() => {
    const next = Math.min(1, state.simProgress + step);
    const stage = Math.min(SIM_STAGES.length - 1, Math.floor(next * SIM_STAGES.length));
    set({ simProgress: next, simStage: stage });
    if (next >= 1) {
      stopTimer();
      fireCriticalAlert();
      set({ simRunning: false });
    }
  }, 90);
}

function stopTimer() {
  if (timer) clearInterval(timer);
  timer = null;
}

function fireCriticalAlert() {
  if (state.simAlertFired) return;
  const alert: AlertItem = {
    id: "AL-2292",
    severity: "CRITICAL",
    areaId: "lebong",
    location: "Lebong, Darjeeling",
    trigger: "Heavy rainfall + high soil moisture + ground movement",
    time: "10:30 AM",
    status: "ACTIVE",
  };
  set({ alerts: [alert, ...state.alerts], simAlertFired: true, selectedAreaId: "lebong" });
}

export function resetSimulation() {
  stopTimer();
  set({
    simRunning: false,
    simProgress: 0,
    simStage: 0,
    simAlertFired: false,
    alerts: BASE_ALERTS,
  });
}

export function selectArea(id: string) {
  set({ selectedAreaId: id });
}

export function setLastSync(t: string) {
  set({ lastSync: t });
}

/* ---------- derived helpers ---------- */

export function areaFactors(area: MonitoredArea, progress: number): RiskFactors {
  return blendFactors(area.base, area.storm, progress);
}

export interface AreaSnapshot {
  area: MonitoredArea;
  factors: RiskFactors;
  score: number;
  level: ReturnType<typeof riskLevel>;
  confidence: number;
}

export function snapshotAreas(progress: number): AreaSnapshot[] {
  return AREAS.map((area) => {
    const factors = areaFactors(area, progress);
    const score = computeRiskScore(factors);
    return {
      area,
      factors,
      score,
      level: riskLevel(score),
      confidence: modelConfidence(factors),
    };
  });
}

export function snapshotArea(id: string, progress: number): AreaSnapshot {
  const all = snapshotAreas(progress);
  return all.find((a) => a.area.id === id) ?? all[0];
}

export function overallRisk(progress: number) {
  const snaps = snapshotAreas(progress);
  const weighted = snaps.reduce((s, a) => s + a.score, 0) / snaps.length;
  const peak = Math.max(...snaps.map((a) => a.score));
  const score = Math.round(weighted * 0.45 + peak * 0.55);
  return { score, level: riskLevel(score), snaps };
}

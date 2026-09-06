/**
 * SANKET deterministic risk engine.
 *
 * Risk score is a weighted, monotonic function of five contributing factors.
 * No randomness: the same inputs always produce the same score.
 */

export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "VERY HIGH" | "CRITICAL";

export interface RiskFactors {
  /** mm accumulated (24h) */
  rainfall: number;
  /** % volumetric */
  soilMoisture: number;
  /** degrees */
  slope: number;
  /** mm/hr */
  groundMovement: number;
  /** 0 (stable forest) .. 1 (bare / deforested) */
  landCover: number;
}

export const FACTOR_WEIGHTS = {
  rainfall: 0.35,
  soilMoisture: 0.26,
  slope: 0.18,
  landCover: 0.12,
  groundMovement: 0.09,
} as const;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function normalizeFactors(f: RiskFactors) {
  return {
    rainfall: clamp01(f.rainfall / 130),
    soilMoisture: clamp01((f.soilMoisture - 20) / 70),
    slope: clamp01((f.slope - 8) / 32),
    landCover: clamp01(f.landCover),
    groundMovement: clamp01(f.groundMovement / 3.2),
  };
}

export function computeRiskScore(f: RiskFactors): number {
  const n = normalizeFactors(f);
  const raw =
    n.rainfall * FACTOR_WEIGHTS.rainfall +
    n.soilMoisture * FACTOR_WEIGHTS.soilMoisture +
    n.slope * FACTOR_WEIGHTS.slope +
    n.landCover * FACTOR_WEIGHTS.landCover +
    n.groundMovement * FACTOR_WEIGHTS.groundMovement;
  // compound term: saturated soil + heavy rain is worse than either alone
  const compound = n.rainfall * n.soilMoisture * 0.14;
  return Math.round(clamp01(raw + compound) * 100);
}

/** Per-factor contribution to the final score, in percent of total. */
export function factorContributions(f: RiskFactors) {
  const n = normalizeFactors(f);
  const parts = (Object.keys(FACTOR_WEIGHTS) as (keyof RiskFactors)[]).map((k) => ({
    key: k,
    value: n[k] * FACTOR_WEIGHTS[k],
  }));
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  return parts
    .map((p) => ({ key: p.key, share: Math.round((p.value / total) * 100) }))
    .sort((a, b) => b.share - a.share);
}

export function riskLevel(score: number): RiskLevel {
  if (score >= 85) return "CRITICAL";
  if (score >= 72) return "VERY HIGH";
  if (score >= 55) return "HIGH";
  if (score >= 35) return "MODERATE";
  return "LOW";
}

export const RISK_TOKEN: Record<RiskLevel, string> = {
  LOW: "risk-low",
  MODERATE: "risk-moderate",
  HIGH: "risk-high",
  "VERY HIGH": "risk-vhigh",
  CRITICAL: "risk-critical",
};

/** AI model confidence: higher when signals agree and data is fresh. */
export function modelConfidence(f: RiskFactors): number {
  const n = normalizeFactors(f);
  const vals = [n.rainfall, n.soilMoisture, n.groundMovement];
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const spread = Math.max(...vals) - Math.min(...vals);
  return Math.round(clamp01(0.72 + mean * 0.28 - spread * 0.18) * 100);
}

export function impactLabel(share: number) {
  if (share >= 25) return "High impact";
  if (share >= 14) return "Moderate impact";
  return "Low impact";
}

export interface MonitoredArea {
  id: string;
  name: string;
  district: string;
  /** relative position on the schematic map, 0..100 */
  x: number;
  y: number;
  elevation: number;
  population: string;
  base: RiskFactors;
  /** conditions at the peak of a simulated heavy-rainfall event */
  storm: RiskFactors;
}

export const AREAS: MonitoredArea[] = [
  {
    id: "lebong",
    name: "Lebong",
    district: "Darjeeling",
    x: 34,
    y: 30,
    elevation: 1860,
    population: "9,400",
    base: { rainfall: 62, soilMoisture: 65, slope: 34, groundMovement: 1.2, landCover: 0.62 },
    storm: { rainfall: 112, soilMoisture: 88, slope: 34, groundMovement: 2.4, landCover: 0.62 },
  },
  {
    id: "darjeeling",
    name: "Darjeeling",
    district: "Darjeeling",
    x: 42,
    y: 41,
    elevation: 2042,
    population: "1,18,800",
    base: { rainfall: 54, soilMoisture: 58, slope: 29, groundMovement: 0.9, landCover: 0.48 },
    storm: { rainfall: 98, soilMoisture: 81, slope: 29, groundMovement: 1.9, landCover: 0.48 },
  },
  {
    id: "kurseong",
    name: "Kurseong",
    district: "Darjeeling",
    x: 52,
    y: 58,
    elevation: 1458,
    population: "42,100",
    base: { rainfall: 47, soilMoisture: 54, slope: 26, groundMovement: 0.7, landCover: 0.4 },
    storm: { rainfall: 88, soilMoisture: 76, slope: 26, groundMovement: 1.5, landCover: 0.4 },
  },
  {
    id: "mirik",
    name: "Mirik",
    district: "Darjeeling",
    x: 22,
    y: 55,
    elevation: 1767,
    population: "11,500",
    base: { rainfall: 58, soilMoisture: 71, slope: 24, groundMovement: 0.8, landCover: 0.45 },
    storm: { rainfall: 96, soilMoisture: 86, slope: 24, groundMovement: 1.7, landCover: 0.45 },
  },
  {
    id: "kalimpong",
    name: "Kalimpong",
    district: "Kalimpong",
    x: 72,
    y: 36,
    elevation: 1247,
    population: "49,400",
    base: { rainfall: 44, soilMoisture: 49, slope: 31, groundMovement: 1.4, landCover: 0.55 },
    storm: { rainfall: 84, soilMoisture: 74, slope: 31, groundMovement: 2.6, landCover: 0.55 },
  },
  {
    id: "sukhiapokhri",
    name: "Sukhiapokhri",
    district: "Darjeeling",
    x: 26,
    y: 40,
    elevation: 2134,
    population: "6,200",
    base: { rainfall: 51, soilMoisture: 56, slope: 28, groundMovement: 0.6, landCover: 0.38 },
    storm: { rainfall: 92, soilMoisture: 79, slope: 28, groundMovement: 1.4, landCover: 0.38 },
  },
  {
    id: "siliguri",
    name: "Siliguri",
    district: "Darjeeling",
    x: 60,
    y: 82,
    elevation: 122,
    population: "5,13,000",
    base: { rainfall: 38, soilMoisture: 44, slope: 6, groundMovement: 0.2, landCover: 0.3 },
    storm: { rainfall: 74, soilMoisture: 66, slope: 6, groundMovement: 0.4, landCover: 0.3 },
  },
];

export type SensorType =
  | "Rainfall"
  | "Soil Moisture"
  | "Ground Movement"
  | "Temperature"
  | "Humidity"
  | "Tilt";

export type SensorStatus = "Online" | "Warning" | "Critical" | "Offline";

export interface Sensor {
  id: string;
  type: SensorType;
  unit: string;
  areaId: string;
  status: SensorStatus;
  battery: number;
  signal: "Strong" | "Moderate" | "Weak";
  x: number;
  y: number;
}

export const SENSORS: Sensor[] = [
  { id: "SN-101", type: "Rainfall", unit: "mm", areaId: "darjeeling", status: "Online", battery: 94, signal: "Strong", x: 44, y: 39 },
  { id: "SN-102", type: "Soil Moisture", unit: "%", areaId: "lebong", status: "Warning", battery: 71, signal: "Moderate", x: 33, y: 28 },
  { id: "SN-103", type: "Ground Movement", unit: "mm/hr", areaId: "kalimpong", status: "Online", battery: 87, signal: "Strong", x: 73, y: 34 },
  { id: "SN-104", type: "Temperature", unit: "°C", areaId: "kurseong", status: "Online", battery: 90, signal: "Strong", x: 53, y: 60 },
  { id: "SN-105", type: "Humidity", unit: "%", areaId: "mirik", status: "Online", battery: 68, signal: "Moderate", x: 21, y: 57 },
  { id: "SN-106", type: "Tilt", unit: "°", areaId: "lebong", status: "Critical", battery: 55, signal: "Weak", x: 36, y: 32 },
  { id: "SN-107", type: "Rainfall", unit: "mm", areaId: "sukhiapokhri", status: "Online", battery: 82, signal: "Strong", x: 27, y: 42 },
  { id: "SN-108", type: "Soil Moisture", unit: "%", areaId: "kurseong", status: "Online", battery: 76, signal: "Strong", x: 50, y: 56 },
  { id: "SN-109", type: "Ground Movement", unit: "mm/hr", areaId: "darjeeling", status: "Offline", battery: 12, signal: "Weak", x: 40, y: 44 },
  { id: "SN-110", type: "Temperature", unit: "°C", areaId: "siliguri", status: "Online", battery: 96, signal: "Strong", x: 61, y: 80 },
  { id: "SN-111", type: "Humidity", unit: "%", areaId: "kalimpong", status: "Online", battery: 88, signal: "Strong", x: 70, y: 39 },
  { id: "SN-112", type: "Tilt", unit: "°", areaId: "mirik", status: "Offline", battery: 0, signal: "Weak", x: 24, y: 53 },
];

export const NETWORK = { total: 40, online: 36, warning: 2, offline: 2, maintenance: 1 };

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function blendFactors(base: RiskFactors, storm: RiskFactors, t: number): RiskFactors {
  return {
    rainfall: +lerp(base.rainfall, storm.rainfall, t).toFixed(1),
    soilMoisture: +lerp(base.soilMoisture, storm.soilMoisture, t).toFixed(1),
    slope: base.slope,
    groundMovement: +lerp(base.groundMovement, storm.groundMovement, t).toFixed(2),
    landCover: base.landCover,
  };
}

export const FACTOR_LABEL: Record<keyof RiskFactors, string> = {
  rainfall: "Rainfall",
  soilMoisture: "Soil Moisture",
  slope: "Slope",
  groundMovement: "Ground Movement",
  landCover: "Land Cover",
};

export const FACTOR_UNIT: Record<keyof RiskFactors, string> = {
  rainfall: "mm",
  soilMoisture: "%",
  slope: "°",
  groundMovement: "mm/hr",
  landCover: "",
};

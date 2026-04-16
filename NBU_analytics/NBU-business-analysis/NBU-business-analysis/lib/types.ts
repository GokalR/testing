export type KpiStatus = "positive" | "negative" | "neutral" | "info";
export type TrendDirection = "up" | "down" | "neutral";
export type Tone = "positive" | "negative" | "neutral";

export interface Trend {
  direction: TrendDirection;
  value: string;
}

export interface KpiCardData {
  label: string;
  value: string;
  subtitle: string;
  trend?: Trend;
  status: KpiStatus;
}

export type ColumnType = "text" | "number" | "trend";
export type ColumnAlign = "left" | "right" | "center";

export interface Column {
  key: string;
  label: string;
  align: ColumnAlign;
  type: ColumnType;
}

export interface TrendCellData {
  value: string;
  tone: Tone;
}

export type StatusVariant = "positive" | "negative" | "warning" | "info" | "neutral";
export type InsightVariant = "info" | "warning" | "danger" | "success";

export interface StepItem {
  label: string;
  status: "completed" | "active" | "upcoming";
}

export interface MiniMetric {
  label: string;
  value: number;
}

export interface RegionSummary {
  id: string;
  name: string;
  population: string;
  unemployment: string;
}

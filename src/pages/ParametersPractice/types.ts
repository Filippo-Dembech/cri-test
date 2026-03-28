export interface Range {
    min: number | string;
    max: number | string;
}

export type Parameter = {
  name: string;
  shortName: string;
  unit: string;
  healthyRange: { min: number | string; max: number | string };
  unhealthyRange: { min: number; max: number };
  step?: number;
  isBloodPressure?: boolean;
};
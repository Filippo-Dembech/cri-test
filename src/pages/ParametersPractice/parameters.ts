import type { Parameter } from "./types";

export const parameters: Parameter[] = [
  {
    name: "Frequenza Cardiaca",
    shortName: "FC",
    unit: "bpm",
    healthyRange: { min: 60, max: 100 },
    unhealthyRange: { min: 40, max: 130 },
    step: 1,
  },
  {
    name: "Frequenza Respiratoria",
    shortName: "FR",
    unit: "atti/min",
    healthyRange: { min: 12, max: 20 },
    unhealthyRange: { min: 6, max: 40 },
    step: 1,
  },
  {
    name: "Pressione Arteriosa",
    shortName: "PA",
    unit: "mmHg",
    healthyRange: { min: "90/60", max: "120/80" },
    unhealthyRange: { min: 70, max: 180 },
    isBloodPressure: true,
    step: 5,
  },
  {
    name: "Glicemia",
    shortName: "BG",
    unit: "mg/dL",
    healthyRange: { min: 70, max: 99 },
    unhealthyRange: { min: 40, max: 210 },
    step: 1,
  },
  {
    name: "Temperatura",
    shortName: "T°",
    unit: "°C",
    healthyRange: { min: 36.0, max: 37.0 },
    unhealthyRange: { min: 34, max: 40 },
    step: 0.1,
  },
  {
    name: "Saturazione",
    shortName: "SpO₂",
    unit: "%",
    healthyRange: { min: 95, max: 100 },
    unhealthyRange: { min: 70, max: 100 },
    step: 1,
  },
];
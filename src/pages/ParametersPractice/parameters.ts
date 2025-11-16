import type { Parameter } from "./types";

export const parameters: Parameter[] = [
    {
        name: "Frequenza Cardiaca (FC)",
        healthyRange: { min: 60, max: 100 },
        unhealthyRange: { min: 30, max: 130 },
    },
    {
        name: "Frequenza Respiratoria (FR)",
        healthyRange: { min: 12, max: 20 },
        unhealthyRange: { min: 6, max: 40 },
    },
    {
        name: "Pressione Arteriosa (PA)",
        healthyRange: { min: "90/60", max: "120/80" },
        unhealthyRange: { min: "70/40", max: "180/120" },
    },
    {
        name: "Glicemia",
        healthyRange: { min: 70, max: 99 },
        unhealthyRange: { min: 40, max: 250 },
    },
    {
        name: "Temperatura",
        healthyRange: { min: 36.1, max: 37.2 },
        unhealthyRange: { min: 34, max: 40 },
    },
    {
        name: "Saturazione (SpO2)",
        healthyRange: { min: 95, max: 100 },
        unhealthyRange: { min: 70, max: 100 },
    },
];
import { type Parameter } from "./types";

export function randBetween(min: number, max: number, step = 1) {
    const steps = Math.floor((max - min) / step);
    return parseFloat(
        (min + Math.floor(Math.random() * (steps + 1)) * step).toFixed(2),
    );
}

export function generateValue(p: Parameter): string {
    if (p.isBloodPressure) {
        const sys = randBetween(p.unhealthyRange.min, p.unhealthyRange.max, 5);
        const dia = randBetween(40, 120, 5);
        return `${sys}/${dia}`;
    }
    const v = randBetween(
        p.unhealthyRange.min,
        p.unhealthyRange.max,
        p.step ?? 1,
    );
    return p.step === 0.1 ? v.toFixed(1) : String(v);
}

export function classifyValue(
    p: Parameter,
    value: string,
): "bassa" | "normale" | "alta" {
    if (p.isBloodPressure) {
        const [sys, dia] = value.split("/").map(Number);
        if (sys < 90 || dia < 40) return "bassa";
        if (sys > 150 || dia > 130) return "alta";
        return "normale";
    }
    const v = parseFloat(value);
    if (v < (p.healthyRange.min as number)) return "bassa";
    if (v > (p.healthyRange.max as number)) return "alta";
    return "normale";
}

export function getHealthyRangeLines(p: Parameter): string[] {
    if (p.isBloodPressure) return ["90/60 – 120/80 mmHg", "PAD < 130 mmHg"];
    return [`${p.healthyRange.min} – ${p.healthyRange.max} ${p.unit}`];
}

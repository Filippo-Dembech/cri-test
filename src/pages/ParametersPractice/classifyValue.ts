import { parameters } from "./parameters";

export function classifyValue(
    paramName: string,
    value: number | string
): "valore-alto" | "valore-basso" | "valore-normale" {
    const param = parameters.find((p) => p.name === paramName);
    if (!param) throw new Error(`Parametro "${paramName}" non trovato`);

    if (typeof value === "string" && value.includes("/")) {
        const [sys, dia] = value.split("/").map(Number);
        if (sys > 150 || dia > 130) return "valore-alto";
        if (sys < 90) return "valore-basso";
        return "valore-normale"
    }
    
    // minimo 25 range tra PAS e PAD
    // fixare saturazione sempre bassa
    // fixare glicemia sempre alta
    // fixare UX terminologia
    // fixare responsività mobile skills
    // ECG autonomia
    // Glicemia autonomia
    // Indice di sospetto

    const { healthyRange } = param;
    if (Number(value) < Number(healthyRange.min)) return "valore-basso";
    if (Number(value) > Number(healthyRange.max)) return "valore-alto";
    return "valore-normale";
}
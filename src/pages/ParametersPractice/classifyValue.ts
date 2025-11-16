import { parameters } from "./parameters";

export function classifyValue(
    paramName: string,
    value: number | string
): "valore-alto" | "valore-basso" | "valore-normale" {
    const param = parameters.find((p) => p.name === paramName);
    if (!param) throw new Error(`Parametro "${paramName}" non trovato`);

    if (typeof value === "string" && value.includes("/")) {
        const [sys, dia] = value.split("/").map(Number);
        const [healthySysMin, healthyDiaMin] = (
            param.healthyRange.min as string
        )
            .split("/")
            .map(Number);
        const [healthySysMax, healthyDiaMax] = (
            param.healthyRange.max as string
        )
            .split("/")
            .map(Number);

        if (sys < healthySysMin || dia < healthyDiaMin) return "valore-basso";
        if (sys > healthySysMax || dia > healthyDiaMax) return "valore-alto";
        return "valore-normale";
    }

    const { healthyRange } = param;
    if (Number(value) < Number(healthyRange.min)) return "valore-basso";
    if (Number(value) > Number(healthyRange.max)) return "valore-alto";
    return "valore-normale";
}
import { parameters } from "./parameters";

export function getRandomUnhealthyValue(paramName: string): number | string {
    const param = parameters.find((p) => p.name === paramName);
    if (!param) throw new Error(`Parametro "${paramName}" non trovato`);

    const { unhealthyRange } = param;

    if (
        typeof unhealthyRange.min === "string" &&
        typeof unhealthyRange.max === "string"
    ) {
        const [sysMin, diaMin] = unhealthyRange.min.split("/").map(Number);
        const [sysMax, diaMax] = unhealthyRange.max.split("/").map(Number);

        const sys = Math.floor(Math.random() * (sysMax - sysMin + 1)) + sysMin;

        // la diastolica non può superare sys - 25
        const effectiveDiaMax = Math.min(diaMax, sys - 25);

        // sicurezza se i range sono strani
        const effectiveDiaMin = Math.min(diaMin, effectiveDiaMax);

        const dia =
            Math.floor(
                Math.random() * (effectiveDiaMax - effectiveDiaMin + 1),
            ) + effectiveDiaMin;

        return `${sys}/${dia}`;
    }

    const min = Number(unhealthyRange.min);
    const max = Number(unhealthyRange.max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

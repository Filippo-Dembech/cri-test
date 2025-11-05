import { useState } from "react";
import Button from "../ui/Button";

interface Range {
    min: number | string;
    max: number | string;
}

interface Parameter {
    name: string;
    healthyRange: Range;
    unhealthyRange: Range;
}

const parameters: Parameter[] = [
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

function getRandomParameter(): Parameter {
    const index = Math.floor(Math.random() * parameters.length);
    return parameters[index];
}

function getRandomBloodPressure(): string {
    const systolic = Math.floor(Math.random() * (200 - 80 + 1)) + 80; // 80–200
    const diastolic = Math.floor(Math.random() * (120 - 30 + 1)) + 30; // 30–120

    if (systolic - diastolic < 20) return getRandomBloodPressure();

    return `${systolic}/${diastolic}`;
}

function classifyValue(
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

function getRandomUnhealthyValue(paramName: string): number | string {
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
        const dia = Math.floor(Math.random() * (diaMax - diaMin + 1)) + diaMin;

        return `${sys}/${dia}`;
    }

    const min = Number(unhealthyRange.min);
    const max = Number(unhealthyRange.max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function ParametersGame() {
    const [rounds, setRounds] = useState(0);
    const [rightAnswers, setRightAnswers] = useState(0);
    const parameter = getRandomParameter();
    const randomValue = getRandomUnhealthyValue(parameter.name);
    const rightAnswer = classifyValue(parameter.name, randomValue);
    
    function checkAnswer(answer: "valore-basso" | "valore-alto" | "valore-normale") {
      if (rightAnswer === answer) setRightAnswers(rightAnswers => rightAnswers + 1);
      setRounds(rounds => rounds + 1)
    }

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">Pratica Parametri</h1>
            <div className="text-center border-2 border-red-200 rounded-xl p-3">
                <p className="text-2xl">{parameter.name}</p>
                <p className="text-8xl font-bold mb-8 mt-4">{randomValue}</p>
                <div className="flex gap-3 justify-center">
                    <Button onClick={() => checkAnswer("valore-basso")}>Bassa</Button>
                    <Button onClick={() => checkAnswer("valore-normale")}>Normale</Button>
                    <Button onClick={() => checkAnswer("valore-alto")}>Alta</Button>
                </div>
            </div>
            <div>
                <p>
                    Risposte esatte: {rightAnswers}/{rounds}
                </p>
            </div>
        </div>
    );
}

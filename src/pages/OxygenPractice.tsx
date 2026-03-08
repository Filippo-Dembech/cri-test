import { useState } from "react";
import Button from "../ui/Button";

type Desease = 
        "shock" | 
        "intossicazione da CO" |
        "annegamento" |
        "disbarismo" |
        "ipotermia"

type PatientState = {
    desease?: Desease
    saturationValue: number,
    hasDyspnea: boolean,
    isBPCO: boolean
}

// desease signs data for modals
const deseaseSigns = {
    shock: {},
    COIntoxication: {},
    drowning: {},
    dysbarism: {},
    hypothermia: {},
};

function getRandomDesease(): Desease | undefined {
    const deseases: Desease[] = [
        "shock",
        "intossicazione da CO",
        "annegamento",
        "disbarismo",
        "ipotermia",
    ];
    const desease = deseases[Math.floor(Math.random() * deseases.length)];
    if (Math.random() < 0.3) return desease;
}

function getRandomSaturation(): number {
    const probability = Math.random();

    // 30% dei casi: 70–84
    if (probability < 0.3) return Math.floor(Math.random() * 15) + 70;
    // 70% dei casi: 85–100
    else return Math.floor(Math.random() * 16) + 85;
}

function getRandomPatientState(): PatientState {
    const desease = getRandomDesease();
    const saturation = getRandomSaturation();
    const dyspnea = Math.random() < 0.4; // 40% possibility to have dyspnea
    const bpco = Math.random() < 0.3; // 30% possibility to have BPCO

    return {
        desease,
        saturationValue: saturation,
        hasDyspnea: dyspnea,
        isBPCO: bpco,
    }
}

function patientStateToString(patientState: PatientState) {
    
    const { desease, saturationValue, hasDyspnea, isBPCO} = patientState;
    
    return `Paziente${desease ? ` con segni di ${desease},` : " con"} saturazione ${saturationValue}% ${hasDyspnea ? "e dispnea" : ""}${isBPCO ? ", con BPCO" : ""}.`;
}

function getAnswerFrom(patientState: PatientState) {
    const { desease, saturationValue, hasDyspnea, isBPCO } = patientState;
    if (desease || saturationValue < 85) return "Maschera con reservoir ad alti flussi (10-15 L/min)";
    if (saturationValue > 94 && !hasDyspnea) return "Proseguo assistenza";
    if (!isBPCO) return "Maschera Semplice e maschera con reservoir fino al raggiungimento di 94-98% di saturazione";
    if (!(saturationValue < 88) && !hasDyspnea) return "Proseguo assistenza";
    return "Cannula nasale -> maschera semplice -> maschera con reservoir fino al raggiungimento di 88-92% di saturazione";
}

export default function OxygenPractice() {
    const [patientState, setPatientState] = useState<PatientState>(getRandomPatientState);
    const [showAnswer, setShowAnswer] = useState(false);
    const answer = getAnswerFrom(patientState);
    
    function toggleShowAnswer() {
        setShowAnswer(show => !show)
    }

    return (
        <div>
            <h1 className="text-4xl font-bold">Pratica Ossigenoterapia</h1>
            <div className="flex flex-col gap-4 mt-8 align-center max-w-150 m-auto">
                <p>{patientStateToString(patientState)}</p>
                <Button onClick={toggleShowAnswer} className="justify-center">{showAnswer ? "Nascondi Risposta" : "Mostra Risposta"}</Button>
                {showAnswer && (
                    <div>
                        <div className="p-3 bg-slate-200 shadow rounded-2xl">{answer}</div>
                        <span className="block w-fit m-auto">
                        <Button outlined onClick={() => {
                            setPatientState(getRandomPatientState);
                            toggleShowAnswer();
                        }} className="mt-4">Continua</Button>
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

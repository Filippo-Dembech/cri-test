import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Button from "../../ui/Button";

type Disease = 
        "shock" | 
        "intossicazione da CO" |
        "annegamento" |
        "disbarismo" |
        "ipotermia"

type PatientState = {
    disease?: Disease
    saturationValue: number,
    hasDyspnea: boolean,
    isBPCO: boolean
}

function getRandomDisease(): Disease | undefined {
    const diseases: Disease[] = [
        "shock",
        "intossicazione da CO",
        "annegamento",
        "disbarismo",
        "ipotermia",
    ];
    const disease = diseases[Math.floor(Math.random() * diseases.length)];
    if (Math.random() < 0.3) return disease;
}

function getRandomSaturation(): number {
    const probability = Math.random();

    // 30% dei casi: 70–84
    if (probability < 0.3) return Math.floor(Math.random() * 15) + 70;
    // 70% dei casi: 85–100
    else return Math.floor(Math.random() * 16) + 85;
}

function getRandomPatientState(): PatientState {
    const disease = getRandomDisease();
    const saturation = getRandomSaturation();
    const dyspnea = Math.random() < 0.4; // 40% possibility to have dyspnea
    const bpco = Math.random() < 0.3; // 30% possibility to have BPCO

    return {
        disease,
        saturationValue: saturation,
        hasDyspnea: dyspnea,
        isBPCO: bpco,
    }
}

function patientStateToString(patientState: PatientState) {
    
    const { disease, saturationValue, hasDyspnea, isBPCO} = patientState;
    
    return `Paziente${disease ? ` con segni di ${disease},` : " con"} saturazione ${saturationValue}% ${hasDyspnea ? "e dispnea" : ""}${isBPCO ? ", con BPCO" : ""}.`;
}

function getAnswerFrom(patientState: PatientState) {
    const { disease, saturationValue, hasDyspnea, isBPCO } = patientState;
    if (disease || saturationValue < 85) return "Maschera con reservoir ad alti flussi (10-15 L/min)";
    if (saturationValue > 94 && !hasDyspnea) return "Proseguo assistenza";
    if (!isBPCO) return "Maschera Semplice e maschera con reservoir fino al raggiungimento di 94-98% di saturazione";
    if (!(saturationValue < 88) && !hasDyspnea) return "Proseguo assistenza";
    return "Cannula nasale -> maschera semplice -> maschera con reservoir fino al raggiungimento di 88-92% di saturazione";
}


export default function ScenarioPractice() {
    const [patientState, setPatientState] = useState<PatientState>(getRandomPatientState);
    const [showAnswer, setShowAnswer] = useState(false);
    const answer = getAnswerFrom(patientState);

    function toggleShowAnswer() {
        setShowAnswer((show) => !show);
    }
    return (
                    <motion.div
                className="flex flex-col gap-5 max-w-150 w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                {/* Patient state card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={patientStateToString(patientState)}
                        className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-1">
                            Paziente
                        </p>
                        <p className="text-slate-800 text-base leading-relaxed">
                            {patientStateToString(patientState)}
                        </p>
                    </motion.div>
                </AnimatePresence>

                {/* Toggle answer button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                    <Button onClick={toggleShowAnswer} className="justify-center w-full">
                        {showAnswer ? "Nascondi Risposta" : "Mostra Risposta"}
                    </Button>
                </motion.div>

                {/* Answer section */}
                <AnimatePresence>
                    {showAnswer && (
                        <motion.div
                            className="flex flex-col gap-4"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                            style={{ overflow: "hidden" }}
                        >
                            {/* Answer card with left accent border */}
                            <motion.div
                                className="relative bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
                            >
                                <div className="absolute left-0 top-4 bottom-4 w-1 bg-blue-400 rounded-full ml-0 translate-x-[-0.5px]" />
                                <p className="text-sm font-medium text-blue-400 uppercase tracking-widest mb-1">
                                    Risposta
                                </p>
                                <p className="text-blue-900 text-base leading-relaxed pl-1">
                                    {answer}
                                </p>
                            </motion.div>

                            {/* Continue button */}
                            <motion.div
                                className="flex justify-center"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25, delay: 0.2, ease: "easeOut" }}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.96 }}
                            >
                                <Button
                                    outlined
                                    onClick={() => {
                                        setPatientState(getRandomPatientState);
                                        toggleShowAnswer();
                                    }}
                                >
                                    Continua
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
    )
}
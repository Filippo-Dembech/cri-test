import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type Color = "VERDE" | "ROSSO" | "GIALLO" | "NERO";

interface Step {
    id: string;
    question: string;
    action?: string; // box blu (istruzione da eseguire)
    yes: string;     // id del prossimo step o colore
    no: string;
}

const STEPS: Record<string, Step> = {
    cammina: {
        id: "cammina",
        question: "Il paziente cammina?",
        yes: "VERDE",
        no: "respira",
    },
    respira: {
        id: "respira",
        question: "Il paziente respira?",
        yes: "freq",
        no: "cannula",
    },
    cannula: {
        id: "cannula",
        question: "Il paziente respira dopo pervietà-cannula?",
        action: "Applicare pervietà-cannula",
        yes: "ROSSO",
        no: "ROSSO",
    },
    freq: {
        id: "freq",
        question: "Frequenza respiratoria < 30 atti/min?",
        yes: "polso",
        no: "ROSSO",
    },
    polso: {
        id: "polso",
        question: "Polso radiale presente?",
        yes: "ordini",
        no: "ROSSO",
    },
    ordini: {
        id: "ordini",
        question: "Esegue ordini semplici?",
        action: "Controllare evidenti emorragie — bendaggio e far tamponare",
        yes: "GIALLO",
        no: "ROSSO",
    },
};

const COLOR_CONFIG: Record<Color, { bg: string; border: string; text: string; label: string; emoji: string }> = {
    VERDE:  { bg: "bg-green-50",  border: "border-green-400", text: "text-green-700",  label: "Codice Verde",  emoji: "🟢" },
    GIALLO: { bg: "bg-amber-50",  border: "border-amber-400", text: "text-amber-700",  label: "Codice Giallo", emoji: "🟡" },
    ROSSO:  { bg: "bg-red-50",    border: "border-red-400",   text: "text-red-700",    label: "Codice Rosso",  emoji: "🔴" },
    NERO:   { bg: "bg-gray-100",  border: "border-gray-500",  text: "text-gray-800",   label: "Codice Nero",   emoji: "⚫" },
};

type HistoryEntry = { question: string; answer: "SÌ" | "NO"; action?: string };

const COLORS: Color[] = ["VERDE", "ROSSO", "GIALLO", "NERO"];
const isColor = (v: string): v is Color => COLORS.includes(v as Color);

export default function StartProtocol() {
    const [currentId, setCurrentId] = useState<string>("cammina");
    const [result, setResult] = useState<Color | null>(null);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [stepKey, setStepKey] = useState(0);

    const current = STEPS[currentId];

    function answer(choice: "yes" | "no") {
        const next = choice === "yes" ? current.yes : current.no;
        const entry: HistoryEntry = {
            question: current.question,
            answer: choice === "yes" ? "SÌ" : "NO",
            action: current.action,
        };
        setHistory((h) => [...h, entry]);
        setStepKey((k) => k + 1);

        if (isColor(next)) {
            setResult(next as Color);
        } else {
            setCurrentId(next);
        }
    }

    function restart() {
        setCurrentId("cammina");
        setResult(null);
        setHistory([]);
        setStepKey((k) => k + 1);
    }

    const stepNumber = history.length + 1;
    const totalSteps = 6;

    return (
        <div className="flex flex-col gap-5 w-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300">
                        Protocollo
                    </p>
                    <h2 className="text-red-900 font-semibold text-base">S.T.A.R.T. Triage</h2>
                </div>
                {!result && (
                    <span className="text-xs text-red-400 font-medium tabular-nums">
                        Passo {stepNumber}/{totalSteps}
                    </span>
                )}
            </div>

            {/* Progress bar */}
            {!result && (
                <div className="h-1.5 rounded-full bg-red-100 overflow-hidden">
                    <motion.div
                        className="h-full bg-red-400 rounded-full"
                        animate={{ width: `${((stepNumber - 1) / totalSteps) * 100}%` }}
                        transition={{ duration: 0.4 }}
                    />
                </div>
            )}

            <AnimatePresence mode="wait">
                {!result ? (
                    <motion.div
                        key={stepKey}
                        className="flex flex-col gap-4"
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.25 }}
                    >
                        {/* Action box (istruzione blu) */}
                        {current.action && (
                            <div className="bg-blue-50 border border-blue-300 rounded-xl px-4 py-3">
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-400 mb-1">
                                    Azione richiesta
                                </p>
                                <p className="text-blue-900 font-semibold text-sm leading-snug">
                                    {current.action}
                                </p>
                            </div>
                        )}

                        {/* Question card */}
                        <div className="bg-red-50 border border-red-200 rounded-2xl px-6 py-8 flex flex-col items-center gap-2 text-center">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300">
                                Valuta
                            </p>
                            <p className="text-red-900 text-lg font-semibold leading-snug">
                                {current.question}
                            </p>
                        </div>

                        {/* Yes / No buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <motion.button
                                onClick={() => answer("no")}
                                className="border border-red-200 text-red-500 bg-red-50 py-3 rounded-xl cursor-pointer hover:bg-red-100 transition-colors text-sm font-semibold"
                                whileTap={{ scale: 0.96 }}
                            >
                                NO
                            </motion.button>
                            <motion.button
                                onClick={() => answer("yes")}
                                className="bg-red-500 text-white py-3 rounded-xl cursor-pointer hover:bg-red-600 transition-colors text-sm font-semibold"
                                whileTap={{ scale: 0.96 }}
                            >
                                SÌ
                            </motion.button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="result"
                        className="flex flex-col gap-5"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Result badge */}
                        <div className={`rounded-2xl border-2 px-6 py-8 flex flex-col items-center gap-2 ${COLOR_CONFIG[result].bg} ${COLOR_CONFIG[result].border}`}>
                            <span className="text-3xl">{COLOR_CONFIG[result].emoji}</span>
                            <p className={`text-2xl font-bold tracking-wide ${COLOR_CONFIG[result].text}`}>
                                {COLOR_CONFIG[result].label}
                            </p>
                        </div>

                        {/* Path recap */}
                        <div className="flex flex-col gap-2">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300 px-1">
                                Percorso seguito
                            </p>
                            {history.map((entry, i) => (
                                <motion.div
                                    key={i}
                                    className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-start justify-between gap-3"
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                >
                                    <div className="flex flex-col gap-0.5 flex-1">
                                        {entry.action && (
                                            <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-wide">
                                                {entry.action}
                                            </p>
                                        )}
                                        <p className="text-red-900 text-xs leading-snug">
                                            {entry.question}
                                        </p>
                                    </div>
                                    <span className={`text-xs font-bold shrink-0 px-2 py-0.5 rounded-lg ${
                                        entry.answer === "SÌ"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-500"
                                    }`}>
                                        {entry.answer}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Restart */}
                        <motion.button
                            onClick={restart}
                            className="w-full bg-red-500 text-white py-2.5 rounded-xl cursor-pointer hover:bg-red-600 transition-colors text-sm font-semibold"
                            whileTap={{ scale: 0.96 }}
                            whileHover={{ scale: 1.01 }}
                        >
                            Ricomincia
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
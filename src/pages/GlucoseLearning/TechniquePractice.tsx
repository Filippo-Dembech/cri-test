import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import GentleSlide from "../../ui/animations/GentleSlide";
import { motion } from "framer-motion";
import StepsBuilder from "../../ui/exercise/StepsBuilder";
import { steps } from "./steps";
import NextStep from "../../ui/exercise/NextStep";

type PracticeMode = "order" | "quiz";

export default function TechniquePractice() {
    const [mode, setMode] = useState<PracticeMode | null>(null);
    const [modeKey, setModeKey] = useState(0);

    function selectMode(m: PracticeMode) {
        setMode(m);
        setModeKey((k) => k + 1);
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Mode picker */}
            <div className="flex gap-2 p-1 bg-red-50 border border-red-100 rounded-2xl">
                {(
                    [
                        {
                            id: "quiz" as PracticeMode,
                            label: "Passo successivo",
                            description: "Cosa viene dopo?",
                        },
                        {
                            id: "order" as PracticeMode,
                            label: "Ordina i passi",
                            description: "Trascina e posiziona",
                        },
                    ] as const
                ).map((m) => (
                    <button
                        key={m.id}
                        onClick={() => selectMode(m.id)}
                        className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
                            ${
                                mode === m.id
                                    ? "bg-white border border-red-200 text-red-600 shadow-sm"
                                    : "text-red-300 hover:text-red-400"
                            }`}
                    >
                        {m.label}
                        <span
                            className={`text-[10px] font-normal leading-tight text-center transition-colors
                            ${mode === m.id ? "text-red-400" : "text-red-200"}`}
                        >
                            {m.description}
                        </span>
                    </button>
                ))}
            </div>

            {/* Selected exercise */}
            <AnimatePresence mode="wait">
                {mode ? (
                    <GentleSlide
                        key={modeKey}
                        from="top"
                    >
                        {mode === "quiz" && <NextStep steps={steps} />}
                        {mode === "order" && <StepsBuilder steps={steps.map(step => step.text)} />}
                    </GentleSlide>
                ) : (
                    <motion.div
                        className="text-center py-10 text-red-300 text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        Scegli un tipo di esercizio qui sopra
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
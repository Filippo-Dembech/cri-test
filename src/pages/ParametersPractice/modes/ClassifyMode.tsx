import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { parameters } from "../parameters";
import { classifyValue, generateValue, getHealthyRangeLines } from "../utils";

const LABELS = [
    { value: "bassa" as const, label: "Bassa" },
    { value: "normale" as const, label: "Normale" },
    { value: "alta" as const, label: "Alta" },
];

export default function ClassifyMode() {
    const [paramIdx, setParamIdx] = useState(0);
    const [value, setValue] = useState("");
    const [correct, setCorrect] = useState<"bassa" | "normale" | "alta">(
        "normale",
    );
    const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
    const [givenAnswer, setGivenAnswer] = useState<string | null>(null);
    const [score, setScore] = useState({ right: 0, total: 0 });

    const next = useCallback(() => {
        const idx = Math.floor(Math.random() * parameters.length);
        const v = generateValue(parameters[idx]);
        setParamIdx(idx);
        setValue(v);
        setCorrect(classifyValue(parameters[idx], v));
        setFeedback(null);
        setGivenAnswer(null);
    }, []);

    useEffect(() => {
        next();
    }, [next]);

    const check = (answer: "bassa" | "normale" | "alta") => {
        if (feedback) return;
        const isCorrect = answer === correct;
        setGivenAnswer(answer);
        setFeedback(isCorrect ? "correct" : "wrong");
        setScore((s) => ({
            right: s.right + (isCorrect ? 1 : 0),
            total: s.total + 1,
        }));
    };

    const p = parameters[paramIdx];

    return (
        <div className="flex flex-col gap-4">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col items-center gap-5">
                {/* Param label */}
                <div className="flex flex-col items-center gap-0.5 text-center">
                    <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-red-400">
                        {p.shortName} · {p.unit}
                    </p>
                    <p className="text-base font-semibold text-red-900">
                        {p.name}
                    </p>
                </div>

                {/* Value */}
                <motion.p
                    key={value}
                    initial={{ scale: 0.6, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 16 }}
                    className="font-black tabular-nums leading-none tracking-tighter transition-colors duration-200"
                    style={{
                        fontSize: "clamp(3.5rem, 12vw, 6rem)",
                        color:
                            feedback === "correct"
                                ? "#16a34a"
                                : feedback === "wrong"
                                  ? "#dc2626"
                                  : "#9f1239",
                    }}
                >
                    {value}
                </motion.p>

                {/* Wrong hint */}
                <AnimatePresence>
                    {feedback === "wrong" && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                                duration: 0.3,
                                ease: [0.4, 0, 0.2, 1],
                            }}
                            className="w-full overflow-hidden"
                        >
                            <div className="bg-red-100 border border-red-200 rounded-xl p-4 text-center">
                                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-red-400 mb-2">
                                    Range normale
                                </p>
                                {getHealthyRangeLines(p).map((line, i) => (
                                    <p
                                        key={i}
                                        className="font-bold text-xl text-red-900 tabular-nums"
                                    >
                                        {line}
                                    </p>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="w-full h-px bg-red-200" />

                {/* Answer buttons */}
                <div className="flex gap-2 sm:gap-3 w-full">
                    {LABELS.map(({ value: v, label }) => {
                        const isCorrectAnswer = !!feedback && v === correct;
                        const isWrongAnswer =
                            feedback === "wrong" &&
                            v === givenAnswer &&
                            v !== correct;
                        return (
                            <motion.button
                                key={v}
                                onClick={() => check(v)}
                                disabled={!!feedback}
                                whileHover={
                                    !feedback ? { scale: 1.04, y: -1 } : {}
                                }
                                whileTap={!feedback ? { scale: 0.96 } : {}}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 border ${
                                    isCorrectAnswer
                                        ? "bg-green-100 border-green-400 text-green-800"
                                        : isWrongAnswer
                                          ? "bg-red-100 border-red-300 text-red-400 line-through"
                                          : feedback
                                            ? "bg-white border-red-100 text-red-300"
                                            : "bg-white border-red-200 text-red-800 hover:border-red-400 hover:bg-red-50"
                                }`}
                            >
                                {label}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Score + next */}
            <div className="flex items-center justify-between px-1 h-10">
                <p className="text-sm text-red-400 font-medium">
                    <span className="text-red-700 font-bold text-base tabular-nums">
                        {score.right}
                    </span>
                    <span className="mx-1 text-red-300">/</span>
                    <span className="text-red-600 font-semibold tabular-nums">
                        {score.total}
                    </span>
                    <span className="ml-2 text-xs uppercase tracking-widest">
                        corrette
                    </span>
                </p>
                <AnimatePresence>
                    {feedback && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={next}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl px-5 py-2.5 text-sm tracking-wide transition-colors duration-150 shadow-sm"
                        >
                            Avanti →
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
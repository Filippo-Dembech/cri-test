import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import PracticeFeedback from "./PracticeFeedback";
import type { Color, ScenarioType } from "./types";
import { scenarios } from "./scenarios";
import ColorPill from "../../ui/ColorPill";
import ProgressBar from "../../ui/ProgressBar";
import Subtitle from "../../ui/typography/Subtitle";
import Scenario from "./Scenario";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
}

const COLOR_STYLE: Record<Color, { pill: string; dot: string }> = {
    green: {
        pill: "bg-green-100 text-green-800 border-green-300",
        dot: "bg-green-500",
    },
    yellow: {
        pill: "bg-amber-100 text-amber-800 border-amber-300",
        dot: "bg-amber-400",
    },
    red: { pill: "bg-red-100 text-red-700 border-red-300", dot: "bg-red-500" },
};


// ─── Main component ───────────────────────────────────────────────────────────

export default function StartProtocolPractice() {
    const [queue] = useState<ScenarioType[]>(() => shuffle(scenarios));
    const [idx, setIdx] = useState(0);
    const [selected, setSelected] = useState<Color | null>(null);
    const [attempts, setAttempts] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [results, setResults] = useState<
        { correct: boolean; scenario: ScenarioType }[]
    >([]);
    const [done, setDone] = useState(false);
    const [cardKey, setCardKey] = useState(0);

    const scenario = queue[idx];
    const isAnswered = selected !== null;
    const isCorrect = selected === scenario?.correctAnswer;

    function handleSelect(color: Color) {
        if (isAnswered) return;
        const attempt = attempts + 1;
        setAttempts(attempt);
        setSelected(color);

        if (
            color !== scenario.correctAnswer &&
            attempt === 1 &&
            scenario.hint
        ) {
            setShowHint(true);
        }
    }

    function handleNext() {
        setResults((r) => [...r, { correct: isCorrect, scenario }]);
        const next = idx + 1;
        if (next >= queue.length) {
            setDone(true);
        } else {
            setIdx(next);
            setSelected(null);
            setAttempts(0);
            setShowHint(false);
            setCardKey((k) => k + 1);
        }
    }

    function restart() {
        setIdx(0);
        setSelected(null);
        setAttempts(0);
        setShowHint(false);
        setResults([]);
        setDone(false);
        setCardKey((k) => k + 1);
    }

    // ── Done screen ───────────────────────────────────────────────────────────
    if (done) {
        const correct = results.filter((r) => r.correct).length;
        const total = results.length;

        return (
            <PracticeFeedback
                results={results}
                correct={correct}
                total={total}
                onRestart={restart}
            />
        );
    }

    // ── Exercise screen ───────────────────────────────────────────────────────
    return (
        <div className="flex flex-col gap-5 w-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Subtitle>Protocollo S.T.A.R.T.</Subtitle>
                    <h2 className="text-red-900 font-semibold text-base">
                        Esercitazione
                    </h2>
                </div>
            </div>

            <ProgressBar
                done={idx}
                total={queue.length}
            />

            <AnimatePresence mode="wait">
                <motion.div
                    key={cardKey}
                    className="flex flex-col gap-4"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.25 }}
                >
                    <Scenario scenario={scenario} showHint={showHint} />

                    {/* Answer options */}
                    <div className="flex flex-col gap-2">
                        <Subtitle>Codice triage</Subtitle>
                        <div className="grid grid-cols-3 gap-2">
                            {scenario.options.map((color) => {
                                const isThis = selected === color;
                                const correct =
                                    color === scenario.correctAnswer;
                                let style =
                                    "bg-white border-red-100 text-red-900 hover:border-red-300 hover:bg-red-50";
                                if (isAnswered) {
                                    if (correct)
                                        style =
                                            "bg-green-50 border-green-400 text-green-800";
                                    else if (isThis && !correct)
                                        style =
                                            "bg-red-100 border-red-400 text-red-700 opacity-70";
                                    else
                                        style =
                                            "bg-white border-red-100 text-red-300 opacity-40";
                                }

                                return (
                                    <motion.button
                                        key={color}
                                        onClick={() => handleSelect(color)}
                                        disabled={isAnswered}
                                        whileTap={
                                            isAnswered ? {} : { scale: 0.96 }
                                        }
                                        className={`relative border rounded-xl py-3 flex flex-col items-center gap-1.5 transition-colors duration-150 cursor-pointer font-semibold text-sm ${style}`}
                                    >
                                        <span
                                            className={`w-3 h-3 rounded-full ${COLOR_STYLE[color].dot}`}
                                        />
                                        {color === "green"
                                            ? "VERDE"
                                            : color === "yellow"
                                              ? "GIALLO"
                                              : "ROSSO"}
                                        {isAnswered && correct && (
                                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                                                ✓
                                            </span>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Explanation */}
                    <AnimatePresence>
                        {isAnswered && (
                            <motion.div
                                className="flex flex-col gap-3"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {/* Feedback banner */}
                                <div
                                    className={`rounded-xl border px-4 py-3 ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                                >
                                    <p
                                        className={`text-xs font-semibold mb-1 ${isCorrect ? "text-green-600" : "text-red-500"}`}
                                    >
                                        {isCorrect
                                            ? "Corretto"
                                            : "Non corretto — risposta: "}
                                        {!isCorrect && (
                                            <ColorPill
                                                color={scenario.correctAnswer}
                                            >
                                                {scenario.correctAnswer}
                                            </ColorPill>
                                        )}
                                    </p>
                                    <p
                                        className={`text-xs leading-relaxed ${isCorrect ? "text-green-900" : "text-red-900"}`}
                                    >
                                        {scenario.explanation}
                                    </p>
                                </div>

                                {/* Path steps */}
                                <div className="flex flex-wrap gap-1.5 px-1">
                                    {scenario.path.map((step, i) => (
                                        <span
                                            key={i}
                                            className="text-[11px] bg-red-50 border border-red-100 text-red-400 px-2 py-0.5 rounded-lg"
                                        >
                                            {step}
                                        </span>
                                    ))}
                                </div>

                                <motion.button
                                    onClick={handleNext}
                                    className="w-full bg-red-500 text-white py-2.5 rounded-xl font-semibold text-sm cursor-pointer hover:bg-red-600 transition-colors"
                                    whileTap={{ scale: 0.96 }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.15 }}
                                >
                                    {idx + 1 < queue.length
                                        ? "Prossimo →"
                                        : "Vedi risultati"}
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

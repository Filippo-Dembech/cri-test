import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChoiceId = string;

export interface Choice {
    /** Unique key for this choice (e.g. "yes", "no", "high") */
    id: ChoiceId;
    /** Label shown on the button (e.g. "Yes", "No", "High priority") */
    label: string;
    /** Tailwind color ramp to use: "green" | "red" | "amber" | "blue" | "purple" */
    color?: "green" | "red" | "amber" | "blue" | "purple";
}

export interface Scenario {
    /** The situation/vignette text presented to the user */
    vignette: string;
    /** Optional category label shown above the card (e.g. "Scenario", "Edge case") */
    type?: string;
    /** The id of the correct Choice */
    correctAnswer: ChoiceId;
    /** Explanation shown after the user answers */
    explanation: string;
    /** Optional hint shown after the first wrong attempt */
    hint?: string;
    /** Optional breadcrumb tags shown below the explanation */
    path?: string[];
}

export interface ScenarioPracticeProps {
    /** Title shown in the header */
    title: string;
    /** Subtitle / category label shown above the title */
    subtitle?: string;
    /** All possible choices the user can pick from */
    choices: Choice[];
    /** All scenarios to practice */
    scenarios: Scenario[];
    /** Whether to shuffle scenarios on start (default: true) */
    shuffle?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shuffleArray<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
}

const COLOR_CONFIG: Record<
    NonNullable<Choice["color"]>,
    {
        pill: string;
        dot: string;
        correctCard: string;
        wrongCard: string;
        correctBtn: string;
        wrongBtn: string;
    }
> = {
    green: {
        pill: "bg-green-100 text-green-800 border-green-300",
        dot: "bg-green-500",
        correctCard: "bg-green-50 border-green-200",
        wrongCard: "bg-green-50 border-green-200",
        correctBtn: "bg-green-50 border-green-400 text-green-800",
        wrongBtn: "bg-red-100 border-red-400 text-red-700 opacity-70",
    },
    red: {
        pill: "bg-red-100 text-red-700 border-red-300",
        dot: "bg-red-500",
        correctCard: "bg-red-50 border-red-200",
        wrongCard: "bg-red-50 border-red-200",
        correctBtn: "bg-green-50 border-green-400 text-green-800",
        wrongBtn: "bg-red-100 border-red-400 text-red-700 opacity-70",
    },
    amber: {
        pill: "bg-amber-100 text-amber-800 border-amber-300",
        dot: "bg-amber-500",
        correctCard: "bg-amber-50 border-amber-200",
        wrongCard: "bg-amber-50 border-amber-200",
        correctBtn: "bg-green-50 border-green-400 text-green-800",
        wrongBtn: "bg-red-100 border-red-400 text-red-700 opacity-70",
    },
    blue: {
        pill: "bg-blue-100 text-blue-800 border-blue-300",
        dot: "bg-blue-500",
        correctCard: "bg-blue-50 border-blue-200",
        wrongCard: "bg-blue-50 border-blue-200",
        correctBtn: "bg-green-50 border-green-400 text-green-800",
        wrongBtn: "bg-red-100 border-red-400 text-red-700 opacity-70",
    },
    purple: {
        pill: "bg-purple-100 text-purple-800 border-purple-300",
        dot: "bg-purple-500",
        correctCard: "bg-purple-50 border-purple-200",
        wrongCard: "bg-purple-50 border-purple-200",
        correctBtn: "bg-green-50 border-green-400 text-green-800",
        wrongBtn: "bg-red-100 border-red-400 text-red-700 opacity-70",
    },
};

function getColorConfig(color?: Choice["color"]) {
    return COLOR_CONFIG[color ?? "blue"];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ScenarioPractice({
    title,
    subtitle,
    choices,
    scenarios,
    shuffle = true,
}: ScenarioPracticeProps) {
    const [queue] = useState<Scenario[]>(() =>
        shuffle ? shuffleArray(scenarios) : scenarios,
    );
    const [idx, setIdx] = useState(0);
    const [selected, setSelected] = useState<ChoiceId | null>(null);
    const [attempts, setAttempts] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [results, setResults] = useState<
        { correct: boolean; scenario: Scenario }[]
    >([]);
    const [done, setDone] = useState(false);
    const [cardKey, setCardKey] = useState(0);

    const scenario = queue[idx];
    const isAnswered = selected !== null;
    const isCorrect = selected === scenario?.correctAnswer;

    const choiceMap = Object.fromEntries(choices.map((c) => [c.id, c]));
    const correctChoice = choiceMap[scenario?.correctAnswer];
    const correctCfg = getColorConfig(correctChoice?.color);

    function handleSelect(id: ChoiceId) {
        if (isAnswered) return;
        const attempt = attempts + 1;
        setAttempts(attempt);
        setSelected(id);
        if (id !== scenario.correctAnswer && attempt === 1 && scenario.hint) {
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

    // ── Results screen ──────────────────────────────────────────────────────────
    if (done) {
        const correct = results.filter((r) => r.correct).length;
        const total = results.length;
        const pct = Math.round((correct / total) * 100);

        return (
            <motion.div
                className="flex flex-col gap-6 py-2"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex flex-col items-center gap-3">
                    <div
                        className={`w-24 h-24 rounded-full flex items-center justify-center border-4
              ${pct >= 80 ? "border-green-400 bg-green-50" : pct >= 50 ? "border-amber-400 bg-amber-50" : "border-red-400 bg-red-50"}`}
                    >
                        <span
                            className={`text-2xl font-semibold
                ${pct >= 80 ? "text-green-700" : pct >= 50 ? "text-amber-700" : "text-red-700"}`}
                        >
                            {pct}%
                        </span>
                    </div>
                    <p className="text-red-900 font-semibold text-lg">
                        {correct} / {total} corretti
                    </p>
                    <p className="text-red-400 text-sm text-center">
                        {pct >= 80
                            ? "Excellent — you've mastered this topic."
                            : pct >= 50
                              ? "Good effort — review the tricky edge cases and try again."
                              : "Keep studying the theory, then give it another go."}
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300 px-1">
                        Riassunto
                    </p>
                    {results.map((r, i) => {
                        const ca = choiceMap[r.scenario.correctAnswer];
                        const cfg = getColorConfig(ca?.color);
                        return (
                            <motion.div
                                key={i}
                                className={`rounded-xl border px-4 py-3 flex flex-col gap-1.5
                  ${r.correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04 }}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <p
                                        className={`text-xs leading-snug flex-1 font-medium ${r.correct ? "text-green-900" : "text-red-900"}`}
                                    >
                                        {r.scenario.vignette.length > 90
                                            ? r.scenario.vignette.slice(0, 90) +
                                              "…"
                                            : r.scenario.vignette}
                                    </p>
                                    <span
                                        className={`text-xs font-bold shrink-0 ${r.correct ? "text-green-600" : "text-red-500"}`}
                                    >
                                        {r.correct ? "✓" : "✗"}
                                    </span>
                                </div>
                                {!r.correct && (
                                    <p className="text-[11px] text-red-500 flex items-center gap-1.5">
                                        Risposta corretta:
                                        <span
                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] font-bold ${cfg.pill}`}
                                        >
                                            <span
                                                className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
                                            />
                                            {ca?.label}
                                        </span>
                                    </p>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                <motion.button
                    onClick={restart}
                    className="w-full bg-red-500 text-white py-2.5 rounded-xl font-semibold text-sm cursor-pointer hover:bg-red-600 transition-colors"
                    whileTap={{ scale: 0.96 }}
                    whileHover={{ scale: 1.01 }}
                >
                    Ricomincia
                </motion.button>
            </motion.div>
        );
    }

    // ── Practice screen ─────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col gap-5 w-full">
            <div className="flex items-center justify-between">
                <div>
                    {subtitle && (
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300">
                            {subtitle}
                        </p>
                    )}
                    <h2 className="text-red-900 font-semibold text-base">
                        {title}
                    </h2>
                </div>
                <span className="text-xs text-red-400 font-medium tabular-nums">
                    {idx + 1} / {queue.length}
                </span>
            </div>

            <div className="h-1.5 rounded-full bg-red-100 overflow-hidden">
                <motion.div
                    className="h-full bg-red-400 rounded-full"
                    animate={{ width: `${(idx / queue.length) * 100}%` }}
                    transition={{ duration: 0.4 }}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={cardKey}
                    className="flex flex-col gap-4"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.25 }}
                >
                    {scenario.type && (
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-red-300">
                            {scenario.type}
                        </span>
                    )}

                    <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-6">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300 mb-2">
                            Scenario
                        </p>
                        <p className="text-red-900 text-base leading-relaxed">
                            {scenario.vignette}
                        </p>
                    </div>

                    <AnimatePresence>
                        {showHint && scenario.hint && (
                            <motion.div
                                className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3"
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-400 mb-1">
                                    Hint
                                </p>
                                <p className="text-amber-900 text-sm leading-snug">
                                    {scenario.hint}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex flex-col gap-2">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300">
                            Cosa fare?
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {choices.map((choice) => {
                                const cfg = getColorConfig(choice.color);
                                const isThis = selected === choice.id;
                                const correct =
                                    choice.id === scenario.correctAnswer;

                                let style =
                                    "bg-white border-red-100 text-red-900 hover:border-red-300 hover:bg-red-50";
                                if (isAnswered) {
                                    if (correct) style = cfg.correctBtn;
                                    else if (isThis) style = cfg.wrongBtn;
                                    else
                                        style =
                                            "bg-white border-red-100 text-red-300 opacity-40";
                                }

                                return (
                                    <motion.button
                                        key={choice.id}
                                        onClick={() => handleSelect(choice.id)}
                                        disabled={isAnswered}
                                        whileTap={
                                            isAnswered ? {} : { scale: 0.97 }
                                        }
                                        className={`relative border rounded-xl py-4 px-4 flex items-center gap-3 transition-colors duration-150 cursor-pointer font-semibold text-sm ${style}`}
                                    >
                                        <span
                                            className={`w-3 h-3 rounded-full shrink-0 ${cfg.dot}`}
                                        />
                                        {choice.label}
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

                    <AnimatePresence>
                        {isAnswered && (
                            <motion.div
                                className="flex flex-col gap-3"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div
                                    className={`rounded-xl border px-4 py-3 ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                                >
                                    <p
                                        className={`text-xs font-semibold mb-1 flex items-center gap-1.5 flex-wrap ${isCorrect ? "text-green-600" : "text-red-500"}`}
                                    >
                                        {isCorrect ? (
                                            "Correct"
                                        ) : (
                                            <>
                                                Incorrect — correct answer:
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] font-bold ${correctCfg.pill}`}
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full ${correctCfg.dot}`}
                                                    />
                                                    {correctChoice?.label}
                                                </span>
                                            </>
                                        )}
                                    </p>
                                    <p
                                        className={`text-xs leading-relaxed ${isCorrect ? "text-green-900" : "text-red-900"}`}
                                    >
                                        {scenario.explanation}
                                    </p>
                                </div>

                                {scenario.path && scenario.path.length > 0 && (
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
                                )}

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
                                        : "Guarda Risultati"}
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProcedureStep {
    /** The yes/no question to display. */
    question: string;
    /** Optional instruction shown before the question (blue action box). */
    action?: string;
    /** Key of the next step or outcome when the user answers YES. */
    yes: string;
    /** Key of the next step or outcome when the user answers NO. */
    no: string;
}

export interface ProcedureOutcome {
    /** Display label, e.g. "Codice Rosso" or "Immediate". */
    label: string;
    /**
     * Tailwind color token used to tint the result card.
     * One of: "red" | "green" | "amber" | "blue" | "gray" | "purple" | "orange"
     */
    color: "red" | "green" | "amber" | "blue" | "gray" | "purple" | "orange";
    /** Emoji shown on the result card (optional). */
    emoji?: string;
    /** Additional description shown under the label (optional). */
    description?: string;
}

export interface Procedure {
    /** Short title shown in the header. */
    title: string;
    /** Small label / category shown above the title. */
    subtitle?: string;
    /** Record of all decision steps keyed by an arbitrary string id. */
    steps: Record<string, ProcedureStep>;
    /**
     * Record of all terminal outcomes keyed by an arbitrary string id.
     * These ids are referenced in step.yes / step.no to end the flow.
     */
    outcomes: Record<string, ProcedureOutcome>;
    /** Key of the first step to show. */
    startId: string;
}

// ---------------------------------------------------------------------------
// Color maps (Tailwind class bundles per accent color)
// ---------------------------------------------------------------------------

type ColorToken = ProcedureOutcome["color"];

const COLOR_CLASSES: Record<
    ColorToken,
    { bg: string; border: string; text: string; badgeBg: string }
> = {
    red: {
        bg: "bg-red-100",
        border: "border-red-500",
        text: "text-red-800",
        badgeBg: "bg-red-200",
    },
    green: {
        bg: "bg-green-100",
        border: "border-green-500",
        text: "text-green-800",
        badgeBg: "bg-green-200",
    },
    amber: {
        bg: "bg-yellow-100",
        border: "border-yellow-500",
        text: "text-yellow-800",
        badgeBg: "bg-yellow-200",
    },
    blue: {
        bg: "bg-red-50",
        border: "border-red-300",
        text: "text-red-700",
        badgeBg: "bg-red-100",
    },
    gray: {
        bg: "bg-green-50",
        border: "border-green-300",
        text: "text-green-700",
        badgeBg: "bg-green-100",
    },
    purple: {
        bg: "bg-yellow-50",
        border: "border-yellow-300",
        text: "text-yellow-700",
        badgeBg: "bg-yellow-100",
    },
    orange: {
        bg: "bg-red-50",
        border: "border-red-400",
        text: "text-red-700",
        badgeBg: "bg-red-100",
    },
};

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

interface HistoryEntry {
    question: string;
    answer: "YES" | "NO";
    action?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface ProcedureWalkerProps {
    procedure: Procedure;
    /** Labels for the YES / NO buttons. Defaults to ["YES", "NO"]. */
    yesLabel?: string;
    noLabel?: string;
    /** Label for the restart button. Defaults to "Restart". */
    restartLabel?: string;
    /** Label for the history section. Defaults to "Path taken". */
    historyLabel?: string;
    /** Label for the action box header. Defaults to "Required action". */
    actionLabel?: string;
    /** Label for the question box header. Defaults to "Evaluate". */
    evaluateLabel?: string;
}

export default function ProcedureWalker({
    procedure,
    yesLabel = "YES",
    noLabel = "NO",
    restartLabel = "Restart",
    historyLabel = "Path taken",
    actionLabel = "Required action",
    evaluateLabel = "Evaluate",
}: ProcedureWalkerProps) {
    const { title, subtitle, steps, outcomes, startId } = procedure;

    const [currentId, setCurrentId] = useState<string>(startId);
    const [outcomeKey, setOutcomeKey] = useState<string | null>(null);
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [stepKey, setStepKey] = useState(0);

    const currentStep = steps[currentId];
    const currentOutcome = outcomeKey ? outcomes[outcomeKey] : null;

    function answer(choice: "yes" | "no") {
        const next = choice === "yes" ? currentStep.yes : currentStep.no;
        const entry: HistoryEntry = {
            question: currentStep.question,
            answer: choice === "yes" ? "YES" : "NO",
            action: currentStep.action,
        };
        setHistory((h) => [...h, entry]);
        setStepKey((k) => k + 1);

        if (outcomes[next]) {
            setOutcomeKey(next);
        } else {
            setCurrentId(next);
        }
    }

    function restart() {
        setCurrentId(startId);
        setOutcomeKey(null);
        setHistory([]);
        setStepKey((k) => k + 1);
    }

    const colors = currentOutcome ? COLOR_CLASSES[currentOutcome.color] : null;

    return (
        <div className="flex flex-col gap-5 w-full">
            {/* ── Header ─────────────────────────────────────────────── */}
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

                {/* Step counter pill */}
                {!currentOutcome && (
                    <span className="text-[10px] font-semibold bg-red-50 text-red-400 px-2.5 py-1 rounded-full border border-red-100">
                        Step {history.length + 1}
                    </span>
                )}
            </div>

            {/* ── Main animated area ─────────────────────────────────── */}
            <AnimatePresence mode="wait">
                {!currentOutcome ? (
                    /* ── Active step ──────────────────────────────────────── */
                    <motion.div
                        key={stepKey}
                        className="flex flex-col gap-4"
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.25 }}
                    >
                        {/* Action box */}
                        {currentStep?.action && (
                            <div className="bg-blue-50 border border-blue-300 rounded-xl px-4 py-3">
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-400 mb-1">
                                    {actionLabel}
                                </p>
                                <p className="text-blue-900 font-semibold text-sm leading-snug">
                                    {currentStep.action}
                                </p>
                            </div>
                        )}

                        {/* Question card */}
                        <div className="bg-red-50 border border-red-200 rounded-2xl px-6 py-8 flex flex-col items-center gap-2 text-center">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300">
                                {evaluateLabel}
                            </p>
                            <p className="text-red-900 text-lg font-semibold leading-snug">
                                {currentStep?.question}
                            </p>
                        </div>

                        {/* Yes / No buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <motion.button
                                onClick={() => answer("no")}
                                className="border border-red-200 text-red-500 bg-red-50 py-3 rounded-xl cursor-pointer hover:bg-red-100 transition-colors text-sm font-semibold"
                                whileTap={{ scale: 0.96 }}
                            >
                                {noLabel}
                            </motion.button>
                            <motion.button
                                onClick={() => answer("yes")}
                                className="bg-red-500 text-white py-3 rounded-xl cursor-pointer hover:bg-red-600 transition-colors text-sm font-semibold"
                                whileTap={{ scale: 0.96 }}
                            >
                                {yesLabel}
                            </motion.button>
                        </div>
                    </motion.div>
                ) : (
                    /* ── Outcome screen ───────────────────────────────────── */
                    <motion.div
                        key="outcome"
                        className="flex flex-col gap-5"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Result badge */}
                        <div
                            className={`rounded-2xl border-2 px-6 py-8 flex flex-col items-center gap-2 ${colors!.bg} ${colors!.border}`}
                        >
                            {currentOutcome.emoji && (
                                <span className="text-3xl">
                                    {currentOutcome.emoji}
                                </span>
                            )}
                            <p
                                className={`text-2xl font-bold tracking-wide ${colors!.text}`}
                            >
                                {currentOutcome.label}
                            </p>
                            {currentOutcome.description && (
                                <p
                                    className={`text-sm text-center leading-snug mt-1 ${colors!.text} opacity-80`}
                                >
                                    {currentOutcome.description}
                                </p>
                            )}
                        </div>

                        {/* History recap */}
                        <div className="flex flex-col gap-2">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300 px-1">
                                {historyLabel}
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
                                    <span
                                        className={`text-xs font-bold shrink-0 px-2 py-0.5 rounded-lg ${
                                            entry.answer === "YES"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-500"
                                        }`}
                                    >
                                        {entry.answer === "YES"
                                            ? yesLabel
                                            : noLabel}
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
                            {restartLabel}
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

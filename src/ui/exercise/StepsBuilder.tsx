import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface StepItem {
    id: string;
    text: string;
    origIdx: number;
}

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function toItems(steps: string[]): StepItem[] {
    return steps.map((text, i) => ({ id: `${i}-${text.slice(0, 8)}`, text, origIdx: i }));
}

export interface ReorderFeedbackData {
    correctCount: number;
    total: number;
    isPerfect: boolean;
    isGood: boolean;
    placed: { text: string; isCorrect: boolean }[];
    onRetry: () => void;
}

interface Props {
    steps: string[];
    renderFeedback?: (data: ReorderFeedbackData) => React.ReactNode;
}

function DefaultFeedback({ correctCount, total, isPerfect, isGood, onRetry }: ReorderFeedbackData) {
    const feedbackColor = isPerfect
        ? { bg: "bg-green-50", border: "border-green-200", text: "text-green-800" }
        : isGood
        ? { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800" }
        : { bg: "bg-red-50", border: "border-red-200", text: "text-red-700" };

    const feedbackMessage = isPerfect
        ? `Perfetto! Tutti i ${total} passi nell'ordine corretto.`
        : isGood
        ? `Quasi! ${correctCount} su ${total} passi nell'ordine corretto.`
        : `${correctCount} su ${total} passi nell'ordine corretto. Riprova!`;

    return (
        <div className="flex flex-col gap-3">
            <div className={`rounded-xl px-4 py-3 border text-sm font-medium text-center ${feedbackColor.bg} ${feedbackColor.border} ${feedbackColor.text}`}>
                {feedbackMessage}
            </div>
            <motion.button
                className="w-full border border-red-200 text-red-400 bg-transparent py-2 px-4 rounded-xl cursor-pointer hover:bg-red-50 transition-all duration-200 text-sm font-medium"
                onClick={onRetry}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
            >
                Riprova
            </motion.button>
        </div>
    );
}

export default function StepsBuilder({ steps, renderFeedback }: Props) {
    const [pool, setPool] = useState<StepItem[]>(() => shuffle(toItems(steps)));
    const [placed, setPlaced] = useState<StepItem[]>([]);

    const reset = () => {
        setPool(shuffle(toItems(steps)));
        setPlaced([]);
    };

    const handlePlace = (poolIdx: number) => {
        const item = pool[poolIdx];
        setPlaced((p) => [...p, item]);
        setPool((p) => p.filter((_, i) => i !== poolIdx));
    };

    const handleUndo = (placedIdx: number) => {
        const item = placed[placedIdx];
        setPlaced((p) => p.filter((_, i) => i !== placedIdx));
        setPool((p) => [...p, item]);
    };

    const isDone = placed.length === steps.length;
    const correctCount = placed.filter((item, i) => item.origIdx === i).length;
    const isPerfect = correctCount === steps.length;
    const isGood = correctCount >= Math.ceil(steps.length * 0.7);

    const feedbackData: ReorderFeedbackData = {
        correctCount,
        total: steps.length,
        isPerfect,
        isGood,
        placed: placed.map((item, i) => ({ text: item.text, isCorrect: item.origIdx === i })),
        onRetry: reset,
    };

    return (
        <div className="flex flex-col gap-4">

            {/* ── Placed steps ─────────────────────────────────────────── */}
            <AnimatePresence>
                {placed.length > 0 && (
                    <motion.div
                        className="flex flex-col gap-1.5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {placed.map((item, i) => {
                            const isCorrect = item.origIdx === i;
                            return (
                                <motion.button
                                    key={item.id}
                                    onClick={() => !isDone && handleUndo(i)}
                                    className={`group flex items-start gap-3 px-4 py-2.5 rounded-xl border text-sm text-left w-full transition-all duration-150 ${
                                        isDone
                                            ? isCorrect
                                                ? "bg-green-50 border-green-300 text-green-800 cursor-default"
                                                : "bg-red-50 border-red-200 text-red-700 line-through cursor-default"
                                            : "bg-red-50 border-red-100 text-red-900 hover:border-red-300 hover:bg-red-100 cursor-pointer"
                                    }`}
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -12 }}
                                    transition={{ duration: 0.2 }}
                                    whileTap={!isDone ? { scale: 0.98 } : {}}
                                >
                                    <span className={`mt-0.5 min-w-[20px] h-[20px] rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0 ${
                                        isDone
                                            ? isCorrect ? "bg-green-500 text-white" : "bg-red-400 text-white"
                                            : "bg-red-200 text-red-600"
                                    }`}>
                                        {i + 1}
                                    </span>
                                    <span className="flex-1">{item.text}</span>
                                    {!isDone && (
                                        <span className="text-red-300 opacity-0 group-hover:opacity-100 transition-opacity text-xs mt-0.5 flex-shrink-0">
                                            ✕ rimuovi
                                        </span>
                                    )}
                                </motion.button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Pool ─────────────────────────────────────────────────── */}
            <AnimatePresence>
                {!isDone && (
                    <motion.div className="flex flex-col gap-2" exit={{ opacity: 0 }}>
                        <p className="text-xs font-semibold uppercase tracking-widest text-red-400">
                            Seleziona il passo #{placed.length + 1}
                        </p>
                        <AnimatePresence>
                            {pool.map((item, qi) => (
                                <motion.button
                                    key={item.id}
                                    onClick={() => handlePlace(qi)}
                                    className="text-left px-4 py-3 rounded-xl border border-red-100 bg-white text-red-900 text-sm leading-relaxed cursor-pointer hover:bg-red-50 hover:border-red-300 transition-all duration-150"
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.96 }}
                                    transition={{ duration: 0.18 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {item.text}
                                </motion.button>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Feedback ─────────────────────────────────────────────── */}
            <AnimatePresence>
                {isDone && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderFeedback
                            ? renderFeedback(feedbackData)
                            : <DefaultFeedback {...feedbackData} />
                        }
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
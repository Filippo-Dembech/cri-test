import { motion } from "framer-motion";
import type { TermEntry } from "../../types";

interface Props {
    correct: number;
    missed: TermEntry[];
    total: number;
    onRetryMissed: () => void;
    onRetry: () => void;
    onRestart: () => void;
}

export default function TypingFeedback({ correct, total, missed, onRestart, onRetry, onRetryMissed }: Props) {
    const percentage = Math.round((correct / total) * 100);
        return (
            <motion.div
                className="flex flex-col gap-6 py-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Score circle */}
                <div className="flex flex-col items-center gap-3">
                    <div
                        className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${percentage >= 80 ? "border-green-400 bg-green-50" : percentage >= 50 ? "border-amber-400 bg-amber-50" : "border-red-400 bg-red-50"}`}
                    >
                        <span
                            className={`text-2xl font-semibold ${percentage >= 80 ? "text-green-700" : percentage >= 50 ? "text-amber-700" : "text-red-700"}`}
                        >
                            {percentage}%
                        </span>
                    </div>
                    <p className="text-red-900 font-medium text-lg text-center">
                        {correct} su {total} corrette
                    </p>
                    {missed.length > 0 && (
                        <p className="text-red-400 text-sm text-center">
                            {missed.length}{" "}
                            {missed.length === 1
                                ? "termine da ripassare"
                                : "termini da ripassare"}
                        </p>
                    )}
                </div>

                {/* Missed terms list */}
                {missed.length > 0 && (
                    <div className="flex flex-col gap-2">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300 px-1">
                            Da ripassare
                        </p>
                        <div className="flex flex-col gap-2">
                            {missed.map((term, i) => (
                                <motion.div
                                    key={i}
                                    className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                >
                                    <p className="text-red-400 text-xs leading-relaxed flex-1">
                                        {term.definition}
                                    </p>
                                    <p className="text-red-900 font-semibold text-sm sm:text-right sm:shrink-0 sm:max-w-[40%]">
                                        {term.validAnswers[0]}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap gap-2 justify-center">
                    <motion.button
                        className="rounded-xl border border-red-200 text-red-500 bg-transparent py-2.5 px-5 font-medium cursor-pointer hover:bg-red-50 transition-colors text-sm"
                        onClick={onRetry}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                    >
                        Ricomincia
                    </motion.button>
                    <motion.button
                        className="rounded-xl border border-red-200 text-red-500 bg-transparent py-2.5 px-5 font-medium cursor-pointer hover:bg-red-50 transition-colors text-sm"
                        onClick={onRestart}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                    >
                        Nuova sessione
                    </motion.button>
                    {missed.length > 0 && (
                        <motion.button
                            className="rounded-xl bg-red-500 text-white py-2.5 px-5 font-medium cursor-pointer hover:bg-red-600 transition-colors text-sm"
                            onClick={onRetryMissed}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.96 }}
                        >
                            Ripassa errori ({missed.length})
                        </motion.button>
                    )}
                </div>
            </motion.div>
        );
}
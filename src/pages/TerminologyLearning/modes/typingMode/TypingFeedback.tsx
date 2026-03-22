import { motion } from "framer-motion";
import type { TermEntry } from "../../types";
import MissedTermsList from "./MissedTermsList";
import Score from "../../../../ui/Score";

interface Props {
    correct: number;
    missed: TermEntry[];
    total: number;
    onRetryMissed: () => void;
    onRetry: () => void;
    onRestart: () => void;
}

export default function TypingFeedback({ correct, total, missed, onRestart, onRetry, onRetryMissed }: Props) {
        return (
            <motion.div
                className="flex flex-col gap-6 py-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Score circle */}
                <div className="flex flex-col items-center gap-3">
                    <Score correct={correct} total={total}/>
                    {missed.length > 0 && (
                        <p className="text-red-400 text-sm text-center">
                            {missed.length}{" "}
                            {missed.length === 1
                                ? "termine da ripassare"
                                : "termini da ripassare"}
                        </p>
                    )}
                </div>

                {missed.length > 0 && <MissedTermsList missed={missed} />}

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
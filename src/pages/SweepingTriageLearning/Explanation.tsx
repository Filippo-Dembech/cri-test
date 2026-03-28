import { motion, AnimatePresence } from "framer-motion";
import ColorPill from "../../ui/ColorPill";
import type { ScenarioType } from "./types";

interface Props {
    onNext: () => void;
    isAnswered: boolean;
    isCorrect: boolean;
    scenario: ScenarioType;
    idx: number;
    queue: ScenarioType[]
}

export default function Explanation({ onNext, isAnswered, isCorrect, scenario, idx, queue }: Props) {
    return (
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
                                <ColorPill color={scenario.correctAnswer}>
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
                        onClick={onNext}
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
    );
}

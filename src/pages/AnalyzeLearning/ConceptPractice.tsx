import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../ui/Button";
import { situations } from "./situations";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
}

/** Build a question card: pick a random question and 4 multiple-choice options */
function buildCard() {
    const correct = situations[Math.floor(Math.random() * situations.length)];
    const question =
        correct.questions[Math.floor(Math.random() * correct.questions.length)];

    // Pick 3 wrong distractors (situations whose name ≠ correct)
    const distractors = shuffle(
        situations.filter((s) => s.name !== correct.name),
    ).slice(0, 3);

    const options = shuffle([correct, ...distractors]).map((s) => s.name);

    return { question, correctName: correct.name, options };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type Phase = "question" | "feedback";

export default function ConceptPractice() {
    const [card, setCard] = useState(() => buildCard());
    const [phase, setPhase] = useState<Phase>("question");
    const [selected, setSelected] = useState<string | null>(null);

    // Running score
    const [score, setScore] = useState({ correct: 0, total: 0 });

    const isCorrect = selected === card.correctName;

    function pick(option: string) {
        if (phase !== "question") return;
        setSelected(option);
        setPhase("feedback");
        setScore((s) => ({
            correct: s.correct + (option === card.correctName ? 1 : 0),
            total: s.total + 1,
        }));
    }

    function next() {
        setCard(buildCard());
        setSelected(null);
        setPhase("question");
    }

    // Color helper for option buttons
    function optionStyle(option: string) {
        if (phase === "question")
            return "border border-red-200 bg-red-50 text-red-900 hover:bg-red-100";
        if (option === card.correctName)
            return "border-2 border-green-400 bg-green-50 text-green-800 font-semibold";
        if (option === selected)
            return "border-2 border-red-400 bg-red-100 text-red-700 line-through";
        return "border border-red-100 bg-white text-red-300";
    }

    return (
        <motion.div
            className="flex flex-col gap-4 w-full max-w-120 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            {/* Score bar */}
            <div className="flex items-center justify-between px-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-red-400">
                    A quale situazione appartiene?
                </p>
                <span className="text-[10px] font-semibold bg-red-50 border border-red-100 text-red-400 px-2.5 py-1 rounded-full">
                    {score.correct}/{score.total}
                </span>
            </div>

            {/* Question card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={card.question}
                    className="bg-red-100 border border-red-200 rounded-2xl px-5 py-6 flex flex-col gap-1"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-1">
                        Domanda
                    </p>
                    <p className="text-xl font-semibold text-red-900 leading-snug">
                        {card.question}
                    </p>
                </motion.div>
            </AnimatePresence>

            {/* Options */}
            <div className="flex flex-col gap-2">
                {card.options.map((option) => (
                    <motion.button
                        key={option}
                        onClick={() => pick(option)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-colors cursor-pointer ${optionStyle(option)}`}
                        whileTap={phase === "question" ? { scale: 0.98 } : {}}
                    >
                        {option}
                    </motion.button>
                ))}
            </div>

            {/* Feedback + next */}
            <AnimatePresence>
                {phase === "feedback" && (
                    <motion.div
                        className="flex flex-col gap-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        {/* Feedback banner */}
                        <div
                            className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                                isCorrect
                                    ? "bg-green-50 border border-green-300 text-green-800"
                                    : "bg-red-50 border border-red-300 text-red-800"
                            }`}
                        >
                            {isCorrect
                                ? "✅ Corretto!"
                                : `❌ Sbagliato — era: ${card.correctName}`}
                        </div>

                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                        >
                            <Button
                                outlined
                                onClick={next}
                            >
                                Prossima Domanda
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

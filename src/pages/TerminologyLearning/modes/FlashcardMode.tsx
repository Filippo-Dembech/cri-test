import { useState } from "react";
import { terms } from "../terminologyData";
import { shuffle } from "../utils";
import { motion } from "framer-motion";
import ProgressBar from "../../../ui/ProgressBar";
import Flashcard from "../../../ui/Flashcard";

export default function FlashcardMode() {
    const [queue, setQueue] = useState(() => shuffle(terms));
    const [idx, setIdx] = useState(0);
    const [known, setKnown] = useState(0);
    const [total, setTotal] = useState(0);
    const [done, setDone] = useState(false);
    const [isCardFlipped, setIsCardFlipped] = useState(false);

    const current = queue[idx];

    function restart() {
        setQueue(shuffle(terms));
        setIdx(0);
        setIsCardFlipped(false);
        setKnown(0);
        setTotal(0);
        setDone(false);
    }

    if (done) {
        const percentage = Math.round((known / total) * 100);
        return (
            <motion.div
                className="flex flex-col items-center gap-5 py-6"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div
                    className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${percentage >= 80 ? "border-green-400 bg-green-50" : percentage >= 50 ? "border-amber-400 bg-amber-50" : "border-red-400 bg-red-50"}`}
                >
                    <span
                        className={`text-2xl font-semibold ${percentage >= 80 ? "text-green-700" : percentage >= 50 ? "text-amber-700" : "text-red-700"}`}
                    >
                        {percentage}%
                    </span>
                </div>
                <p className="text-red-900 font-medium text-lg">
                    {known} su {total} termini conosciuti
                </p>
                <p className="text-red-400 text-sm text-center">
                    {percentage >= 80
                        ? "Ottimo lavoro! Stai memorizzando bene."
                        : percentage >= 50
                          ? "Buon progresso, continua a esercitarti!"
                          : "Continua a studiare, ci vuole pratica!"}
                </p>
                <motion.button
                    className="rounded-xl bg-red-500 text-white py-2.5 px-8 font-medium cursor-pointer hover:bg-red-600 transition-colors text-sm"
                    onClick={restart}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                >
                    Ricomincia
                </motion.button>
            </motion.div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <ProgressBar
                done={idx}
                total={queue.length}
            />

            <Flashcard
                front={current.definition}
                back={current.validAnswers}
                isFlipped={isCardFlipped}
                onDeclare={() => setTotal((t) => t + 1)}
                onFlipChange={() => setIsCardFlipped(curr => !curr)}
                onFlipComplete={() => {
                    const nextIdx = idx + 1;
                    if (nextIdx >= queue.length) {
                        setDone(true);
                    } else {
                        setIdx(nextIdx);
                    }
                }}
                onRemember={() => {
                    setKnown((k) => k + 1);
                }}
            />
        </div>
    );
}

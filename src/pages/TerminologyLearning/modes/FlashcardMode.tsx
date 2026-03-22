import { useState } from "react";
import { terms } from "../terminologyData";
import { shuffle } from "../utils";
import { AnimatePresence, motion } from "framer-motion";
import ProgressBar from "../../../ui/ProgressBar";

export default function FlashcardMode() {
    const [queue, setQueue] = useState(() => shuffle(terms));
    const [idx, setIdx] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [result, setResult] = useState<"known" | "unknown" | null>(null);
    const [known, setKnown] = useState(0);
    const [total, setTotal] = useState(0);
    const [done, setDone] = useState(false);

    const current = queue[idx];

    function handleResult(r: "known" | "unknown") {
        if (result) return;
        setResult(r);
        setTotal((t) => t + 1);
        if (r === "known") setKnown((k) => k + 1);
        setFlipped(false);

        // Update the term at the midpoint of the flip (card is edge-on = invisible)
        setTimeout(() => {
            setResult(null);
            const nextIdx = idx + 1;
            if (nextIdx >= queue.length) {
                setDone(true);
            } else {
                setIdx(nextIdx);
            }
        }, 225); // half of your 450ms flip duration
    }

    function restart() {
        setQueue(shuffle(terms));
        setIdx(0);
        setFlipped(false);
        setResult(null);
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
            {/* Progress */}
            <ProgressBar done={idx} total={queue.length} />

            {/* Card */}
            <div
                className="relative"
                style={{ perspective: 1000 }}
            >
                <motion.div
                    className="relative w-full cursor-pointer"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{ rotateY: flipped ? 180 : 0 }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    onClick={() => !result && setFlipped((f) => !f)}
                >
                    {/* Front */}
                    <div
                        className="w-full bg-red-50 border border-red-200 rounded-2xl px-6 py-10 flex flex-col items-center justify-center gap-3 min-h-44"
                        style={{ backfaceVisibility: "hidden" }}
                    >
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300">
                            Definizione
                        </p>
                        <p className="text-red-900 text-center text-base leading-relaxed">
                            {current.definition}
                        </p>
                        <p className="text-[11px] text-red-300 mt-2">
                            tocca per girare
                        </p>
                    </div>
                    {/* Back */}
                    <div
                        className="absolute inset-0 w-full bg-white border border-red-300 rounded-2xl px-6 py-10 flex flex-col items-center justify-center gap-3 min-h-44"
                        style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                        }}
                    >
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300">
                            Termine
                        </p>
                        <p className="text-red-900 text-center text-xl font-semibold leading-relaxed">
                            {current.validAnswers[0]}
                        </p>
                        {current.validAnswers.length > 1 && (
                            <p className="text-[11px] text-red-300">
                                anche:{" "}
                                {current.validAnswers.slice(1).join(", ")}
                            </p>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Actions */}
            <AnimatePresence mode="wait">
                {!flipped ? (
                    <motion.button
                        key="flip-btn"
                        className="w-full border border-red-200 text-red-400 bg-transparent py-2.5 rounded-xl cursor-pointer hover:bg-red-50 transition-all text-sm font-medium"
                        onClick={() => setFlipped(true)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        Mostra risposta
                    </motion.button>
                ) : (
                    <motion.div
                        key="result-btns"
                        className="flex gap-2"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.button
                            className="flex-1 border border-red-200 text-red-500 bg-red-50 py-2.5 rounded-xl cursor-pointer hover:bg-red-100 transition-all text-sm font-medium"
                            onClick={() => handleResult("unknown")}
                            whileTap={{ scale: 0.96 }}
                            disabled={!!result}
                        >
                            Non sapevo
                        </motion.button>
                        <motion.button
                            className="flex-1 border border-green-200 text-green-700 bg-green-50 py-2.5 rounded-xl cursor-pointer hover:bg-green-100 transition-all text-sm font-medium"
                            onClick={() => handleResult("known")}
                            whileTap={{ scale: 0.96 }}
                            disabled={!!result}
                        >
                            Sapevo
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

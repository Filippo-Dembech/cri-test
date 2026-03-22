import { useEffect, useRef, useState } from "react";
import { shuffle } from "../utils";
import { terms } from "../terminologyData";
import { AnimatePresence, motion } from "framer-motion";
import ProgressBar from "../../../ui/ProgressBar";

type Term = (typeof terms)[number];

interface Props {
    termsCount: number | "all";
}

export default function TypingMode({ termsCount }: Props) {
    const [queue, setQueue] = useState<Term[]>(() =>
        termsCount === "all" ? shuffle(terms) : shuffle(terms).slice(0, termsCount),
    );
    const [idx, setIdx] = useState(0);
    const [input, setInput] = useState("");
    const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
    const [revealed, setRevealed] = useState(false);
    const [correct, setCorrect] = useState(0);
    const [missed, setMissed] = useState<Term[]>([]);
    const [done, setDone] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const current = queue[idx];
    const total = queue.length;

    useEffect(() => {
        if (status === "idle") inputRef.current?.focus();
    }, [idx, status]);

    function addToMissed(term: Term) {
        setMissed((prev) =>
            prev.some((t) => t === term) ? prev : [...prev, term],
        );
    }

    const goNext = () => {
        setInput("");
        setStatus("idle");
        setRevealed(false);
        if (idx + 1 >= queue.length) setDone(true);
        else setIdx((i) => i + 1);
    };

    const handleSubmit = () => {
        if (revealed) {
            goNext();
            return;
        }
        const trimmed = input.trim().toLowerCase();
        const isCorrect = current.validAnswers.some(
            (a) => a.toLowerCase() === trimmed,
        );
        if (isCorrect) {
            setStatus("correct");
            // Only counts as correct if never missed before
            if (!missed.some((t) => t === current)) setCorrect((c) => c + 1);
            setTimeout(goNext, 700);
        } else {
            setStatus("wrong");
            addToMissed(current);
        }
    };

    const handleReveal = () => {
        setRevealed(true);
        setStatus("wrong");
        addToMissed(current);
    };

    function restart(mode: "reshuffle" | "retry-missed" | "restart") {
        setIdx(0);
        setInput("");
        setStatus("idle");
        setRevealed(false);
        setCorrect(0);
        setMissed([]);
        setDone(false);

        if (mode === "reshuffle") {
            // Nuova sessione con termini diversi
            setQueue(shuffle(terms).slice(0, 20));
        } else if (mode === "retry-missed") {
            // Solo i termini sbagliati, rimescolati
            setQueue(shuffle(missed));
        }
        // "restart" riusa la queue già in stato, nessuna modifica
    }

    if (done) {
        const pct = Math.round((correct / total) * 100);
        return (
            <motion.div
                className="flex flex-col gap-6 py-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Score circle */}
                <div className="flex flex-col items-center gap-3">
                    <div
                        className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${pct >= 80 ? "border-green-400 bg-green-50" : pct >= 50 ? "border-amber-400 bg-amber-50" : "border-red-400 bg-red-50"}`}
                    >
                        <span
                            className={`text-2xl font-semibold ${pct >= 80 ? "text-green-700" : pct >= 50 ? "text-amber-700" : "text-red-700"}`}
                        >
                            {pct}%
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
                        onClick={() => restart("restart")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                    >
                        Ricomincia
                    </motion.button>
                    <motion.button
                        className="rounded-xl border border-red-200 text-red-500 bg-transparent py-2.5 px-5 font-medium cursor-pointer hover:bg-red-50 transition-colors text-sm"
                        onClick={() => restart("reshuffle")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                    >
                        Nuova sessione
                    </motion.button>
                    {missed.length > 0 && (
                        <motion.button
                            className="rounded-xl bg-red-500 text-white py-2.5 px-5 font-medium cursor-pointer hover:bg-red-600 transition-colors text-sm"
                            onClick={() => restart("retry-missed")}
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
    return (
        <div className="flex flex-col gap-4">
            {/* Progress */}
            <ProgressBar
                done={idx}
                total={queue.length}
            />

            {/* Definition */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={idx}
                    className="bg-red-50 border border-red-200 rounded-2xl px-5 py-6"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.3 }}
                >
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300 mb-2">
                        Definizione
                    </p>
                    <p className="text-red-900 text-base leading-relaxed">
                        {current.definition}
                    </p>
                </motion.div>
            </AnimatePresence>

            {/* Revealed answer */}
            <AnimatePresence>
                {revealed && (
                    <motion.div
                        className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                    >
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-400 mb-1">
                            Risposta corretta
                        </p>
                        <p className="text-amber-900 font-medium">
                            {current.validAnswers[0]}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Input */}
            <form
                className="flex flex-col gap-3 sm:flex-row"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <motion.input
                    ref={inputRef}
                    type="text"
                    placeholder="Scrivi il termine..."
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        if (status === "wrong" && !revealed) setStatus("idle");
                    }}
                    disabled={status === "correct" || revealed}
                    animate={
                        status === "wrong" && !revealed
                            ? { x: [0, -8, 8, -6, 6, -4, 4, 0] }
                            : { x: 0 }
                    }
                    transition={{ duration: 0.4 }}
                    style={
                        status === "correct"
                            ? {
                                  border: "2px solid #86efac",
                                  backgroundColor: "#f0fdf4",
                              }
                            : status === "wrong" && !revealed
                              ? {
                                    border: "2px solid #ef4444",
                                    backgroundColor: "#fef2f2",
                                }
                              : { border: "2px solid #fecaca" }
                    }
                    className="rounded-xl py-2 px-4 outline-0 flex-1 text-red-900 placeholder-red-300 bg-white text-sm"
                />
                <motion.button
                    type="submit"
                    className="rounded-xl bg-red-500 text-white py-2 px-5 font-medium cursor-pointer hover:bg-red-600 transition-colors text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                >
                    {revealed ? "Avanti →" : "Rispondi"}
                </motion.button>
            </form>

            {/* Reveal / skip */}
            {!revealed && status !== "correct" && (
                <motion.button
                    className="w-full border border-red-200 text-red-400 bg-transparent py-2 rounded-xl cursor-pointer hover:bg-red-50 transition-all text-sm font-medium"
                    onClick={handleReveal}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                >
                    Mostra risposta
                </motion.button>
            )}
        </div>
    );
}

import { useEffect, useRef, useState } from "react";
import { shuffle } from "../../utils";
import { terms } from "../../terminologyData";
import { AnimatePresence, motion } from "framer-motion";
import ProgressBar from "../../../../ui/ProgressBar";
import TypingFeedback from "./TypingFeedback";
import type { TermEntry } from "../../types";

interface Props {
    termsCount: number | "all";
}

export default function TypingMode({ termsCount }: Props) {
    const [queue, setQueue] = useState<TermEntry[]>(() =>
        termsCount === "all" ? shuffle(terms) : shuffle(terms).slice(0, termsCount),
    );
    const [idx, setIdx] = useState(0);
    const [input, setInput] = useState("");
    const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
    const [revealed, setRevealed] = useState(false);
    const [correct, setCorrect] = useState(0);
    const [missed, setMissed] = useState<TermEntry[]>([]);
    const [done, setDone] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const current = queue[idx];
    const total = queue.length;

    useEffect(() => {
        if (status === "idle") inputRef.current?.focus();
    }, [idx, status]);

    function addToMissed(term: TermEntry) {
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

    function restart(mode: "restart" | "retry-missed" | "retry") {
        setIdx(0);
        setInput("");
        setStatus("idle");
        setRevealed(false);
        setCorrect(0);
        setMissed([]);
        setDone(false);

        if (mode === "restart") {
            // Nuova sessione con termini diversi
            setQueue(termsCount === "all" ? shuffle(terms) : shuffle(terms).slice(0, termsCount));
        } else if (mode === "retry-missed") {
            // Solo i termini sbagliati, rimescolati
            setQueue(shuffle(missed));
        }
        // "restart" riusa la queue già in stato, nessuna modifica
    }

    if (done) return (
        <TypingFeedback
            correct={correct}
            missed={missed}
            total={total}
            onRetry={() => restart("retry")}
            onRetryMissed={() => restart("retry-missed")}
            onRestart={() => restart("restart")}
        />
    )
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

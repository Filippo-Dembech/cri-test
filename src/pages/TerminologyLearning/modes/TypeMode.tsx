import { useEffect, useRef, useState } from "react";
import { shuffle } from "../utils";
import { terms } from "../terminologyData";
import { AnimatePresence, motion } from "framer-motion";

export default function TypeMode() {
    const [queue] = useState(() => shuffle(terms));
    const [idx, setIdx] = useState(0);
    const [input, setInput] = useState("");
    const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
    const [revealed, setRevealed] = useState(false);
    const [score, setScore] = useState({ correct: 0, total: 0 });
    const [done, setDone] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const current = queue[idx];

    useEffect(() => {
        if (status === "idle") inputRef.current?.focus();
    }, [idx, status]);

    const goNext = () => {
        setInput("");
        setStatus("idle");
        setRevealed(false);
        if (idx + 1 >= queue.length) setDone(true);
        else setIdx((i) => i + 1);
    };

    const handleSubmit = () => {
        if (revealed) { goNext(); return; }
        const trimmed = input.trim().toLowerCase();
        const isCorrect = current.validAnswers.some(
            (a) => a.toLowerCase() === trimmed
        );
        setStatus(isCorrect ? "correct" : "wrong");
        setScore((s) => ({
            correct: s.correct + (isCorrect ? 1 : 0),
            total: s.total + 1,
        }));
        if (isCorrect) setTimeout(goNext, 700);
    };

    const handleReveal = () => {
        setRevealed(true);
        setStatus("wrong");
        setScore((s) => ({ ...s, total: s.total + 1 }));
    };

    if (done) {
        const pct = Math.round((score.correct / score.total) * 100);
        return (
            <motion.div
                className="flex flex-col items-center gap-5 py-6"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${pct >= 80 ? "border-green-400 bg-green-50" : pct >= 50 ? "border-amber-400 bg-amber-50" : "border-red-400 bg-red-50"}`}>
                    <span className={`text-2xl font-semibold ${pct >= 80 ? "text-green-700" : pct >= 50 ? "text-amber-700" : "text-red-700"}`}>{pct}%</span>
                </div>
                <p className="text-red-900 font-medium text-lg">{score.correct} su {score.total} corrette</p>
                <motion.button
                    className="rounded-xl bg-red-500 text-white py-2.5 px-8 font-medium cursor-pointer hover:bg-red-600 transition-colors text-sm"
                    onClick={() => { setIdx(0); setInput(""); setStatus("idle"); setRevealed(false); setScore({ correct: 0, total: 0 }); setDone(false); }}
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
            <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 rounded-full bg-red-100 overflow-hidden">
                    <motion.div
                        className="h-full bg-red-400 rounded-full"
                        animate={{ width: `${(idx / queue.length) * 100}%` }}
                        transition={{ duration: 0.4 }}
                    />
                </div>
                <span className="text-xs text-red-400 font-medium tabular-nums">{idx + 1}/{queue.length}</span>
            </div>

            {/* Score pills */}
            {score.total > 0 && (
                <div className="flex gap-2">
                    <div className="flex-1 bg-green-50 border border-green-200 rounded-xl py-1.5 text-center">
                        <span className="text-xs font-semibold text-green-700">{score.correct} corrette</span>
                    </div>
                    <div className="flex-1 bg-red-50 border border-red-200 rounded-xl py-1.5 text-center">
                        <span className="text-xs font-semibold text-red-500">{score.total - score.correct} errate</span>
                    </div>
                </div>
            )}

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
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300 mb-2">Definizione</p>
                    <p className="text-red-900 text-base leading-relaxed">{current.definition}</p>
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
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-400 mb-1">Risposta corretta</p>
                        <p className="text-amber-900 font-medium">{current.validAnswers[0]}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Input */}
            <form
                className="flex flex-col gap-3 sm:flex-row"
                onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
            >
                <motion.input
                    ref={inputRef}
                    type="text"
                    placeholder="Scrivi il termine..."
                    value={input}
                    onChange={(e) => { setInput(e.target.value); if (status === "wrong" && !revealed) setStatus("idle"); }}
                    disabled={status === "correct" || revealed}
                    animate={status === "wrong" && !revealed ? { x: [0, -8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
                    transition={{ duration: 0.4 }}
                    style={
                        status === "correct"
                            ? { border: "2px solid #86efac", backgroundColor: "#f0fdf4" }
                            : status === "wrong" && !revealed
                            ? { border: "2px solid #ef4444", backgroundColor: "#fef2f2" }
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
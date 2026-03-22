import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ModeSelector from "./ModeSelector";
import type { MatchCard, MatchStatus, ModeType, TermEntry } from "./types";
import { terms } from "./terminologyData";

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ─── FLASHCARD MODE ───────────────────────────────────────────────────────────

function FlashcardMode() {
    const [queue, setQueue] = useState(() => shuffle(terms));
    const [idx, setIdx] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [result, setResult] = useState<"known" | "unknown" | null>(null);
    const [known, setKnown] = useState(0);
    const [total, setTotal] = useState(0);
    const [done, setDone] = useState(false);

    const current = queue[idx];

    const handleResult = (r: "known" | "unknown") => {
        setResult(r);
        setTotal((t) => t + 1);
        if (r === "known") setKnown((k) => k + 1);
        setTimeout(() => {
            setResult(null);
            setFlipped(false);
            if (idx + 1 >= queue.length) {
                setDone(true);
            } else {
                setIdx((i) => i + 1);
            }
        }, 400);
    };

    const handleRestart = () => {
        setQueue(shuffle(terms));
        setIdx(0);
        setFlipped(false);
        setResult(null);
        setKnown(0);
        setTotal(0);
        setDone(false);
    };

    if (done) {
        const pct = Math.round((known / total) * 100);
        return (
            <motion.div
                className="flex flex-col items-center gap-5 py-6"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${pct >= 80 ? "border-green-400 bg-green-50" : pct >= 50 ? "border-amber-400 bg-amber-50" : "border-red-400 bg-red-50"}`}>
                    <span className={`text-2xl font-semibold ${pct >= 80 ? "text-green-700" : pct >= 50 ? "text-amber-700" : "text-red-700"}`}>{pct}%</span>
                </div>
                <p className="text-red-900 font-medium text-lg">
                    {known} su {total} termini conosciuti
                </p>
                <p className="text-red-400 text-sm text-center">
                    {pct >= 80 ? "Ottimo lavoro! Stai memorizzando bene." : pct >= 50 ? "Buon progresso, continua a esercitarti!" : "Continua a studiare, ci vuole pratica!"}
                </p>
                <motion.button
                    className="rounded-xl bg-red-500 text-white py-2.5 px-8 font-medium cursor-pointer hover:bg-red-600 transition-colors text-sm"
                    onClick={handleRestart}
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
                        animate={{ width: `${((idx) / queue.length) * 100}%` }}
                        transition={{ duration: 0.4 }}
                    />
                </div>
                <span className="text-xs text-red-400 font-medium tabular-nums">{idx + 1}/{queue.length}</span>
            </div>

            {/* Card */}
            <div className="relative" style={{ perspective: 1000 }}>
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
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300">Definizione</p>
                        <p className="text-red-900 text-center text-base leading-relaxed">{current.definition}</p>
                        <p className="text-[11px] text-red-300 mt-2">tocca per girare</p>
                    </div>
                    {/* Back */}
                    <div
                        className="absolute inset-0 w-full bg-white border border-red-300 rounded-2xl px-6 py-10 flex flex-col items-center justify-center gap-3 min-h-44"
                        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                    >
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300">Termine</p>
                        <p className="text-red-900 text-center text-xl font-semibold leading-relaxed">
                            {current.validAnswers[0]}
                        </p>
                        {current.validAnswers.length > 1 && (
                            <p className="text-[11px] text-red-300">
                                anche: {current.validAnswers.slice(1).join(", ")}
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

// ─── TYPE MODE ────────────────────────────────────────────────────────────────

function TypeMode() {
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

// ─── MATCH MODE ───────────────────────────────────────────────────────────────


function MatchMode() {
    const BATCH = 6;

    const buildBatch = (pool: TermEntry[]) => {
        const batch = pool.slice(0, BATCH);
        const cards: MatchCard[] = [];
        batch.forEach((t, i) => {
            cards.push({ id: `d-${i}`, text: t.definition, type: "def", pairIdx: i });
            cards.push({ id: `t-${i}`, text: t.validAnswers[0], type: "term", pairIdx: i });
        });
        return { batch, cards: shuffle(cards) };
    };

    const [pool] = useState(() => shuffle(terms));
    const [batchStart, setBatchStart] = useState(0);
    const [{ cards }, setBoard] = useState(() => buildBatch(pool));
    const [selected, setSelected] = useState<MatchCard | null>(null);
    const [matched, setMatched] = useState<Set<number>>(new Set());
    const [flashStatus, setFlashStatus] = useState<Record<string, MatchStatus>>({});
    const [score, setScore] = useState({ correct: 0, attempts: 0 });
    const [done, setDone] = useState(false);

    const handleSelect = (card: MatchCard) => {
        if (matched.has(card.pairIdx)) return;
        if (flashStatus[card.id] === "wrong") return;
        if (selected?.id === card.id) { setSelected(null); return; }

        if (!selected) { setSelected(card); return; }

        if (selected.type === card.type) { setSelected(card); return; }

        const isMatch = selected.pairIdx === card.pairIdx;
        setScore((s) => ({ correct: s.correct + (isMatch ? 1 : 0), attempts: s.attempts + 1 }));

        if (isMatch) {
            setFlashStatus((f) => ({ ...f, [selected.id]: "correct", [card.id]: "correct" }));
            const newMatched = new Set(matched).add(card.pairIdx);
            setMatched(newMatched);
            setSelected(null);
            if (newMatched.size === Math.min(BATCH, pool.length - batchStart)) {
                const nextStart = batchStart + BATCH;
                if (nextStart >= pool.length) {
                    setTimeout(() => setDone(true), 500);
                } else {
                    setTimeout(() => {
                        setBatchStart(nextStart);
                        setBoard(buildBatch(pool.slice(nextStart)));
                        setMatched(new Set());
                        setFlashStatus({});
                        setSelected(null);
                    }, 600);
                }
            }
        } else {
            setFlashStatus((f) => ({ ...f, [selected.id]: "wrong", [card.id]: "wrong" }));
            setTimeout(() => {
                setFlashStatus((f) => {
                    const n = { ...f };
                    delete n[selected.id];
                    delete n[card.id];
                    return n;
                });
                setSelected(null);
            }, 800);
        }
    };

    if (done) {
        const pct = Math.round((score.correct / score.attempts) * 100);
        return (
            <motion.div
                className="flex flex-col items-center gap-5 py-6"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${pct >= 80 ? "border-green-400 bg-green-50" : pct >= 50 ? "border-amber-400 bg-amber-50" : "border-red-400 bg-red-50"}`}>
                    <span className={`text-2xl font-semibold ${pct >= 80 ? "text-green-700" : pct >= 50 ? "text-amber-700" : "text-red-700"}`}>{pct}%</span>
                </div>
                <p className="text-red-900 font-medium text-lg">{score.correct} su {score.attempts} abbinamenti corretti</p>
                <motion.button
                    className="rounded-xl bg-red-500 text-white py-2.5 px-8 font-medium cursor-pointer hover:bg-red-600 transition-colors text-sm"
                    onClick={() => { setBatchStart(0); setBoard(buildBatch(pool)); setMatched(new Set()); setFlashStatus({}); setSelected(null); setScore({ correct: 0, attempts: 0 }); setDone(false); }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                >
                    Ricomincia
                </motion.button>
            </motion.div>
        );
    }

    const totalBatches = Math.ceil(pool.length / BATCH);
    const currentBatch = Math.floor(batchStart / BATCH) + 1;

    return (
        <div className="flex flex-col gap-4">
            {/* Progress */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 rounded-full bg-red-100 overflow-hidden">
                    <motion.div
                        className="h-full bg-red-400 rounded-full"
                        animate={{ width: `${((currentBatch - 1) / totalBatches) * 100 + (matched.size / Math.min(BATCH, pool.length - batchStart)) * (100 / totalBatches)}%` }}
                        transition={{ duration: 0.4 }}
                    />
                </div>
                <span className="text-xs text-red-400 font-medium tabular-nums">
                    Serie {currentBatch}/{totalBatches}
                </span>
            </div>

            <p className="text-xs text-red-400 font-medium">
                Abbina ogni termine alla sua definizione
            </p>

            <div className="grid grid-cols-2 gap-2">
                {cards.map((card) => {
                    const isMatched = matched.has(card.pairIdx);
                    const isSelected = selected?.id === card.id;
                    const fs = flashStatus[card.id];

                    return (
                        <motion.button
                            key={card.id}
                            onClick={() => handleSelect(card)}
                            disabled={isMatched}
                            animate={
                                fs === "wrong"
                                    ? { x: [0, -6, 6, -4, 4, 0] }
                                    : { x: 0 }
                            }
                            transition={{ duration: 0.35 }}
                            className={`text-left px-3 py-3 rounded-xl border text-xs leading-snug transition-colors duration-150 cursor-pointer font-medium min-h-14 flex items-center ${
                                isMatched
                                    ? "bg-green-50 border-green-300 text-green-700 cursor-default opacity-60"
                                    : fs === "correct"
                                    ? "bg-green-50 border-green-300 text-green-700"
                                    : fs === "wrong"
                                    ? "bg-red-50 border-red-300 text-red-600"
                                    : isSelected
                                    ? "bg-red-500 border-red-500 text-white"
                                    : "bg-white border-red-100 text-red-900 hover:border-red-300 hover:bg-red-50"
                            }`}
                            whileTap={isMatched ? {} : { scale: 0.97 }}
                        >
                            {card.text}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function TerminologyLearning() {
    const [mode, setMode] = useState<ModeType>("flashcard");
    const [modeKey, setModeKey] = useState(0);

    function handleModeChange(mode: ModeType) {
        setMode(mode);
        setModeKey((k) => k + 1);
    };


    return (
        <div className="flex flex-col gap-5 w-full sm:max-w-200">

            <ModeSelector
                currentMode={mode}
                onSelect={(m) => handleModeChange(m.id)}
            />

            {/* Mode content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={modeKey}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                >
                    {mode === "flashcard" && <FlashcardMode />}
                    {mode === "type"      && <TypeMode />}
                    {mode === "match"     && <MatchMode />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
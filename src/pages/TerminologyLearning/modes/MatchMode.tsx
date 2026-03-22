import { motion } from "framer-motion";
import { useState } from "react";
import { terms } from "../terminologyData";
import type { MatchCard, MatchStatus, TermEntry } from "../types";
import { shuffle } from "../utils";

interface Props {
    termsCount: number | "all";
}

export default function MatchMode({ termsCount }: Props) {
    const BATCH = 6;

    const buildBatch = (pool: TermEntry[]) => {
        const batch = pool.slice(0, BATCH);
        const defCards: MatchCard[] = [];
        const termCards: MatchCard[] = [];
        batch.forEach((t, i) => {
            defCards.push({ id: `d-${i}`, text: t.definition, type: "def", pairIdx: i });
            termCards.push({ id: `t-${i}`, text: t.validAnswers[0], type: "term", pairIdx: i });
        });
        return { defCards, termCards: shuffle(termCards) };
    };

    const [pool] = useState(() =>
        termsCount === "all" ? shuffle(terms) : shuffle(terms).slice(0, termsCount)
    );
    const [batchStart, setBatchStart] = useState(0);
    const [{ defCards, termCards }, setBoard] = useState(() => buildBatch(pool));
    const [selected, setSelected] = useState<MatchCard | null>(null);
    const [matched, setMatched] = useState<Set<number>>(new Set());
    const [flashStatus, setFlashStatus] = useState<Record<string, MatchStatus>>({});
    const [score, setScore] = useState({ correct: 0, attempts: 0 });
    const [done, setDone] = useState(false);

    const handleSelect = (card: MatchCard) => {
        if (matched.has(card.pairIdx)) return;
        if (flashStatus[card.id] === "wrong") return;
        if (selected?.id === card.id) { setSelected(null); return; }

        // Same side: switch selection
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
                <p className="text-red-900 font-medium text-lg">
                    {score.correct} su {score.attempts} abbinamenti corretti
                </p>
                <motion.button
                    className="rounded-xl bg-red-500 text-white py-2.5 px-8 font-medium cursor-pointer hover:bg-red-600 transition-colors text-sm"
                    onClick={() => {
                        setBatchStart(0);
                        setBoard(buildBatch(pool));
                        setMatched(new Set());
                        setFlashStatus({});
                        setSelected(null);
                        setScore({ correct: 0, attempts: 0 });
                        setDone(false);
                    }}
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

    const cardClass = (card: MatchCard) => {
        const isMatched = matched.has(card.pairIdx);
        const isSelected = selected?.id === card.id;
        const fs = flashStatus[card.id];
        if (isMatched)    return "bg-green-50 border-green-300 text-green-700 cursor-default opacity-60";
        if (fs === "correct") return "bg-green-50 border-green-300 text-green-700";
        if (fs === "wrong")   return "bg-red-50 border-red-300 text-red-600";
        if (isSelected)       return "bg-red-500 border-red-500 text-white";
        return "bg-white border-red-100 text-red-900 hover:border-red-300 hover:bg-red-50";
    };

    const renderCard = (card: MatchCard) => (
        <motion.button
            key={card.id}
            onClick={() => handleSelect(card)}
            disabled={matched.has(card.pairIdx)}
            animate={flashStatus[card.id] === "wrong" ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.35 }}
            whileTap={matched.has(card.pairIdx) ? {} : { scale: 0.97 }}
            className={`w-full text-left px-3 py-3 rounded-xl border text-xs leading-snug transition-colors duration-150 cursor-pointer font-medium min-h-14 flex items-center ${cardClass(card)}`}
        >
            {card.text}
        </motion.button>
    );

    return (
        <div className="flex flex-col gap-4">
            {/* Progress */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 rounded-full bg-red-100 overflow-hidden">
                    <motion.div
                        className="h-full bg-red-400 rounded-full"
                        animate={{
                            width: `${((currentBatch - 1) / totalBatches) * 100 + (matched.size / Math.min(BATCH, pool.length - batchStart)) * (100 / totalBatches)}%`,
                        }}
                        transition={{ duration: 0.4 }}
                    />
                </div>
                <span className="text-xs text-red-400 font-medium tabular-nums">
                    Serie {currentBatch}/{totalBatches}
                </span>
            </div>

            {/* Board — two fixed columns */}
            <div className="grid grid-cols-2 gap-3">
                {/* Definitions column */}
                <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300 px-1">
                        Definizione
                    </p>
                    {defCards.map(renderCard)}
                </div>

                {/* Terms column */}
                <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300 px-1">
                        Termine
                    </p>
                    {termCards.map(renderCard)}
                </div>
            </div>
        </div>
    );
}
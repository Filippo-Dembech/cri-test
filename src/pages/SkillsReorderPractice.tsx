import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import type { StepsData } from "../exercises";

type Mode = "drag" | "build" | "review";

interface Props {
    selectedSkill: StepsData;
}

interface StepItem {
    id: string;
    text: string;
    origIdx: number;
}

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function toItems(steps: string[]): StepItem[] {
    return steps.map((text, i) => ({ id: `${i}-${text.slice(0, 8)}`, text, origIdx: i }));
}

export default function SkillsReorderPractice({ selectedSkill }: Props) {
    const [mode, setMode] = useState<Mode>("drag");
    const [score, setScore] = useState({ total: 0, correct: 0 });

    // drag mode
    const [items, setItems] = useState<StepItem[]>(() =>
        shuffle(toItems(selectedSkill.steps))
    );
    const [checked, setChecked] = useState(false);

    // build mode
    const [pool, setPool] = useState<StepItem[]>(() =>
        shuffle(toItems(selectedSkill.steps))
    );
    const [placed, setPlaced] = useState<StepItem[]>([]);
    const [buildCorrect, setBuildCorrect] = useState(0);

    const resetAll = useCallback((skill: StepsData, newMode: Mode = mode) => {
        setMode(newMode);
        setChecked(false);
        setItems(shuffle(toItems(skill.steps)));
        setPool(shuffle(toItems(skill.steps)));
        setPlaced([]);
        setBuildCorrect(0);
    }, [mode]);

    // Reset when selectedSkill changes
    const prevSkillRef = useRef(selectedSkill);
    if (prevSkillRef.current !== selectedSkill) {
        prevSkillRef.current = selectedSkill;
        resetAll(selectedSkill);
    }

    const handleModeChange = (m: Mode) => resetAll(selectedSkill, m);

    const handleCheck = () => {
        const correct = items.filter((it, i) => it.origIdx === i).length;
        setScore((s) => ({
            total: s.total + 1,
            correct: s.correct + (correct === items.length ? 1 : 0),
        }));
        setChecked(true);
    };

    const handleTapSelect = (queueIdx: number) => {
        const item = pool[queueIdx];
        const isCorrect = item.origIdx === placed.length;
        const newPlaced = [...placed, item];
        const newPool = pool.filter((_, i) => i !== queueIdx);
        const newBuildCorrect = buildCorrect + (isCorrect ? 1 : 0);

        setPool(newPool);
        setPlaced(newPlaced);
        setBuildCorrect(newBuildCorrect);

        if (newPlaced.length === selectedSkill.steps.length) {
            setScore((s) => ({
                total: s.total + 1,
                correct: s.correct + (newBuildCorrect === selectedSkill.steps.length ? 1 : 0),
            }));
        }
    };

    const buildDone = placed.length === selectedSkill.steps.length;
    const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : null;

    return (
        <div className="flex flex-col gap-4">

            {/* Score */}
            <AnimatePresence>
                {score.total > 0 && (
                    <motion.div
                        className="flex gap-3"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                    >
                        <div className="flex-1 bg-red-50 border border-red-100 rounded-xl px-4 py-2 text-center">
                            <p className="text-xs font-semibold uppercase tracking-widest text-red-300 mb-0.5">
                                Corrette
                            </p>
                            <p className="text-base font-semibold text-red-700">
                                {score.correct}
                                <span className="text-red-300 mx-1">/</span>
                                {score.total}
                            </p>
                        </div>
                        <div className="flex-1 bg-red-50 border border-red-100 rounded-xl px-4 py-2 text-center">
                            <p className="text-xs font-semibold uppercase tracking-widest text-red-300 mb-0.5">
                                Accuratezza
                            </p>
                            <p className="text-base font-semibold text-red-700">{accuracy}%</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mode tabs */}
            <div className="flex gap-2 bg-red-50 border border-red-200 rounded-2xl p-1.5">
                {(["drag", "build", "review"] as Mode[]).map((m) => (
                    <motion.button
                        key={m}
                        onClick={() => handleModeChange(m)}
                        className="relative flex-1 py-2 text-sm font-medium rounded-xl cursor-pointer transition-colors duration-150 z-10"
                        style={{ color: mode === m ? "#7f1d1d" : "#f87171" }}
                        whileTap={{ scale: 0.97 }}
                    >
                        {mode === m && (
                            <motion.div
                                layoutId="drill-mode-pill"
                                className="absolute inset-0 bg-white border border-red-200 rounded-xl"
                                style={{ zIndex: -1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                        )}
                        {m === "drag" ? "Riordina" : m === "build" ? "Costruisci" : "Rivedi"}
                    </motion.button>
                ))}
            </div>

            {/* Mode content */}
            <AnimatePresence mode="wait">

                {/* DRAG MODE */}
                {mode === "drag" && (
                    <motion.div
                        key="drag"
                        className="flex flex-col gap-3"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.25 }}
                    >
                        <Reorder.Group
                            axis="y"
                            values={items}
                            onReorder={checked ? () => {} : setItems}
                            className="flex flex-col gap-2"
                        >
                            {items.map((item, i) => {
                                const isCorrect = checked && item.origIdx === i;
                                const isWrong = checked && item.origIdx !== i;
                                return (
                                    <Reorder.Item
                                        key={item.id}
                                        value={item}
                                        dragListener={!checked}
                                        className={`flex items-start gap-3 px-4 py-3 rounded-xl border select-none transition-colors duration-200 ${
                                            isCorrect
                                                ? "bg-green-50 border-green-300"
                                                : isWrong
                                                ? "bg-red-50 border-red-300"
                                                : "bg-white border-red-100 cursor-grab active:cursor-grabbing"
                                        }`}
                                        whileDrag={{ scale: 1.02, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
                                    >
                                        <span className={`mt-0.5 min-w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0 ${
                                            isCorrect ? "bg-green-500 text-white"
                                            : isWrong ? "bg-red-400 text-white"
                                            : "bg-red-100 text-red-400"
                                        }`}>
                                            {i + 1}
                                        </span>
                                        <span className={`text-sm leading-relaxed ${
                                            isCorrect ? "text-green-800"
                                            : isWrong ? "text-red-700"
                                            : "text-red-900"
                                        }`}>
                                            {item.text}
                                        </span>
                                    </Reorder.Item>
                                );
                            })}
                        </Reorder.Group>

                        <AnimatePresence>
                            {checked && (
                                <motion.div
                                    className={`rounded-xl px-4 py-3 text-sm font-medium text-center ${
                                        items.every((it, i) => it.origIdx === i)
                                            ? "bg-green-50 border border-green-300 text-green-800"
                                            : items.filter((it, i) => it.origIdx === i).length >= items.length * 0.7
                                            ? "bg-amber-50 border border-amber-300 text-amber-800"
                                            : "bg-red-50 border border-red-200 text-red-700"
                                    }`}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {(() => {
                                        const correct = items.filter((it, i) => it.origIdx === i).length;
                                        return correct === items.length
                                            ? `Perfetto! Tutti i ${items.length} passi in ordine corretto.`
                                            : `${correct} su ${items.length} passi in ordine corretto.`;
                                    })()}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex gap-2">
                            <motion.button
                                className="flex-1 border border-red-200 text-red-400 bg-transparent py-2 px-4 rounded-xl cursor-pointer hover:bg-red-50 transition-all duration-200 text-sm font-medium"
                                onClick={() => resetAll(selectedSkill, "drag")}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.96 }}
                            >
                                Rimescola
                            </motion.button>
                            {!checked ? (
                                <motion.button
                                    className="flex-1 rounded-xl bg-red-500 text-white py-2 px-4 font-medium cursor-pointer hover:bg-red-600 transition-colors duration-150 text-sm"
                                    onClick={handleCheck}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.96 }}
                                >
                                    Verifica
                                </motion.button>
                            ) : (
                                <motion.button
                                    className="flex-1 rounded-xl bg-red-500 text-white py-2 px-4 font-medium cursor-pointer hover:bg-red-600 transition-colors duration-150 text-sm"
                                    onClick={() => resetAll(selectedSkill, "drag")}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.96 }}
                                >
                                    Riprova
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* BUILD MODE */}
                {mode === "build" && (
                    <motion.div
                        key="build"
                        className="flex flex-col gap-3"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.25 }}
                    >
                        <AnimatePresence>
                            {placed.length > 0 && (
                                <motion.div
                                    className="flex flex-col gap-1.5"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    {placed.map((item, i) => {
                                        const isCorrect = item.origIdx === i;
                                        return (
                                            <motion.div
                                                key={item.id}
                                                className={`flex items-start gap-3 px-4 py-2.5 rounded-xl border text-sm ${
                                                    isCorrect
                                                        ? "bg-green-50 border-green-300 text-green-800"
                                                        : "bg-red-50 border-red-200 text-red-700 line-through"
                                                }`}
                                                initial={{ opacity: 0, x: -12 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <span className={`mt-0.5 min-w-[20px] h-[20px] rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0 ${
                                                    isCorrect ? "bg-green-500 text-white" : "bg-red-400 text-white"
                                                }`}>
                                                    {i + 1}
                                                </span>
                                                {item.text}
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!buildDone && (
                            <>
                                <p className="text-xs font-semibold uppercase tracking-widest text-red-400">
                                    Seleziona il passo #{placed.length + 1}
                                </p>
                                <div className="flex flex-col gap-2">
                                    <AnimatePresence>
                                        {pool.map((item, qi) => (
                                            <motion.button
                                                key={item.id}
                                                onClick={() => handleTapSelect(qi)}
                                                className="text-left px-4 py-3 rounded-xl border border-red-100 bg-white text-red-900 text-sm leading-relaxed cursor-pointer hover:bg-red-50 hover:border-red-300 transition-all duration-150"
                                                initial={{ opacity: 0, y: 6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.96 }}
                                                transition={{ duration: 0.18 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {item.text}
                                            </motion.button>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </>
                        )}

                        <AnimatePresence>
                            {buildDone && (
                                <motion.div
                                    className={`rounded-xl px-4 py-3 text-sm font-medium text-center ${
                                        buildCorrect === selectedSkill.steps.length
                                            ? "bg-green-50 border border-green-300 text-green-800"
                                            : buildCorrect >= selectedSkill.steps.length * 0.7
                                            ? "bg-amber-50 border border-amber-300 text-amber-800"
                                            : "bg-red-50 border border-red-200 text-red-700"
                                    }`}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {buildCorrect === selectedSkill.steps.length
                                        ? `Perfetto! Tutti i ${selectedSkill.steps.length} passi nell'ordine corretto.`
                                        : `${buildCorrect} su ${selectedSkill.steps.length} passi nell'ordine corretto.`}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {buildDone && (
                            <motion.button
                                className="w-full border border-red-200 text-red-400 bg-transparent py-2 px-4 rounded-xl cursor-pointer hover:bg-red-50 transition-all duration-200 text-sm font-medium"
                                onClick={() => resetAll(selectedSkill, "build")}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.96 }}
                            >
                                Riprova
                            </motion.button>
                        )}
                    </motion.div>
                )}

                {/* REVIEW MODE */}
                {mode === "review" && (
                    <motion.div
                        key="review"
                        className="flex flex-col gap-2"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.25 }}
                    >
                        {selectedSkill.steps.map((step, i) => (
                            <motion.div
                                key={i}
                                className="flex items-start gap-3 px-4 py-3 rounded-xl border border-red-100 bg-white"
                                initial={{ opacity: 0, x: 16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.04, duration: 0.2 }}
                            >
                                <span className="mt-0.5 min-w-[22px] h-[22px] rounded-full bg-red-100 flex items-center justify-center text-[11px] font-semibold text-red-400 flex-shrink-0">
                                    {i + 1}
                                </span>
                                <span className="text-sm text-red-900 leading-relaxed">{step}</span>
                            </motion.div>
                        ))}
                        <motion.button
                            className="w-full mt-2 rounded-xl bg-red-500 text-white py-2 px-4 font-medium cursor-pointer hover:bg-red-600 transition-colors duration-150 text-sm"
                            onClick={() => handleModeChange("drag")}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.96 }}
                        >
                            Allenati ora →
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
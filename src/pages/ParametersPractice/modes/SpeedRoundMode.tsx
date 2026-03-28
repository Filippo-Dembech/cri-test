import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { parameters } from "../parameters";
import { classifyValue, generateValue } from "../utils";

const SPEED_TIME = 60;

const LABELS = [
    { value: "bassa" as const, label: "Bassa" },
    { value: "normale" as const, label: "Normale" },
    { value: "alta" as const, label: "Alta" },
];

export default function SpeedRoundMode() {
    const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
    const [timeLeft, setTimeLeft] = useState(SPEED_TIME);
    const [paramIdx, setParamIdx] = useState(0);
    const [value, setValue] = useState("");
    const [correct, setCorrect] = useState<"bassa" | "normale" | "alta">(
        "normale",
    );
    const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
    const [streak, setStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [roundScore, setRoundScore] = useState({ right: 0, total: 0 });
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const nextQuestion = useCallback(() => {
        const idx = Math.floor(Math.random() * parameters.length);
        const v = generateValue(parameters[idx]);
        setParamIdx(idx);
        setValue(v);
        setCorrect(classifyValue(parameters[idx], v));
        setFlash(null);
    }, []);

    const start = () => {
        setPhase("playing");
        setTimeLeft(SPEED_TIME);
        setStreak(0);
        setMaxStreak(0);
        setRoundScore({ right: 0, total: 0 });
        nextQuestion();
    };

    useEffect(() => {
        if (phase !== "playing") return;
        timerRef.current = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    clearInterval(timerRef.current!);
                    setPhase("done");
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [phase]);

    const check = (answer: "bassa" | "normale" | "alta") => {
        const isCorrect = answer === correct;
        setFlash(isCorrect ? "correct" : "wrong");
        setRoundScore((s) => ({
            right: s.right + (isCorrect ? 1 : 0),
            total: s.total + 1,
        }));
        if (isCorrect) {
            setStreak((s) => {
                const n = s + 1;
                setMaxStreak((m) => Math.max(m, n));
                return n;
            });
        } else {
            setStreak(0);
        }
        setTimeout(nextQuestion, 280);
    };

    const timerPct = timeLeft / SPEED_TIME;
    const timerBg =
        timerPct > 0.5
            ? "bg-red-400"
            : timerPct > 0.25
              ? "bg-amber-400"
              : "bg-rose-600";
    const timerText =
        timerPct > 0.5
            ? "text-red-500"
            : timerPct > 0.25
              ? "text-amber-600"
              : "text-rose-700";

    // Idle
    if (phase === "idle") {
        return (
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-8 flex flex-col items-center gap-4 text-center"
            >
                <div className="w-14 h-14 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center text-2xl">
                    ⚡
                </div>
                <div>
                    <p className="text-red-900 font-bold text-lg">
                        Speed Round
                    </p>
                    <p className="text-red-400 text-sm mt-0.5">
                        Classifica più valori possibili in {SPEED_TIME} secondi
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={start}
                    className="mt-1 px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm tracking-wide transition-colors duration-150 shadow-sm"
                >
                    Inizia
                </motion.button>
            </motion.div>
        );
    }

    // Done
    if (phase === "done") {
        const pct =
            roundScore.total > 0
                ? Math.round((roundScore.right / roundScore.total) * 100)
                : 0;
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-8 flex flex-col items-center gap-6"
            >
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-red-400">
                    Risultato
                </p>
                <p className="font-black text-7xl text-red-900 tabular-nums leading-none">
                    {pct}
                    <span className="text-3xl font-bold text-red-300">%</span>
                </p>
                <div className="flex gap-8 justify-center w-full border-t border-red-200 pt-5">
                    {[
                        {
                            label: "Corrette",
                            value: roundScore.right,
                            color: "text-green-600",
                        },
                        {
                            label: "Totale",
                            value: roundScore.total,
                            color: "text-red-900",
                        },
                        {
                            label: "Streak max",
                            value: maxStreak,
                            color: "text-amber-600",
                        },
                    ].map((s) => (
                        <div
                            key={s.label}
                            className="flex flex-col items-center gap-0.5"
                        >
                            <span
                                className={`font-black text-3xl tabular-nums ${s.color}`}
                            >
                                {s.value}
                            </span>
                            <span className="text-[10px] font-bold tracking-widest uppercase text-red-300">
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={start}
                    className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm tracking-wide transition-colors duration-150 shadow-sm"
                >
                    Riprova
                </motion.button>
            </motion.div>
        );
    }

    // Playing
    const p = parameters[paramIdx];

    return (
        <div className="flex flex-col gap-4">
            {/* Timer bar */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-red-100 rounded-full overflow-hidden">
                    <motion.div
                        className={`h-full rounded-full transition-colors duration-500 ${timerBg}`}
                        animate={{ width: `${timerPct * 100}%` }}
                        transition={{ duration: 0.9, ease: "linear" }}
                    />
                </div>
                <span
                    className={`font-black tabular-nums text-lg w-10 text-right ${timerText}`}
                >
                    {timeLeft}s
                </span>
            </div>

            {/* Streak */}
            <AnimatePresence>
                {streak >= 2 && (
                    <motion.div
                        key={streak}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex justify-center"
                    >
                        <span className="bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full">
                            🔥 {streak} consecutivi
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Question card */}
            <div
                className={`bg-red-50 border rounded-2xl p-6 flex flex-col items-center gap-5 transition-colors duration-150 ${
                    flash === "correct"
                        ? "border-green-300 bg-green-50"
                        : flash === "wrong"
                          ? "border-red-400"
                          : "border-red-200"
                }`}
            >
                <div className="flex flex-col items-center gap-0.5 text-center">
                    <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-red-400">
                        {p.shortName} · {p.unit}
                    </p>
                    <p className="text-base font-semibold text-red-900">
                        {p.name}
                    </p>
                </div>

                <motion.p
                    key={value}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 320, damping: 16 }}
                    className="font-black tabular-nums leading-none tracking-tighter transition-colors duration-150"
                    style={{
                        fontSize: "clamp(3.5rem, 12vw, 6rem)",
                        color:
                            flash === "correct"
                                ? "#16a34a"
                                : flash === "wrong"
                                  ? "#dc2626"
                                  : "#9f1239",
                    }}
                >
                    {value}
                </motion.p>

                <div className="w-full h-px bg-red-200" />

                <div className="flex gap-2 sm:gap-3 w-full">
                    {LABELS.map(({ value: v, label }) => (
                        <motion.button
                            key={v}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => check(v)}
                            className="flex-1 py-3 bg-white border border-red-200 text-red-800 font-bold rounded-xl text-sm tracking-wide hover:border-red-400 hover:bg-red-50 active:bg-red-100 transition-all duration-150"
                        >
                            {label}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Live score */}
            <p className="text-sm text-red-400 font-medium px-1 h-10">
                <span className="text-red-700 font-bold text-base tabular-nums">
                    {roundScore.right}
                </span>
                <span className="mx-1 text-red-300">/</span>
                <span className="text-red-600 font-semibold tabular-nums">
                    {roundScore.total}
                </span>
                <span className="ml-2 text-xs uppercase tracking-widest">
                    corrette
                </span>
            </p>
        </div>
    );
}
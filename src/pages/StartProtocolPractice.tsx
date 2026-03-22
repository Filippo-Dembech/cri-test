import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Color = "VERDE" | "GIALLO" | "ROSSO";
type ExerciseType = "scenario" | "next-step" | "what-if";

interface Scenario {
    id: string;
    type: ExerciseType;
    vignette: string;       // what the user reads
    hint?: string;          // shown after first wrong attempt
    correctAnswer: Color;
    options: Color[];       // always 2–3 choices
    explanation: string;    // shown after answering
    path: string[];         // the logical steps, shown in recap
}

// ─── Exercise bank ────────────────────────────────────────────────────────────

const SCENARIOS: Scenario[] = [
    {
        id: "s1",
        type: "scenario",
        vignette: "Il paziente è cosciente e cammina verso di te chiedendo aiuto.",
        correctAnswer: "VERDE",
        options: ["VERDE", "GIALLO", "ROSSO"],
        explanation: "Cammina → codice VERDE. Il paziente deambulante viene classificato immediatamente senza ulteriori valutazioni.",
        path: ["Cammina? → SÌ", "→ VERDE"],
    },
    {
        id: "s2",
        type: "scenario",
        vignette: "Il paziente non cammina, respira spontaneamente con una frequenza di 22 atti/min. Il polso radiale è presente e segue ordini semplici.",
        correctAnswer: "GIALLO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        explanation: "Non cammina → valuta respiro → Sì, < 30 atti/min → valuta polso → presente → valuta ordini → Sì → GIALLO.",
        path: ["Cammina? → NO", "Respira? → SÌ", "< 30 atti/min? → SÌ", "Polso radiale? → SÌ", "Ordini semplici? → SÌ", "→ GIALLO"],
    },
    {
        id: "s3",
        type: "scenario",
        vignette: "Il paziente non cammina, non respira spontaneamente. Dopo pervietà-cannula non inizia a respirare.",
        correctAnswer: "ROSSO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        explanation: "Non respira → pervietà-cannula → ancora non respira → ROSSO.",
        path: ["Cammina? → NO", "Respira? → NO", "Pervietà-cannula → respira? → NO", "→ ROSSO"],
    },
    {
        id: "s4",
        type: "scenario",
        vignette: "Il paziente non cammina, non respira, ma dopo pervietà-cannula riprende a respirare con 26 atti/min. Il polso radiale non è apprezzabile.",
        correctAnswer: "ROSSO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        hint: "Dopo la cannula il paziente respira: continua la valutazione.",
        explanation: "Respira dopo cannula → < 30 atti/min → valuta polso → assente → ROSSO.",
        path: ["Cammina? → NO", "Respira? → NO", "Pervietà-cannula → respira? → SÌ", "< 30 atti/min? → SÌ", "Polso radiale? → NO", "→ ROSSO"],
    },
    {
        id: "s5",
        type: "scenario",
        vignette: "Il paziente non cammina, respira con una frequenza di 36 atti/min.",
        correctAnswer: "ROSSO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        explanation: "Respira ma > 30 atti/min → ROSSO. L'alta frequenza respiratoria è già sufficiente per il codice rosso.",
        path: ["Cammina? → NO", "Respira? → SÌ", "< 30 atti/min? → NO", "→ ROSSO"],
    },
    {
        id: "s6",
        type: "scenario",
        vignette: "Il paziente non cammina, respira a 18 atti/min, il polso radiale è presente ma non risponde agli ordini semplici.",
        correctAnswer: "ROSSO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        hint: "Arrivato all'ultimo step, ricorda cosa implica non eseguire ordini semplici.",
        explanation: "Frequenza ok, polso presente → ordini semplici? NO → ROSSO.",
        path: ["Cammina? → NO", "Respira? → SÌ", "< 30 atti/min? → SÌ", "Polso radiale? → SÌ", "Ordini semplici? → NO", "→ ROSSO"],
    },
    {
        id: "s7",
        type: "next-step",
        vignette: "Hai valutato che il paziente NON cammina e NON respira. Hai applicato la pervietà-cannula e ORA respira con 28 atti/min. Qual è il codice finale?",
        correctAnswer: "ROSSO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        hint: "Continua a seguire l'albero dal punto in cui sei.",
        explanation: "Respira dopo cannula (28 < 30 atti/min) → valuta polso... ma in questo scenario il polso non viene specificato. Attenzione: il testo dice solo la frequenza — nella pratica reale dovresti continuare. Ai fini dell'esercizio: frequenza < 30 → devi valutare polso. Se non lo valuti non puoi concludere. Questa è una trappola classica.",
        path: ["Cammina? → NO", "Respira? → NO", "Pervietà-cannula → respira? → SÌ", "< 30 atti/min? → SÌ", "Polso? → da valutare!"],
    },
    {
        id: "s8",
        type: "what-if",
        vignette: "Stesso paziente: non cammina, respira 22/min, polso presente. Cosa cambia se NON esegue ordini semplici rispetto a se LI esegue?",
        correctAnswer: "ROSSO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        explanation: "Se esegue → GIALLO. Se NON esegue → ROSSO. Gli ordini semplici sono l'ultimo discriminante tra giallo e rosso nel ramo 'respira + polso presente'.",
        path: ["... polso presente →", "Ordini semplici? SÌ → GIALLO", "Ordini semplici? NO → ROSSO"],
    },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
}

const COLOR_STYLE: Record<Color, { pill: string; result: string; dot: string }> = {
    VERDE:  { pill: "bg-green-100 text-green-800 border-green-300",  result: "border-green-400 bg-green-50 text-green-800",  dot: "bg-green-500" },
    GIALLO: { pill: "bg-amber-100 text-amber-800 border-amber-300",  result: "border-amber-400 bg-amber-50 text-amber-800",  dot: "bg-amber-400" },
    ROSSO:  { pill: "bg-red-100 text-red-700 border-red-300",        result: "border-red-400 bg-red-50 text-red-700",        dot: "bg-red-500"   },
};

const TYPE_LABEL: Record<ExerciseType, string> = {
    "scenario":  "Scenario",
    "next-step": "Passo successivo",
    "what-if":   "E se...?",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ColorPill({ color }: { color: Color }) {
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-xs font-bold ${COLOR_STYLE[color].pill}`}>
            <span className={`w-2 h-2 rounded-full ${COLOR_STYLE[color].dot}`} />
            {color}
        </span>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function StartProtocolPractice() {
    const [queue] = useState<Scenario[]>(() => shuffle(SCENARIOS));
    const [idx, setIdx] = useState(0);
    const [selected, setSelected] = useState<Color | null>(null);
    const [attempts, setAttempts] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [results, setResults] = useState<{ correct: boolean; scenario: Scenario }[]>([]);
    const [done, setDone] = useState(false);
    const [cardKey, setCardKey] = useState(0);

    const scenario = queue[idx];
    const isAnswered = selected !== null;
    const isCorrect = selected === scenario?.correctAnswer;

    function handleSelect(color: Color) {
        if (isAnswered) return;
        const attempt = attempts + 1;
        setAttempts(attempt);
        setSelected(color);

        if (color !== scenario.correctAnswer && attempt === 1 && scenario.hint) {
            setShowHint(true);
        }
    }

    function handleNext() {
        setResults((r) => [...r, { correct: isCorrect, scenario }]);
        const next = idx + 1;
        if (next >= queue.length) {
            setDone(true);
        } else {
            setIdx(next);
            setSelected(null);
            setAttempts(0);
            setShowHint(false);
            setCardKey((k) => k + 1);
        }
    }

    function restart() {
        setIdx(0);
        setSelected(null);
        setAttempts(0);
        setShowHint(false);
        setResults([]);
        setDone(false);
        setCardKey((k) => k + 1);
    }

    // ── Done screen ───────────────────────────────────────────────────────────
    if (done) {
        const correct = results.filter((r) => r.correct).length;
        const total = results.length;
        const pct = Math.round((correct / total) * 100);

        return (
            <motion.div
                className="flex flex-col gap-6 py-2"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Score */}
                <div className="flex flex-col items-center gap-3">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4
                        ${pct >= 80 ? "border-green-400 bg-green-50" : pct >= 50 ? "border-amber-400 bg-amber-50" : "border-red-400 bg-red-50"}`}>
                        <span className={`text-2xl font-semibold
                            ${pct >= 80 ? "text-green-700" : pct >= 50 ? "text-amber-700" : "text-red-700"}`}>
                            {pct}%
                        </span>
                    </div>
                    <p className="text-red-900 font-semibold text-lg">{correct} su {total} corrette</p>
                    <p className="text-red-400 text-sm text-center">
                        {pct >= 80 ? "Ottima padronanza del protocollo." : pct >= 50 ? "Buon lavoro, ripassare gli step critici." : "Rileggi il protocollo e riprova."}
                    </p>
                </div>

                {/* Per-question recap */}
                <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300 px-1">
                        Riepilogo
                    </p>
                    {results.map((r, i) => (
                        <motion.div
                            key={i}
                            className={`rounded-xl border px-4 py-3 flex flex-col gap-1.5
                                ${r.correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <p className={`text-xs leading-snug flex-1 font-medium ${r.correct ? "text-green-900" : "text-red-900"}`}>
                                    {r.scenario.vignette.length > 90
                                        ? r.scenario.vignette.slice(0, 90) + "…"
                                        : r.scenario.vignette}
                                </p>
                                <span className={`text-xs font-bold shrink-0 ${r.correct ? "text-green-600" : "text-red-500"}`}>
                                    {r.correct ? "✓" : "✗"}
                                </span>
                            </div>
                            {!r.correct && (
                                <p className="text-[11px] text-red-500">
                                    Risposta corretta: <ColorPill color={r.scenario.correctAnswer} />
                                </p>
                            )}
                        </motion.div>
                    ))}
                </div>

                <motion.button
                    onClick={restart}
                    className="w-full bg-red-500 text-white py-2.5 rounded-xl font-semibold text-sm cursor-pointer hover:bg-red-600 transition-colors"
                    whileTap={{ scale: 0.96 }}
                    whileHover={{ scale: 1.01 }}
                >
                    Ricomincia
                </motion.button>
            </motion.div>
        );
    }

    // ── Exercise screen ───────────────────────────────────────────────────────
    return (
        <div className="flex flex-col gap-5 w-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300">
                        Protocollo S.T.A.R.T.
                    </p>
                    <h2 className="text-red-900 font-semibold text-base">Esercitazione</h2>
                </div>
                <span className="text-xs text-red-400 font-medium tabular-nums">
                    {idx + 1} / {queue.length}
                </span>
            </div>

            {/* Progress */}
            <div className="h-1.5 rounded-full bg-red-100 overflow-hidden">
                <motion.div
                    className="h-full bg-red-400 rounded-full"
                    animate={{ width: `${(idx / queue.length) * 100}%` }}
                    transition={{ duration: 0.4 }}
                />
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={cardKey}
                    className="flex flex-col gap-4"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.25 }}
                >
                    {/* Type badge */}
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-red-300">
                            {TYPE_LABEL[scenario.type]}
                        </span>
                    </div>

                    {/* Vignette */}
                    <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-6">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300 mb-2">
                            Paziente
                        </p>
                        <p className="text-red-900 text-base leading-relaxed">
                            {scenario.vignette}
                        </p>
                    </div>

                    {/* Hint */}
                    <AnimatePresence>
                        {showHint && scenario.hint && (
                            <motion.div
                                className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3"
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-400 mb-1">
                                    Suggerimento
                                </p>
                                <p className="text-amber-900 text-sm leading-snug">{scenario.hint}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Answer options */}
                    <div className="flex flex-col gap-2">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300">
                            Codice triage
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            {scenario.options.map((color) => {
                                const isThis = selected === color;
                                const correct = color === scenario.correctAnswer;
                                let style = "bg-white border-red-100 text-red-900 hover:border-red-300 hover:bg-red-50";
                                if (isAnswered) {
                                    if (correct) style = "bg-green-50 border-green-400 text-green-800";
                                    else if (isThis && !correct) style = "bg-red-100 border-red-400 text-red-700 opacity-70";
                                    else style = "bg-white border-red-100 text-red-300 opacity-40";
                                }

                                return (
                                    <motion.button
                                        key={color}
                                        onClick={() => handleSelect(color)}
                                        disabled={isAnswered}
                                        whileTap={isAnswered ? {} : { scale: 0.96 }}
                                        className={`relative border rounded-xl py-3 flex flex-col items-center gap-1.5 transition-colors duration-150 cursor-pointer font-semibold text-sm ${style}`}
                                    >
                                        <span className={`w-3 h-3 rounded-full ${COLOR_STYLE[color].dot}`} />
                                        {color}
                                        {isAnswered && correct && (
                                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">✓</span>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Explanation */}
                    <AnimatePresence>
                        {isAnswered && (
                            <motion.div
                                className="flex flex-col gap-3"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {/* Feedback banner */}
                                <div className={`rounded-xl border px-4 py-3 ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                                    <p className={`text-xs font-semibold mb-1 ${isCorrect ? "text-green-600" : "text-red-500"}`}>
                                        {isCorrect ? "Corretto" : "Non corretto — risposta: " }
                                        {!isCorrect && <ColorPill color={scenario.correctAnswer} />}
                                    </p>
                                    <p className={`text-xs leading-relaxed ${isCorrect ? "text-green-900" : "text-red-900"}`}>
                                        {scenario.explanation}
                                    </p>
                                </div>

                                {/* Path steps */}
                                <div className="flex flex-wrap gap-1.5 px-1">
                                    {scenario.path.map((step, i) => (
                                        <span key={i} className="text-[11px] bg-red-50 border border-red-100 text-red-400 px-2 py-0.5 rounded-lg">
                                            {step}
                                        </span>
                                    ))}
                                </div>

                                <motion.button
                                    onClick={handleNext}
                                    className="w-full bg-red-500 text-white py-2.5 rounded-xl font-semibold text-sm cursor-pointer hover:bg-red-600 transition-colors"
                                    whileTap={{ scale: 0.96 }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.15 }}
                                >
                                    {idx + 1 < queue.length ? "Prossimo →" : "Vedi risultati"}
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
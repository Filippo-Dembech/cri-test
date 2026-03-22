import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import GentleSlide from "../../ui/animations/GentleSlide";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "study" | "practice";
type PracticeMode = "order" | "quiz";

// ─── Data ─────────────────────────────────────────────────────────────────────

const OCCORRENTE = [
    "Guanti monouso",
    "Apparecchio per la rilevazione della glicemia",
    "Strisce reagenti",
    "Lancette pungidito monouso",
    "Garze imbevute di disinfettante",
    "Contenitore per lo smaltimento dei rifiuti taglienti",
];

interface Step {
    id: number;
    text: string;
    detail?: string; // extra info shown in study mode
}

const STEPS: Step[] = [
    { id: 1,  text: "Spiegare la procedura al paziente" },
    { id: 2,  text: "Informare il paziente/parente che il valore sarà trasmesso alla SOREU" },
    { id: 3,  text: "Predisporre il materiale occorrente" },
    { id: 4,  text: "Preparare l'apparecchio" },
    { id: 5,  text: "Inserire la striscia reagente nell'apparecchio nel verso giusto", detail: "L'apparecchio si accenderà automaticamente." },
    { id: 6,  text: "Verificare che appaia il simbolo di una goccia di sangue sul display", detail: "Questo conferma che l'apparecchio è pronto." },
    { id: 7,  text: "Disinfettare il dito su cui misurare la glicemia" },
    { id: 8,  text: "Premere leggermente il dito del paziente" },
    { id: 9,  text: "Prendere la lancetta pungidito e rimuovere il tappo di sicurezza" },
    { id: 10, text: "Applicare una pressione decisa sul polpastrello del paziente", detail: "Meglio se leggermente sul lato del polpastrello." },
    { id: 11, text: "Premere il polpastrello per far uscire la prima goccia di sangue e pulirla" },
    { id: 12, text: "Premere nuovamente il polpastrello per far uscire la seconda goccia di sangue" },
    { id: 13, text: "Appoggiare la striscia reagente sulla goccia di sangue" },
    { id: 14, text: "Aspettare circa 5 secondi e registrare il valore della glicemia" },
    { id: 15, text: "Pulire il paziente e fargli tenere la garza disinfettante premuta sulla ferita" },
    { id: 16, text: "Smaltire la lancetta e la striscia reagente nel contenitore dei taglienti" },
    { id: 17, text: "Comunicare il valore rilevato" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
}

// ─── Study component ──────────────────────────────────────────────────────────

function TecnicaStudy() {
    const [showOccorrente, setShowOccorrente] = useState(true);
    const [expandedStep, setExpandedStep] = useState<number | null>(null);

    return (
        <div className="flex flex-col gap-3">

            {/* Occorrente */}
            <div className="border border-red-100 rounded-2xl overflow-hidden">
                <button
                    onClick={() => setShowOccorrente((v) => !v)}
                    className="w-full flex items-center justify-between px-5 py-4 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                >
                    <span className="text-red-900 font-semibold text-sm">Occorrente</span>
                    <motion.span
                        animate={{ rotate: showOccorrente ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-red-300 text-xs ml-2 shrink-0"
                    >
                        ▼
                    </motion.span>
                </button>
                <AnimatePresence initial={false}>
                    {showOccorrente && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                        >
                            <div className="px-5 py-4 bg-white flex flex-col gap-2">
                                {OCCORRENTE.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-300 shrink-0" />
                                        <span className="text-red-900 text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Steps */}
            <div className="border border-red-100 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 bg-red-50">
                    <span className="text-red-900 font-semibold text-sm">Tecnica — {STEPS.length} passi</span>
                </div>
                <div className="bg-white px-5 py-4 flex flex-col gap-1">
                    {STEPS.map((step) => (
                        <div key={step.id}>
                            <button
                                onClick={() => step.detail && setExpandedStep(expandedStep === step.id ? null : step.id)}
                                className={`w-full flex items-start gap-3 py-2.5 text-left transition-colors rounded-xl px-2 -mx-2
                                    ${step.detail ? "cursor-pointer hover:bg-red-50" : "cursor-default"}`}
                            >
                                <span className="w-5 h-5 rounded-full bg-red-100 text-red-500 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                    {step.id}
                                </span>
                                <span className="text-red-900 text-sm leading-snug flex-1">{step.text}</span>
                                {step.detail && (
                                    <motion.span
                                        animate={{ rotate: expandedStep === step.id ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-red-200 text-[10px] shrink-0 mt-1"
                                    >
                                        ▼
                                    </motion.span>
                                )}
                            </button>
                            <AnimatePresence initial={false}>
                                {step.detail && expandedStep === step.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="text-red-400 text-xs leading-relaxed ml-8 mb-2 pr-2">
                                            {step.detail}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Practice: ordering game ──────────────────────────────────────────────────

function OrderingGame() {
    // Show 6 consecutive steps from a random starting point
    const WINDOW = 6;
    const [startIdx] = useState(() => Math.floor(Math.random() * (STEPS.length - WINDOW)));
    const [slice] = useState(() => STEPS.slice(startIdx, startIdx + WINDOW));
    const [shuffled, setShuffled] = useState<Step[]>(() => shuffle(slice));
    const [placed, setPlaced] = useState<(Step | null)[]>(Array(WINDOW).fill(null));
    const [submitted, setSubmitted] = useState(false);
    const [dragging, setDragging] = useState<Step | null>(null);
    const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);

    const unplaced = shuffled.filter((s) => !placed.some((p) => p?.id === s.id));

    function placeInSlot(slot: number, step: Step) {
        setPlaced((prev) => {
            const next = [...prev];
            // If slot already has a card, return it to pool
            const existing = next[slot];
            if (existing) {
                setShuffled((sh) => sh.includes(existing) ? sh : [...sh, existing]);
            }
            next[slot] = step;
            return next;
        });
        setShuffled((sh) => sh.filter((s) => s.id !== step.id));
    }

    function removeFromSlot(slot: number) {
        const step = placed[slot];
        if (!step) return;
        setPlaced((prev) => { const n = [...prev]; n[slot] = null; return n; });
        setShuffled((sh) => [...sh, step]);
    }

    const allPlaced = placed.every(Boolean);
    const score = submitted ? placed.filter((s, i) => s?.id === slice[i].id).length : 0;

    function reset() {
        const newStart = Math.floor(Math.random() * (STEPS.length - WINDOW));
        const newSlice = STEPS.slice(newStart, newStart + WINDOW);
        const newShuffled = shuffle(newSlice);
        setShuffled(newShuffled);
        setPlaced(Array(WINDOW).fill(null));
        setSubmitted(false);
        setDragging(null);
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300 mb-1">Istruzioni</p>
                <p className="text-red-700 text-xs leading-relaxed">
                    Trascina i passi negli slot nell'ordine corretto. Gli step mostrati sono consecutivi all'interno della procedura.
                </p>
            </div>

            {/* Drop slots */}
            <div className="flex flex-col gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300 px-1">Ordine corretto</p>
                {Array(WINDOW).fill(null).map((_, i) => {
                    const p = placed[i];
                    const isCorrect = submitted && p?.id === slice[i].id;
                    const isWrong = submitted && p && p.id !== slice[i].id;

                    return (
                        <div
                            key={i}
                            onDragOver={(e) => { e.preventDefault(); setDragOverSlot(i); }}
                            onDragLeave={() => setDragOverSlot(null)}
                            onDrop={(e) => {
                                e.preventDefault();
                                if (dragging) placeInSlot(i, dragging);
                                setDragOverSlot(null);
                                setDragging(null);
                            }}
                            className={`flex items-center gap-3 rounded-xl border px-4 py-3 min-h-12 transition-colors
                                ${dragOverSlot === i && !submitted ? "border-red-400 bg-red-50" : ""}
                                ${!p && !dragOverSlot ? "border-dashed border-red-200 bg-white" : ""}
                                ${p && !submitted ? "border-red-200 bg-white" : ""}
                                ${isCorrect ? "border-green-300 bg-green-50" : ""}
                                ${isWrong ? "border-red-300 bg-red-50" : ""}
                            `}
                        >
                            <span className="text-[11px] text-red-300 font-bold w-4 shrink-0">{i + 1}</span>
                            {p ? (
                                <div className="flex items-center justify-between flex-1 gap-2">
                                    <span className={`text-sm leading-snug
                                        ${isCorrect ? "text-green-800" : isWrong ? "text-red-700" : "text-red-900"}`}>
                                        {p.text}
                                    </span>
                                    {!submitted && (
                                        <button
                                            onClick={() => removeFromSlot(i)}
                                            className="text-red-200 hover:text-red-400 text-xs shrink-0 cursor-pointer"
                                        >
                                            ✕
                                        </button>
                                    )}
                                    {submitted && (
                                        <span className={`text-xs font-bold shrink-0 ${isCorrect ? "text-green-600" : "text-red-500"}`}>
                                            {isCorrect ? "✓" : "✗"}
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <span className="text-red-200 text-xs italic">trascina qui un passo</span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Unplaced cards */}
            {unplaced.length > 0 && (
                <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300 px-1">Da posizionare</p>
                    <div className="flex flex-col gap-2">
                        {unplaced.map((step) => (
                            <div
                                key={step.id}
                                draggable
                                onDragStart={() => setDragging(step)}
                                onDragEnd={() => { setDragging(null); setDragOverSlot(null); }}
                                className={`bg-white border border-red-200 rounded-xl px-4 py-3 text-red-900 text-sm leading-snug cursor-grab active:cursor-grabbing select-none transition-opacity
                                    ${dragging?.id === step.id ? "opacity-40" : "opacity-100"}`}
                            >
                                {step.text}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Result after submit */}
            <AnimatePresence>
                {submitted && (
                    <motion.div
                        className={`rounded-xl border px-4 py-3 flex flex-col gap-1
                            ${score === WINDOW ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <p className={`text-xs font-semibold ${score === WINDOW ? "text-green-700" : "text-amber-700"}`}>
                            {score}/{WINDOW} passi nell'ordine corretto
                        </p>
                        {score < WINDOW && (
                            <div className="flex flex-col gap-1 mt-1">
                                {slice.map((s, i) => (
                                    placed[i]?.id !== s.id && (
                                        <p key={s.id} className="text-amber-900 text-xs">
                                            Slot {i + 1}: <span className="font-medium">{s.text}</span>
                                        </p>
                                    )
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Actions */}
            {!submitted ? (
                <motion.button
                    onClick={() => setSubmitted(true)}
                    disabled={!allPlaced}
                    className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-colors
                        ${allPlaced
                            ? "bg-red-500 text-white cursor-pointer hover:bg-red-600"
                            : "bg-red-100 text-red-300 cursor-not-allowed"}`}
                    whileTap={allPlaced ? { scale: 0.96 } : {}}
                >
                    Verifica ordine
                </motion.button>
            ) : (
                <motion.button
                    onClick={reset}
                    className="w-full bg-red-500 text-white py-2.5 rounded-xl font-semibold text-sm cursor-pointer hover:bg-red-600 transition-colors"
                    whileTap={{ scale: 0.96 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    Nuovo esercizio
                </motion.button>
            )}
        </div>
    );
}

// ─── Practice: quiz (what comes next) ────────────────────────────────────────

interface QuizQuestion {
    prompt: Step;
    options: Step[];
    correct: Step;
}

function buildQuestions(): QuizQuestion[] {
    // For each step (except last), ask "what comes next?"
    return shuffle(
        STEPS.slice(0, -1).map((step, i) => {
            const correct = STEPS[i + 1];
            const distractors = shuffle(STEPS.filter((s) => s.id !== correct.id && s.id !== step.id)).slice(0, 2);
            return {
                prompt: step,
                correct,
                options: shuffle([correct, ...distractors]),
            };
        })
    ).slice(0, 10); // 10 questions per session
}

function QuizGame() {
    const [questions] = useState<QuizQuestion[]>(() => buildQuestions());
    const [idx, setIdx] = useState(0);
    const [selected, setSelected] = useState<Step | null>(null);
    const [results, setResults] = useState<boolean[]>([]);
    const [done, setDone] = useState(false);
    const [cardKey, setCardKey] = useState(0);

    const q = questions[idx];
    const isAnswered = selected !== null;
    const isCorrect = selected?.id === q?.correct.id;

    function handleSelect(step: Step) {
        if (isAnswered) return;
        setSelected(step);
    }

    function handleNext() {
        setResults((r) => [...r, isCorrect]);
        const next = idx + 1;
        if (next >= questions.length) {
            setDone(true);
        } else {
            setIdx(next);
            setSelected(null);
            setCardKey((k) => k + 1);
        }
    }

    function restart() {
        setIdx(0);
        setSelected(null);
        setResults([]);
        setDone(false);
        setCardKey((k) => k + 1);
    }

    if (done) {
        const correct = results.filter(Boolean).length;
        const pct = Math.round((correct / results.length) * 100);
        return (
            <motion.div
                className="flex flex-col items-center gap-4 py-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4
                    ${pct >= 80 ? "border-green-400 bg-green-50" : pct >= 50 ? "border-amber-400 bg-amber-50" : "border-red-400 bg-red-50"}`}>
                    <span className={`text-2xl font-semibold
                        ${pct >= 80 ? "text-green-700" : pct >= 50 ? "text-amber-700" : "text-red-700"}`}>
                        {pct}%
                    </span>
                </div>
                <p className="text-red-900 font-semibold text-lg">{correct} su {results.length} corrette</p>
                <p className="text-red-400 text-sm text-center">
                    {pct >= 80 ? "Ottima conoscenza della sequenza." : pct >= 50 ? "Buon lavoro — ripassare i passaggi centrali." : "Studia la tecnica e riprova."}
                </p>
                <motion.button
                    onClick={restart}
                    className="w-full bg-red-500 text-white py-2.5 rounded-xl font-semibold text-sm cursor-pointer hover:bg-red-600 transition-colors"
                    whileTap={{ scale: 0.96 }}
                >
                    Ricomincia
                </motion.button>
            </motion.div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300">Passo successivo</p>
                <span className="text-xs text-red-400 font-medium tabular-nums">{idx + 1}/{questions.length}</span>
            </div>

            <div className="h-1.5 rounded-full bg-red-100 overflow-hidden">
                <motion.div
                    className="h-full bg-red-400 rounded-full"
                    animate={{ width: `${(idx / questions.length) * 100}%` }}
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
                    <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-5">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300 mb-2">Hai appena fatto</p>
                        <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-red-200 text-red-700 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {q.prompt.id}
                            </span>
                            <p className="text-red-900 text-base leading-snug font-medium">{q.prompt.text}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300">Qual è il passo successivo?</p>
                        {q.options.map((opt) => {
                            const isThis = selected?.id === opt.id;
                            const correct = opt.id === q.correct.id;
                            let style = "bg-white border-red-100 text-red-900 hover:border-red-300 hover:bg-red-50";
                            if (isAnswered) {
                                if (correct) style = "bg-green-50 border-green-400 text-green-800";
                                else if (isThis) style = "bg-red-100 border-red-400 text-red-700 opacity-70";
                                else style = "opacity-40 bg-white border-red-100 text-red-300";
                            }
                            return (
                                <motion.button
                                    key={opt.id}
                                    onClick={() => handleSelect(opt)}
                                    disabled={isAnswered}
                                    whileTap={isAnswered ? {} : { scale: 0.98 }}
                                    className={`relative text-left border rounded-xl px-4 py-3 text-sm leading-snug font-medium transition-colors duration-150 cursor-pointer ${style}`}
                                >
                                    {opt.text}
                                    {isAnswered && correct && (
                                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">✓</span>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>

                    <AnimatePresence>
                        {isAnswered && (
                            <motion.div
                                className="flex flex-col gap-3"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className={`rounded-xl border px-4 py-3 ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                                    <p className={`text-xs font-semibold ${isCorrect ? "text-green-700" : "text-red-500"}`}>
                                        {isCorrect ? "Corretto" : `Il passo corretto era: "${q.correct.text}"`}
                                    </p>
                                    {q.correct.detail && (
                                        <p className="text-xs text-red-400 mt-1 leading-relaxed">{q.correct.detail}</p>
                                    )}
                                </div>
                                <motion.button
                                    onClick={handleNext}
                                    className="w-full bg-red-500 text-white py-2.5 rounded-xl font-semibold text-sm cursor-pointer hover:bg-red-600 transition-colors"
                                    whileTap={{ scale: 0.96 }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.15 }}
                                >
                                    {idx + 1 < questions.length ? "Prossimo →" : "Vedi risultati"}
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

// ─── Practice wrapper ─────────────────────────────────────────────────────────

function TecnicaPractice() {
    const [mode, setMode] = useState<PracticeMode | null>(null);
    const [modeKey, setModeKey] = useState(0);

    function selectMode(m: PracticeMode) {
        setMode(m);
        setModeKey((k) => k + 1);
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Mode picker */}
            <div className="flex gap-2 p-1 bg-red-50 border border-red-100 rounded-2xl">
                {([
                    { id: "quiz" as PracticeMode,  label: "Passo successivo", description: "Cosa viene dopo?" },
                    { id: "order" as PracticeMode, label: "Ordina i passi",   description: "Trascina e posiziona" },
                ] as const).map((m) => (
                    <button
                        key={m.id}
                        onClick={() => selectMode(m.id)}
                        className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
                            ${mode === m.id
                                ? "bg-white border border-red-200 text-red-600 shadow-sm"
                                : "text-red-300 hover:text-red-400"}`}
                    >
                        {m.label}
                        <span className={`text-[10px] font-normal leading-tight text-center transition-colors
                            ${mode === m.id ? "text-red-400" : "text-red-200"}`}>
                            {m.description}
                        </span>
                    </button>
                ))}
            </div>

            {/* Selected exercise */}
            <AnimatePresence mode="wait">
                {mode ? (
                    <GentleSlide key={modeKey} from="top">
                        {mode === "quiz"  && <QuizGame />}
                        {mode === "order" && <OrderingGame />}
                    </GentleSlide>
                ) : (
                    <motion.div
                        className="text-center py-10 text-red-300 text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        Scegli un tipo di esercizio qui sopra
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function TechniquePractice() {
    const [tab, setTab] = useState<Tab>("study");
    const [tabKey, setTabKey] = useState(0);

    function switchTab(next: Tab) {
        if (next === tab) return;
        setTab(next);
        setTabKey((k) => k + 1);
    }

    const TABS: { id: Tab; label: string; description: string }[] = [
        { id: "study",    label: "Studia",  description: "Occorrente e sequenza completa" },
        { id: "practice", label: "Pratica", description: "Esercitati sulla tecnica" },
    ];

    return (
        <div className="flex flex-col gap-5 w-full">
            <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300">MSB</p>
                <h1 className="text-red-900 font-semibold text-lg">Tecnica di rilevazione glicemia</h1>
            </div>

            <div className="flex gap-2 p-1 bg-red-50 border border-red-100 rounded-2xl">
                {TABS.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => switchTab(t.id)}
                        className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
                            ${tab === t.id
                                ? "bg-white border border-red-200 text-red-600 shadow-sm"
                                : "text-red-300 hover:text-red-400"}`}
                    >
                        {t.label}
                        <span className={`text-[10px] font-normal leading-tight text-center transition-colors
                            ${tab === t.id ? "text-red-400" : "text-red-200"}`}>
                            {t.description}
                        </span>
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <GentleSlide key={tabKey} from="top">
                    {tab === "study"    && <TecnicaStudy />}
                    {tab === "practice" && <TecnicaPractice />}
                </GentleSlide>
            </AnimatePresence>
        </div>
    );
}
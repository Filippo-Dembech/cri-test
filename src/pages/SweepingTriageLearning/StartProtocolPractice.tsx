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
    // ── Ramo VERDE ────────────────────────────────────────────────────────────
    {
        id: "s-verde-1",
        type: "scenario",
        vignette: "Il paziente è cosciente e cammina verso di te chiedendo aiuto.",
        correctAnswer: "ROSSO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        explanation: "Cammina → VERDE. Il paziente deambulante viene classificato immediatamente senza ulteriori valutazioni.",
        path: ["Cammina? → SÌ", "→ VERDE"],
    },
    {
        id: "s-verde-2",
        type: "scenario",
        vignette: "Una donna urla il nome del marito e si avvicina di corsa alla scena dell'incidente.",
        correctAnswer: "VERDE",
        options: ["VERDE", "GIALLO", "ROSSO"],
        explanation: "Cammina autonomamente → VERDE, indipendentemente dallo stato emotivo.",
        path: ["Cammina? → SÌ", "→ VERDE"],
    },
    {
        id: "s-verde-3",
        type: "scenario",
        vignette: "Un uomo con una ferita lacera alla mano si avvicina zoppicando ma in modo autonomo.",
        correctAnswer: "VERDE",
        options: ["VERDE", "GIALLO", "ROSSO"],
        explanation: "Cammina, anche se con difficoltà → VERDE. Il criterio è la deambulazione autonoma, non la qualità dell'andatura.",
        path: ["Cammina? → SÌ", "→ VERDE"],
    },

    // ── Ramo ROSSO: non respira, cannula fallisce ─────────────────────────────
    {
        id: "s-rosso-cannula-1",
        type: "scenario",
        vignette: "Il paziente è a terra, non cammina e non respira. Dopo pervietà-cannula non inizia a respirare.",
        correctAnswer: "ROSSO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        explanation: "Non respira → pervietà-cannula → ancora non respira → ROSSO.",
        path: ["Cammina? → NO", "Respira? → NO", "Pervietà-cannula → respira? → NO", "→ ROSSO"],
    },
    {
        id: "s-rosso-cannula-2",
        type: "scenario",
        vignette: "Paziente incosciente, apnea. Inserita la cannula: nessun movimento respiratorio apprezzabile dopo 10 secondi.",
        correctAnswer: "ROSSO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        explanation: "Cannula senza ripresa respiratoria → ROSSO immediato.",
        path: ["Cammina? → NO", "Respira? → NO", "Pervietà-cannula → respira? → NO", "→ ROSSO"],
    },

    // ── Ramo ROSSO: non respira, cannula funziona ma freq > 30 ───────────────
    {
        id: "s-rosso-freq-alta-1",
        type: "scenario",
        vignette: "Paziente supino, non cammina. Dopo pervietà-cannula riprende a respirare con frequenza di 34 atti/min.",
        correctAnswer: "ROSSO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        explanation: "Respira dopo cannula ma > 30 atti/min → ROSSO.",
        path: ["Cammina? → NO", "Respira? → NO", "Pervietà-cannula → respira? → SÌ", "> 30 atti/min? → SÌ", "→ ROSSO"],
    },

    // ── Ramo ROSSO: respira spontaneamente ma freq > 30 ──────────────────────
    {
        id: "s-rosso-freq-alta-2",
        type: "scenario",
        vignette: "Il paziente non cammina, respira spontaneamente con frequenza di 36 atti/min.",
        correctAnswer: "ROSSO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        explanation: "Respira ma > 30 atti/min → ROSSO. L'alta frequenza è già sufficiente.",
        path: ["Cammina? → NO", "Respira? → SÌ", "< 30 atti/min? → NO", "→ ROSSO"],
    },
    {
        id: "s-rosso-freq-alta-3",
        type: "scenario",
        vignette: "Donna a terra, non si alza. Respira in modo affannoso e superficiale: conti 32 atti in un minuto.",
        correctAnswer: "ROSSO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        explanation: "32 atti/min > 30 → ROSSO senza proseguire la valutazione.",
        path: ["Cammina? → NO", "Respira? → SÌ", "< 30 atti/min? → NO", "→ ROSSO"],
    },
    {
        id: "s-rosso-freq-alta-4",
        type: "scenario",
        vignette: "Paziente agitato, non si rialza. La respirazione è rapida: stimi circa 40 atti/min.",
        correctAnswer: "ROSSO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        explanation: "~40 atti/min → nettamente > 30 → ROSSO.",
        path: ["Cammina? → NO", "Respira? → SÌ", "< 30 atti/min? → NO", "→ ROSSO"],
    },

    // ── Ramo ROSSO: freq ok, polso assente ───────────────────────────────────
    {
        id: "s-rosso-polso-1",
        type: "scenario",
        vignette: "Il paziente non cammina. Respira a 22 atti/min. Non riesci ad apprezzare il polso radiale.",
        correctAnswer: "ROSSO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        explanation: "Frequenza ok → polso assente → ROSSO.",
        path: ["Cammina? → NO", "Respira? → SÌ", "< 30 atti/min? → SÌ", "Polso radiale? → NO", "→ ROSSO"],
    },
    {
        id: "s-rosso-polso-2",
        type: "scenario",
        vignette: "Paziente in posizione laterale, non si muove. FR 18/min. Al polso radiale non percepisci alcun battito dopo 5 secondi di ricerca.",
        correctAnswer: "ROSSO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        explanation: "Polso radiale assente → ROSSO, indipendentemente dalla frequenza respiratoria.",
        path: ["Cammina? → NO", "Respira? → SÌ", "< 30 atti/min? → SÌ", "Polso radiale? → NO", "→ ROSSO"],
    },
    {
        id: "s-rosso-polso-3",
        type: "scenario",
        vignette: "Non cammina, FR 25/min, polso radiale assente. Presenta un'emorragia evidente alla coscia.",
        correctAnswer: "ROSSO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        explanation: "Polso assente → ROSSO. L'emorragia non modifica il codice in questa fase — il polso assente chiude il ramo.",
        path: ["Cammina? → NO", "Respira? → SÌ", "< 30 atti/min? → SÌ", "Polso radiale? → NO", "→ ROSSO"],
    },

    // ── Ramo ROSSO: tutto ok ma non esegue ordini ─────────────────────────────
    {
        id: "s-rosso-ordini-1",
        type: "scenario",
        vignette: "Non cammina. FR 20/min. Polso radiale presente. Quando dici 'stringimi la mano' non c'è risposta.",
        correctAnswer: "ROSSO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        explanation: "Ordini semplici non eseguiti → ROSSO.",
        path: ["Cammina? → NO", "Respira? → SÌ", "< 30 atti/min? → SÌ", "Polso radiale? → SÌ", "Ordini semplici? → NO", "→ ROSSO"],
    },
    {
        id: "s-rosso-ordini-2",
        type: "scenario",
        vignette: "Paziente a terra, paramteri respiratori e circolatori nella norma. Gli chiedi di aprire gli occhi: nessuna risposta.",
        correctAnswer: "ROSSO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        explanation: "Apertura occhi su comando = ordine semplice. Non eseguito → ROSSO.",
        path: ["Cammina? → NO", "Respira? → SÌ", "< 30 atti/min? → SÌ", "Polso radiale? → SÌ", "Ordini semplici? → NO", "→ ROSSO"],
    },
    {
        id: "s-rosso-ordini-3",
        type: "scenario",
        vignette: "FR 16/min, polso radiale valido. Il paziente geme ma non risponde ad alcun comando verbale.",
        correctAnswer: "ROSSO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        explanation: "Gemito non equivale a eseguire ordini. Ordini non eseguiti → ROSSO.",
        path: ["Cammina? → NO", "Respira? → SÌ", "< 30 atti/min? → SÌ", "Polso radiale? → SÌ", "Ordini semplici? → NO", "→ ROSSO"],
    },

    // ── Ramo GIALLO ───────────────────────────────────────────────────────────
    {
        id: "s-giallo-1",
        type: "scenario",
        vignette: "Non cammina. FR 22/min. Polso radiale presente. Stringe la mano al comando.",
        correctAnswer: "GIALLO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        explanation: "Tutti i parametri nella norma, esegue ordini → GIALLO.",
        path: ["Cammina? → NO", "Respira? → SÌ", "< 30 atti/min? → SÌ", "Polso radiale? → SÌ", "Ordini semplici? → SÌ", "→ GIALLO"],
    },
    {
        id: "s-giallo-2",
        type: "scenario",
        vignette: "Paziente seduto a terra, non si alza. FR 17/min, polso radiale ritmico. Apre gli occhi e indica la gamba dolente su richiesta.",
        correctAnswer: "GIALLO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        explanation: "Esegue ordini semplici (indica su richiesta) → GIALLO.",
        path: ["Cammina? → NO", "Respira? → SÌ", "< 30 atti/min? → SÌ", "Polso radiale? → SÌ", "Ordini semplici? → SÌ", "→ GIALLO"],
    },
    {
        id: "s-giallo-3",
        type: "scenario",
        vignette: "Donna con probabile frattura alla gamba, non deambula. Respira tranquillamente a 14/min. Polso radiale presente, risponde a domande semplici.",
        correctAnswer: "GIALLO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        explanation: "Risponde a domande = esegue ordini semplici → GIALLO.",
        path: ["Cammina? → NO", "Respira? → SÌ", "< 30 atti/min? → SÌ", "Polso radiale? → SÌ", "Ordini semplici? → SÌ", "→ GIALLO"],
    },
    {
        id: "s-giallo-4",
        type: "scenario",
        vignette: "Non cammina per dolore. FR 28/min. Polso radiale apprezzabile. Risponde correttamente a 'come ti chiami?'.",
        correctAnswer: "GIALLO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        explanation: "FR 28 < 30, polso presente, esegue ordini → GIALLO. Attenzione: 28 è sotto la soglia.",
        path: ["Cammina? → NO", "Respira? → SÌ", "< 30 atti/min? → SÌ", "Polso radiale? → SÌ", "Ordini semplici? → SÌ", "→ GIALLO"],
    },
    {
        id: "s-giallo-5",
        type: "scenario",
        vignette: "Paziente con trauma alla spalla, non si rialza. FR 24/min, polso radiale valido. Alla richiesta di chiudere gli occhi, li chiude.",
        correctAnswer: "GIALLO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        explanation: "Chiudere gli occhi su comando = ordine semplice eseguito → GIALLO.",
        path: ["Cammina? → NO", "Respira? → SÌ", "< 30 atti/min? → SÌ", "Polso radiale? → SÌ", "Ordini semplici? → SÌ", "→ GIALLO"],
    },

    // ── Trappole e casi limite ────────────────────────────────────────────────
    {
        id: "s-trap-1",
        type: "what-if",
        vignette: "Paziente con FR 30 atti/min esatti. Lo classifichi come < 30 o > 30?",
        correctAnswer: "ROSSO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        hint: "Il protocollo usa '< 30' come soglia. 30 non è minore di 30.",
        explanation: "FR = 30 non è < 30, quindi si considera > 30 → ROSSO. Il limite è stretto: solo valori sotto 30 passano al ramo successivo.",
        path: ["FR 30 = non < 30", "→ ramo > 30 atti/min", "→ ROSSO"],
    },
    {
        id: "s-trap-2",
        type: "what-if",
        vignette: "Il paziente non cammina ma striscia verso di te usando le braccia. Lo consideri 'deambulante'?",
        correctAnswer: "ROSSO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        hint: "Il criterio 'cammina' nel protocollo S.T.A.R.T. significa deambulazione bipede autonoma.",
        explanation: "Strisciare non equivale a camminare. Il paziente non supera il primo step → continua la valutazione dal secondo nodo.",
        path: ["Cammina? → NO (striscia ≠ cammina)", "→ continua valutazione"],
    },
    {
        id: "s-trap-3",
        type: "what-if",
        vignette: "Paziente che non cammina, non respira. Dopo pervietà-cannula inizia a respirare con FR 29/min e polso radiale presente. Esegue ordini. Qual è il codice?",
        correctAnswer: "GIALLO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        hint: "La cannula ha funzionato: ora valuta il percorso come se respirasse spontaneamente.",
        explanation: "Respira dopo cannula → FR 29 < 30 → polso presente → ordini eseguiti → GIALLO. La cannula reimmette il paziente nel ramo 'respira' e la valutazione continua normalmente.",
        path: ["Cammina? → NO", "Respira? → NO", "Pervietà-cannula → SÌ", "FR 29 < 30 → SÌ", "Polso? → SÌ", "Ordini? → SÌ", "→ GIALLO"],
    },
    {
        id: "s-trap-4",
        type: "next-step",
        vignette: "Sei al nodo 'polso radiale'. Il paziente ha una FR di 26/min. Non riesci a sentire il polso radiale ma senti quello carotideo. Cosa fai?",
        correctAnswer: "ROSSO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        hint: "Il protocollo S.T.A.R.T. specifica il polso radiale, non quello carotideo.",
        explanation: "Il polso carotideo presente non sostituisce il radiale nel protocollo. Il polso radiale è assente → ROSSO. Il polso radiale assente con carotideo presente indica ipotensione severa.",
        path: ["Polso radiale? → NO (carotideo non conta)", "→ ROSSO"],
    },
    {
        id: "s-trap-5",
        type: "scenario",
        vignette: "Paziente inconscio con respiro agonico (gasping). Lo classifichi come 'respira'?",
        correctAnswer: "ROSSO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        hint: "Il gasping non è respirazione efficace.",
        explanation: "Il gasping non è respiro efficace → il paziente non 'respira' nel senso del protocollo → pervietà-cannula. Se dopo la cannula non riprende un respiro efficace → ROSSO.",
        path: ["Cammina? → NO", "Respira? → NO (gasping ≠ respiro)", "Pervietà-cannula →", "se non respira → ROSSO"],
    },
    {
        id: "s-trap-6",
        type: "scenario",
        vignette: "Paziente con trauma cranico, non cammina. FR 20/min, polso radiale presente. Risponde alle domande in modo confuso e sconnesso.",
        correctAnswer: "GIALLO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        hint: "Gli 'ordini semplici' non richiedono risposte coerenti, solo un'azione motoria o verbale in risposta al comando.",
        explanation: "Rispondere, anche in modo confuso, dimostra che recepisce il comando → ordini semplici eseguiti → GIALLO. La confusione non sposta il codice nel protocollo S.T.A.R.T.",
        path: ["Cammina? → NO", "Respira? → SÌ", "< 30? → SÌ", "Polso? → SÌ", "Ordini? → SÌ (risponde)", "→ GIALLO"],
    },
    {
        id: "s-trap-7",
        type: "next-step",
        vignette: "Hai già valutato: non cammina, respira, FR 18/min, polso presente. Controlli le emorragie evidenti e fai bendaggio. Qual è il prossimo step del protocollo?",
        correctAnswer: "GIALLO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        explanation: "Il controllo emorragie è l'azione da eseguire prima di valutare gli ordini semplici nel ramo 'polso presente'. Il passo successivo è: esegue ordini semplici? Il codice finale dipenderà da questa risposta.",
        path: ["... polso presente →", "Controllare emorragie (azione)", "→ Ordini semplici?", "SÌ → GIALLO / NO → ROSSO"],
    },

    // ── Scenari multivariabili ─────────────────────────────────────────────────
    {
        id: "s-multi-1",
        type: "scenario",
        vignette: "Incidente stradale. Uomo sul sedile, non riesce ad alzarsi. FR 12/min, polso radiale debole ma presente. Stringe la mano al comando.",
        correctAnswer: "GIALLO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        explanation: "FR 12 < 30, polso presente (anche se debole), ordini eseguiti → GIALLO. La qualità del polso non è un criterio S.T.A.R.T.",
        path: ["Cammina? → NO", "Respira? → SÌ", "< 30? → SÌ", "Polso radiale? → SÌ", "Ordini? → SÌ", "→ GIALLO"],
    },
    {
        id: "s-multi-2",
        type: "scenario",
        vignette: "Crollo strutturale. Paziente parzialmente sotto le macerie, non può muoversi. Respira a 10/min, polso radiale assente.",
        correctAnswer: "ROSSO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        explanation: "FR < 30 ma polso radiale assente → ROSSO.",
        path: ["Cammina? → NO", "Respira? → SÌ", "< 30? → SÌ", "Polso radiale? → NO", "→ ROSSO"],
    },
    {
        id: "s-multi-3",
        type: "scenario",
        vignette: "Donna distesa, non risponde ai richiami. Non cammina. FR 8/min molto lenta. Polso radiale presente. Non reagisce agli stimoli verbali.",
        correctAnswer: "ROSSO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        explanation: "FR 8 < 30, polso presente, ma non esegue ordini → ROSSO.",
        path: ["Cammina? → NO", "Respira? → SÌ", "< 30? → SÌ", "Polso? → SÌ", "Ordini? → NO", "→ ROSSO"],
    },
    {
        id: "s-multi-4",
        type: "scenario",
        vignette: "Bambino di circa 8 anni seduto per terra, piange forte, si regge il braccio. Non vuole alzarsi ma potrebbe farlo.",
        correctAnswer: "VERDE",
        options: ["VERDE", "GIALLO", "ROSSO"],
        hint: "Può camminare, anche se non vuole?",
        explanation: "Il criterio è la capacità di deambulare, non la volontà. Se il bambino è in grado di camminare (e piange = respira, è cosciente) → VERDE.",
        path: ["Cammina? → SÌ (capacità presente)", "→ VERDE"],
    },
    {
        id: "s-multi-5",
        type: "scenario",
        vignette: "Paziente con trauma toracico, non cammina. La respirazione è rapida e superficiale: stimi 33 atti/min. Forte dolore al petto.",
        correctAnswer: "ROSSO",
        options: ["VERDE", "GIALLO", "ROSSO"],
        explanation: "FR 33 > 30 → ROSSO. Il dolore e il trauma toracico confermano la gravità ma non cambiano il flusso decisionale.",
        path: ["Cammina? → NO", "Respira? → SÌ", "< 30? → NO", "→ ROSSO"],
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
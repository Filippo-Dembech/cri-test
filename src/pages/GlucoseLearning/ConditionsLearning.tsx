import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import GentleSlide from "../../ui/animations/GentleSlide";

// ─── Types ────────────────────────────────────────────────────────────────────

type Decision = "autonoma" | "soreu";
type ExerciseType = "scenario" | "what-if" | "parametri";

interface Scenario {
    id: string;
    type: ExerciseType;
    vignette: string;
    hint?: string;
    correctAnswer: Decision;
    explanation: string;
    path: string[];
}

type Tab = "study" | "practice";

// ─── Theory data ──────────────────────────────────────────────────────────────

const RANGE_PARAMS = [
    { label: "FR",  range: "10 < FR < 30",    unit: "atti/min" },
    { label: "SpO₂", range: "SpO₂ > 94",      unit: "%" },
    { label: "FC",  range: "60 < FC < 100",    unit: "bpm" },
    { label: "PAS", range: "90 < PAS < 150",   unit: "mmHg" },
];

const SPECIAL_CASES = [
    {
        title: "Parametri non rilevabili",
        description: "In caso di convulsioni, agitazione psicomotoria o altre difficoltà nella rilevazione: manovre di emergenza (ove possibile) + contatto immediato SOREU.",
        color: "amber",
    },
    {
        title: "Glicemia già rilevata da familiare/caregiver",
        description: "Sia tramite puntura capillare sia tramite dispositivo di rilevazione continua: contattare SOREU, comunicare il valore riferito e attenersi alle disposizioni.",
        color: "blue",
    },
    {
        title: "Rifiuto della prestazione",
        description: "Contattare SOREU e attenersi alle disposizioni.",
        color: "red",
    },
    {
        title: "Paziente minore senza genitore",
        description: "Se non è disponibile un genitore o esercente la responsabilità genitoriale: contattare SOREU e attenersi alle disposizioni.",
        color: "red",
    },
];

// ─── Scenarios ────────────────────────────────────────────────────────────────

const SCENARIOS: Scenario[] = [
    // ── Rilevazione autonoma ──────────────────────────────────────────────────
    {
        id: "g-auto-1",
        type: "scenario",
        vignette: "Donna 65 anni, confusa e disorientata (V nella AVPU). CPSS positiva per deviazione della rima labiale. FR 16/min, SpO₂ 97%, FC 78 bpm, PAS 120 mmHg.",
        correctAnswer: "autonoma",
        explanation: "Coscienza alterata (V) + CPSS positiva + tutti i parametri nei range → rilevazione autonoma.",
        path: ["Coscienza alterata? → SÌ (V)", "CPSS positiva? → SÌ", "FR 16 ✓ SpO₂ 97% ✓ FC 78 ✓ PAS 120 ✓", "→ Rilevazione autonoma"],
    },
    {
        id: "g-auto-2",
        type: "scenario",
        vignette: "Uomo 72 anni, risponde solo al dolore (P nella AVPU). CPSS positiva per difficoltà nell'articolare le parole. FR 22/min, SpO₂ 96%, FC 88 bpm, PAS 130 mmHg.",
        correctAnswer: "autonoma",
        explanation: "Coscienza alterata (P) + CPSS positiva + parametri tutti nei range → rilevazione autonoma.",
        path: ["Coscienza alterata? → SÌ (P)", "CPSS positiva? → SÌ", "FR 22 ✓ SpO₂ 96% ✓ FC 88 ✓ PAS 130 ✓", "→ Rilevazione autonoma"],
    },
    {
        id: "g-auto-3",
        type: "scenario",
        vignette: "Paziente incosciente (U nella AVPU). CPSS positiva per emiparesi destra. FR 14/min, SpO₂ 95%, FC 65 bpm, PAS 95 mmHg.",
        correctAnswer: "autonoma",
        explanation: "U nella AVPU + CPSS positiva + tutti i parametri nei range (anche se borderline) → autonoma.",
        path: ["Coscienza alterata? → SÌ (U)", "CPSS positiva? → SÌ", "FR 14 ✓ SpO₂ 95% ✓ FC 65 ✓ PAS 95 ✓", "→ Rilevazione autonoma"],
    },
    {
        id: "g-auto-4",
        type: "scenario",
        vignette: "Donna 58 anni, confusa (V nella AVPU). CPSS positiva per braccio cadente. FR 18/min, SpO₂ 98%, FC 92 bpm, PAS 145 mmHg.",
        correctAnswer: "autonoma",
        explanation: "PAS 145 è sotto 150 → rientra nel range. Tutti i parametri ok → autonoma.",
        path: ["Coscienza alterata? → SÌ (V)", "CPSS positiva? → SÌ", "FR 18 ✓ SpO₂ 98% ✓ FC 92 ✓ PAS 145 ✓", "→ Rilevazione autonoma"],
    },

    // ── Contattare SOREU: parametri fuori range ───────────────────────────────
    {
        id: "g-soreu-fr-alta",
        type: "scenario",
        vignette: "Uomo 80 anni, risponde solo agli stimoli vocali (V nella AVPU). CPSS positiva per deviazione labiale. FR 32/min, SpO₂ 96%, FC 80 bpm, PAS 110 mmHg.",
        correctAnswer: "soreu",
        explanation: "FR 32 > 30 → parametro fuori range. Nonostante CPSS positiva e coscienza alterata, si contatta la SOREU.",
        path: ["Coscienza alterata? → SÌ", "CPSS positiva? → SÌ", "FR 32 ✗ (> 30)", "→ Manovre emergenza + SOREU"],
    },
    {
        id: "g-soreu-fr-bassa",
        type: "scenario",
        vignette: "Paziente incosciente (U). CPSS positiva. FR 8/min, SpO₂ 95%, FC 70 bpm, PAS 100 mmHg.",
        correctAnswer: "soreu",
        explanation: "FR 8 < 10 → fuori range inferiore. Contattare SOREU.",
        path: ["Coscienza alterata? → SÌ (U)", "CPSS positiva? → SÌ", "FR 8 ✗ (< 10)", "→ Manovre emergenza + SOREU"],
    },
    {
        id: "g-soreu-spo2",
        type: "scenario",
        vignette: "Donna 67 anni, confusa (V). CPSS positiva per difficoltà a parlare. FR 20/min, SpO₂ 93%, FC 85 bpm, PAS 125 mmHg.",
        correctAnswer: "soreu",
        explanation: "SpO₂ 93% ≤ 94% → fuori range. Contattare SOREU.",
        path: ["Coscienza alterata? → SÌ (V)", "CPSS positiva? → SÌ", "SpO₂ 93% ✗ (≤ 94%)", "→ Manovre emergenza + SOREU"],
    },
    {
        id: "g-soreu-fc-alta",
        type: "scenario",
        vignette: "Uomo 55 anni, risponde solo alla voce (V). CPSS positiva. FR 18/min, SpO₂ 96%, FC 115 bpm, PAS 130 mmHg.",
        correctAnswer: "soreu",
        explanation: "FC 115 > 100 → fuori range. Contattare SOREU.",
        path: ["Coscienza alterata? → SÌ (V)", "CPSS positiva? → SÌ", "FC 115 ✗ (> 100)", "→ Manovre emergenza + SOREU"],
    },
    {
        id: "g-soreu-fc-bassa",
        type: "scenario",
        vignette: "Donna 78 anni, confusa (V). CPSS positiva per emiparesi. FR 15/min, SpO₂ 97%, FC 48 bpm, PAS 110 mmHg.",
        correctAnswer: "soreu",
        explanation: "FC 48 < 60 → fuori range. Contattare SOREU.",
        path: ["Coscienza alterata? → SÌ (V)", "CPSS positiva? → SÌ", "FC 48 ✗ (< 60)", "→ Manovre emergenza + SOREU"],
    },
    {
        id: "g-soreu-pas-alta",
        type: "scenario",
        vignette: "Uomo 69 anni, risponde solo al dolore (P). CPSS positiva per deviazione labiale. FR 16/min, SpO₂ 96%, FC 90 bpm, PAS 160 mmHg.",
        correctAnswer: "soreu",
        explanation: "PAS 160 > 150 → fuori range. Contattare SOREU.",
        path: ["Coscienza alterata? → SÌ (P)", "CPSS positiva? → SÌ", "PAS 160 ✗ (> 150)", "→ Manovre emergenza + SOREU"],
    },
    {
        id: "g-soreu-pas-bassa",
        type: "scenario",
        vignette: "Donna 82 anni, incosciente (U). CPSS positiva. FR 20/min, SpO₂ 95%, FC 72 bpm, PAS 80 mmHg.",
        correctAnswer: "soreu",
        explanation: "PAS 80 < 90 → fuori range. Contattare SOREU.",
        path: ["Coscienza alterata? → SÌ (U)", "CPSS positiva? → SÌ", "PAS 80 ✗ (< 90)", "→ Manovre emergenza + SOREU"],
    },
    {
        id: "g-soreu-multi",
        type: "scenario",
        vignette: "Uomo 74 anni, confuso (V). CPSS positiva. FR 14/min, SpO₂ 91%, FC 110 bpm, PAS 155 mmHg.",
        correctAnswer: "soreu",
        explanation: "Tre parametri fuori range (SpO₂, FC, PAS). Basta uno solo per contattare la SOREU.",
        path: ["Coscienza alterata? → SÌ (V)", "CPSS positiva? → SÌ", "SpO₂ 91% ✗  FC 110 ✗  PAS 155 ✗", "→ Manovre emergenza + SOREU"],
    },

    // ── Contattare SOREU: condizioni speciali ─────────────────────────────────
    {
        id: "g-soreu-minore",
        type: "scenario",
        vignette: "Bambino di 10 anni, confuso (V). CPSS positiva. Tutti i parametri nei range. La madre è presente ma è straniera e non capisce italiano. Nessun altro adulo con responsabilità genitoriale è disponibile.",
        correctAnswer: "soreu",
        hint: "Chi può dare il consenso alla prestazione?",
        explanation: "Paziente minore senza un esercente della responsabilità genitoriale disponibile a dare consenso → contattare SOREU indipendentemente dai parametri.",
        path: ["Paziente minore?→ SÌ", "Genitore disponibile? → NO", "→ Contattare SOREU"],
    },
    {
        id: "g-soreu-rifiuto",
        type: "scenario",
        vignette: "Uomo 45 anni, confuso (V). CPSS positiva, parametri nei range. Quando ti avvicini con il glucometro, rifiuta la prestazione e allontana la mano.",
        correctAnswer: "soreu",
        explanation: "Rifiuto della prestazione → contattare SOREU indipendentemente dal quadro clinico.",
        path: ["Rifiuto della prestazione? → SÌ", "→ Contattare SOREU"],
    },
    {
        id: "g-soreu-caregiver",
        type: "scenario",
        vignette: "Donna 70 anni, confusa. Il marito riferisce che ha già misurato la glicemia con il glucometro di casa 10 minuti fa: 42 mg/dL. Parametri nei range.",
        correctAnswer: "soreu",
        explanation: "Glicemia già rilevata da familiare/caregiver → contattare SOREU, comunicare il valore riferito (42 mg/dL) e attenersi alle disposizioni.",
        path: ["Glicemia già rilevata da caregiver? → SÌ", "→ Contattare SOREU con valore riferito"],
    },
    {
        id: "g-soreu-cgm",
        type: "scenario",
        vignette: "Uomo 55 anni con diabete tipo 1, confuso (V). CPSS positiva. La moglie mostra il sensore CGM sul braccio: glicemia 38 mg/dL. Parametri nei range.",
        correctAnswer: "soreu",
        explanation: "Il valore CGM è rilevato da un dispositivo del paziente/caregiver, non dall'équipe. → Contattare SOREU con il valore e attenersi alle indicazioni.",
        path: ["Glicemia rilevata da dispositivo continuo (CGM)? → SÌ", "→ Contattare SOREU con valore riferito"],
    },
    {
        id: "g-soreu-convulsioni",
        type: "scenario",
        vignette: "Donna 60 anni trovata in crisi convulsiva. Non è possibile rilevare i parametri vitali in modo affidabile per l'agitazione. CPSS non valutabile.",
        correctAnswer: "soreu",
        explanation: "Impossibilità di rilevare i parametri vitali → manovre di emergenza ove possibile + contatto immediato SOREU.",
        path: ["Parametri rilevabili? → NO (convulsioni)", "→ Manovre emergenza + contatto immediato SOREU"],
    },

    // ── Trappole e casi limite ────────────────────────────────────────────────
    {
        id: "g-trap-avpu-a",
        type: "what-if",
        vignette: "Paziente vigile e orientato (A nella AVPU). CPSS negativa. Parametri nei range. L'équipe deve rilevare la glicemia autonomamente?",
        correctAnswer: "soreu",
        hint: "Rileggi le condizioni necessarie per la rilevazione autonoma.",
        explanation: "Per la rilevazione autonoma servono ENTRAMBE le condizioni: alterazione della coscienza (VPU) E CPSS positiva. Il paziente A è cosciente → nessuna delle due condizioni è presente → non si rileva la glicemia autonomamente. In questo caso non si contatta nemmeno la SOREU per la glicemia: la situazione non rientra nel protocollo.",
        path: ["Coscienza alterata? → NO (A)", "CPSS positiva? → NO", "→ Protocollo glicemia non applicabile"],
    },
    {
        id: "g-trap-solo-cpss",
        type: "what-if",
        vignette: "Paziente vigile (A nella AVPU) ma con CPSS positiva per deviazione della rima labiale. FR 18, SpO₂ 96%, FC 80, PAS 120. Si rileva la glicemia autonomamente?",
        correctAnswer: "soreu",
        hint: "Una sola delle due condizioni è sufficiente?",
        explanation: "Servono ENTRAMBE le condizioni: coscienza alterata E CPSS positiva. Con paziente A (vigile), la prima condizione non è soddisfatta → non si applica il protocollo per la rilevazione autonoma.",
        path: ["Coscienza alterata? → NO (A = vigile)", "→ Protocollo non applicabile"],
    },
    {
        id: "g-trap-solo-avpu",
        type: "what-if",
        vignette: "Paziente risponde solo alla voce (V nella AVPU). CPSS negativa (rima labiale simmetrica, motilità conservata, eloquio normale). Parametri nei range.",
        correctAnswer: "soreu",
        hint: "Entrambe le condizioni devono essere presenti.",
        explanation: "Coscienza alterata (V) ma CPSS negativa → la seconda condizione non è soddisfatta → non si rileva autonomamente.",
        path: ["Coscienza alterata? → SÌ (V)", "CPSS positiva? → NO", "→ Protocollo non applicabile per rilevazione autonoma"],
    },
    {
        id: "g-trap-fr-limite",
        type: "what-if",
        vignette: "Paziente P nella AVPU. CPSS positiva. FR esattamente 10 atti/min, SpO₂ 95%, FC 75, PAS 110.",
        correctAnswer: "soreu",
        hint: "Il range è 10 < FR < 30. FR = 10 rientra nel range?",
        explanation: "Il range richiede FR strettamente maggiore di 10. FR = 10 non soddisfa la condizione 10 < FR → fuori range → contattare SOREU.",
        path: ["Coscienza alterata? → SÌ (P)", "CPSS positiva? → SÌ", "FR 10 ✗ (non > 10)", "→ Manovre emergenza + SOREU"],
    },
    {
        id: "g-trap-pas-limite",
        type: "what-if",
        vignette: "Paziente V nella AVPU. CPSS positiva. FR 18, SpO₂ 96%, FC 82, PAS esattamente 150 mmHg.",
        correctAnswer: "soreu",
        hint: "Il range è 90 < PAS < 150. PAS = 150 rientra?",
        explanation: "Il range richiede PAS strettamente minore di 150. PAS = 150 non soddisfa PAS < 150 → fuori range → contattare SOREU.",
        path: ["Coscienza alterata? → SÌ (V)", "CPSS positiva? → SÌ", "PAS 150 ✗ (non < 150)", "→ Manovre emergenza + SOREU"],
    },
    {
        id: "g-trap-minore-genitore",
        type: "what-if",
        vignette: "Ragazzo di 16 anni, confuso (V). CPSS positiva, parametri nei range. Il padre è presente e dà il consenso alla rilevazione.",
        correctAnswer: "autonoma",
        hint: "Cosa cambia rispetto allo scenario del minore senza genitore?",
        explanation: "Il genitore è presente e dà il consenso → la condizione ostativa non sussiste. Con coscienza alterata, CPSS positiva e parametri nei range → rilevazione autonoma.",
        path: ["Paziente minore? → SÌ", "Genitore disponibile? → SÌ (consenso dato)", "Coscienza alterata? → SÌ", "CPSS positiva? → SÌ", "Parametri ok? → SÌ", "→ Rilevazione autonoma"],
    },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
}

const DECISION_STYLE: Record<Decision, { pill: string; result: string; label: string; dot: string }> = {
    autonoma: {
        pill: "bg-green-100 text-green-800 border-green-300",
        result: "border-green-400 bg-green-50 text-green-800",
        label: "Rilevo autonomamente",
        dot: "bg-green-500",
    },
    soreu: {
        pill: "bg-red-100 text-red-700 border-red-300",
        result: "border-red-400 bg-red-50 text-red-700",
        label: "Contatto SOREU",
        dot: "bg-red-500",
    },
};

const TYPE_LABEL: Record<ExerciseType, string> = {
    scenario: "Scenario",
    "what-if": "E se...?",
    parametri: "Parametri",
};

// ─── Study component ──────────────────────────────────────────────────────────

function GlicemiaStudy() {
    const [openSection, setOpenSection] = useState<string | null>("condizioni");

    return (
        <div className="flex flex-col gap-3">
            {/* Condizioni */}
            <SectionCard
                id="condizioni"
                label="Quando rilevare autonomamente"
                open={openSection === "condizioni"}
                onToggle={(id) => setOpenSection(openSection === id ? null : id)}
            >
                <div className="flex flex-col gap-3">
                    <p className="text-xs text-red-400 leading-relaxed">
                        L'équipe MSB rileva la glicemia <span className="font-semibold text-red-600">autonomamente</span> solo se sono soddisfatte <span className="font-semibold text-red-600">entrambe</span> le seguenti condizioni:
                    </p>
                    <ConditionBlock
                        number="1"
                        title="Alterazione della coscienza"
                        description="La persona presenta V, P o U nella scala AVPU (non A)"
                    />
                    <div className="flex items-center gap-2 px-1">
                        <div className="flex-1 h-px bg-red-100" />
                        <span className="text-[10px] font-bold text-red-300 uppercase tracking-wider">E</span>
                        <div className="flex-1 h-px bg-red-100" />
                    </div>
                    <ConditionBlock
                        number="2"
                        title="CPSS positiva"
                        description="Almeno uno tra: deviazione della rima labiale · alterazione della motilità di uno o più arti · difficoltà nell'articolazione della parola"
                    />
                    <div className="flex items-center gap-2 px-1">
                        <div className="flex-1 h-px bg-red-100" />
                        <span className="text-[10px] font-bold text-red-300 uppercase tracking-wider">E</span>
                        <div className="flex-1 h-px bg-red-100" />
                    </div>
                    <ConditionBlock
                        number="3"
                        title="Parametri vitali nei range"
                        description="Tutti e quattro i parametri devono rientrare nei range previsti"
                    />
                </div>
            </SectionCard>

            {/* Parametri */}
            <SectionCard
                id="parametri"
                label="Range dei parametri vitali"
                open={openSection === "parametri"}
                onToggle={(id) => setOpenSection(openSection === id ? null : id)}
            >
                <div className="flex flex-col gap-2">
                    {RANGE_PARAMS.map((p) => (
                        <div
                            key={p.label}
                            className="flex items-center justify-between bg-red-50 border border-red-100 rounded-xl px-4 py-3"
                        >
                            <span className="text-red-900 font-semibold text-sm">{p.label}</span>
                            <span className="text-red-600 text-sm font-mono font-medium">
                                {p.range} <span className="text-red-300 font-sans font-normal">{p.unit}</span>
                            </span>
                        </div>
                    ))}
                    <p className="text-[11px] text-red-300 px-1 pt-1 leading-relaxed">
                        I range sono <span className="font-semibold">stretti</span>: i valori limite (es. FR = 10 o PAS = 150) non rientrano nel range.
                    </p>
                </div>
            </SectionCard>

            {/* Casi speciali */}
            <SectionCard
                id="speciali"
                label="Casi speciali → SOREU"
                open={openSection === "speciali"}
                onToggle={(id) => setOpenSection(openSection === id ? null : id)}
            >
                <div className="flex flex-col gap-2">
                    {SPECIAL_CASES.map((c, i) => (
                        <div
                            key={i}
                            className={`rounded-xl border px-4 py-3 flex flex-col gap-1
                                ${c.color === "amber" ? "bg-amber-50 border-amber-200" :
                                  c.color === "blue"  ? "bg-blue-50 border-blue-200" :
                                                        "bg-red-50 border-red-200"}`}
                        >
                            <p className={`text-xs font-semibold
                                ${c.color === "amber" ? "text-amber-700" :
                                  c.color === "blue"  ? "text-blue-700" :
                                                        "text-red-600"}`}>
                                {c.title}
                            </p>
                            <p className={`text-xs leading-relaxed
                                ${c.color === "amber" ? "text-amber-900" :
                                  c.color === "blue"  ? "text-blue-900" :
                                                        "text-red-900"}`}>
                                {c.description}
                            </p>
                        </div>
                    ))}
                </div>
            </SectionCard>
        </div>
    );
}

function SectionCard({
    id, label, open, onToggle, children,
}: {
    id: string;
    label: string;
    open: boolean;
    onToggle: (id: string) => void;
    children: React.ReactNode;
}) {
    return (
        <div className="border border-red-100 rounded-2xl overflow-hidden">
            <button
                onClick={() => onToggle(id)}
                className="w-full flex items-center justify-between px-5 py-4 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
            >
                <span className="text-red-900 font-semibold text-sm text-left">{label}</span>
                <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-red-300 text-xs ml-2 shrink-0"
                >
                    ▼
                </motion.span>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 py-4 bg-white flex flex-col gap-3">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ConditionBlock({ number, title, description }: { number: string; title: string; description: string }) {
    return (
        <div className="flex gap-3 items-start">
            <div className="w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {number}
            </div>
            <div>
                <p className="text-red-900 font-semibold text-sm">{title}</p>
                <p className="text-red-400 text-xs leading-relaxed mt-0.5">{description}</p>
            </div>
        </div>
    );
}

// ─── Practice component ───────────────────────────────────────────────────────

function GlicemiaPractice() {
    const [queue] = useState<Scenario[]>(() => shuffle(SCENARIOS));
    const [idx, setIdx] = useState(0);
    const [selected, setSelected] = useState<Decision | null>(null);
    const [attempts, setAttempts] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [results, setResults] = useState<{ correct: boolean; scenario: Scenario }[]>([]);
    const [done, setDone] = useState(false);
    const [cardKey, setCardKey] = useState(0);

    const scenario = queue[idx];
    const isAnswered = selected !== null;
    const isCorrect = selected === scenario?.correctAnswer;

    function handleSelect(d: Decision) {
        if (isAnswered) return;
        const attempt = attempts + 1;
        setAttempts(attempt);
        setSelected(d);
        if (d !== scenario.correctAnswer && attempt === 1 && scenario.hint) {
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
                        {pct >= 80
                            ? "Ottima padronanza del protocollo glicemia."
                            : pct >= 50
                            ? "Buon lavoro — ripassare i casi limite e le condizioni speciali."
                            : "Rileggi la teoria e riprova, concentrandoti sulle condizioni necessarie."}
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300 px-1">Riepilogo</p>
                    {results.map((r, i) => (
                        <motion.div
                            key={i}
                            className={`rounded-xl border px-4 py-3 flex flex-col gap-1.5
                                ${r.correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <p className={`text-xs leading-snug flex-1 font-medium
                                    ${r.correct ? "text-green-900" : "text-red-900"}`}>
                                    {r.scenario.vignette.length > 90
                                        ? r.scenario.vignette.slice(0, 90) + "…"
                                        : r.scenario.vignette}
                                </p>
                                <span className={`text-xs font-bold shrink-0 ${r.correct ? "text-green-600" : "text-red-500"}`}>
                                    {r.correct ? "✓" : "✗"}
                                </span>
                            </div>
                            {!r.correct && (
                                <p className="text-[11px] text-red-500 flex items-center gap-1.5">
                                    Risposta corretta:
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] font-bold ${DECISION_STYLE[r.scenario.correctAnswer].pill}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${DECISION_STYLE[r.scenario.correctAnswer].dot}`} />
                                        {DECISION_STYLE[r.scenario.correctAnswer].label}
                                    </span>
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

    const options: Decision[] = ["autonoma", "soreu"];

    return (
        <div className="flex flex-col gap-5 w-full">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300">Glicemia capillare</p>
                    <h2 className="text-red-900 font-semibold text-base">Esercitazione</h2>
                </div>
                <span className="text-xs text-red-400 font-medium tabular-nums">
                    {idx + 1} / {queue.length}
                </span>
            </div>

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
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-red-300">
                        {TYPE_LABEL[scenario.type]}
                    </span>

                    <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-6">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300 mb-2">Scenario</p>
                        <p className="text-red-900 text-base leading-relaxed">{scenario.vignette}</p>
                    </div>

                    <AnimatePresence>
                        {showHint && scenario.hint && (
                            <motion.div
                                className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3"
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-400 mb-1">Suggerimento</p>
                                <p className="text-amber-900 text-sm leading-snug">{scenario.hint}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex flex-col gap-2">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300">Cosa fai?</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {options.map((d) => {
                                const cfg = DECISION_STYLE[d];
                                const isThis = selected === d;
                                const correct = d === scenario.correctAnswer;
                                let style = "bg-white border-red-100 text-red-900 hover:border-red-300 hover:bg-red-50";
                                if (isAnswered) {
                                    if (correct) style = "bg-green-50 border-green-400 text-green-800";
                                    else if (isThis) style = "bg-red-100 border-red-400 text-red-700 opacity-70";
                                    else style = "bg-white border-red-100 text-red-300 opacity-40";
                                }

                                return (
                                    <motion.button
                                        key={d}
                                        onClick={() => handleSelect(d)}
                                        disabled={isAnswered}
                                        whileTap={isAnswered ? {} : { scale: 0.97 }}
                                        className={`relative border rounded-xl py-4 px-4 flex items-center gap-3 transition-colors duration-150 cursor-pointer font-semibold text-sm ${style}`}
                                    >
                                        <span className={`w-3 h-3 rounded-full shrink-0 ${cfg.dot}`} />
                                        {cfg.label}
                                        {isAnswered && correct && (
                                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">✓</span>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>

                    <AnimatePresence>
                        {isAnswered && (
                            <motion.div
                                className="flex flex-col gap-3"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className={`rounded-xl border px-4 py-3 ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                                    <p className={`text-xs font-semibold mb-1 flex items-center gap-1.5 flex-wrap ${isCorrect ? "text-green-600" : "text-red-500"}`}>
                                        {isCorrect ? "Corretto" : (
                                            <>
                                                Non corretto — risposta:
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] font-bold ${DECISION_STYLE[scenario.correctAnswer].pill}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${DECISION_STYLE[scenario.correctAnswer].dot}`} />
                                                    {DECISION_STYLE[scenario.correctAnswer].label}
                                                </span>
                                            </>
                                        )}
                                    </p>
                                    <p className={`text-xs leading-relaxed ${isCorrect ? "text-green-900" : "text-red-900"}`}>
                                        {scenario.explanation}
                                    </p>
                                </div>

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

// ─── Root component ───────────────────────────────────────────────────────────

export default function ConditionsLearning() {
    const [tab, setTab] = useState<Tab>("study");
    const [tabKey, setTabKey] = useState(0);

    function switchTab(next: Tab) {
        if (next === tab) return;
        setTab(next);
        setTabKey((k) => k + 1);
    }

    const TABS: { id: Tab; label: string; description: string }[] = [
        { id: "study",    label: "Studia",   description: "Condizioni e parametri del protocollo" },
        { id: "practice", label: "Pratica",  description: "Mettiti alla prova con scenari clinici" },
    ];

    return (
        <div className="flex flex-col gap-5 w-full">
            <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300">MSB</p>
                <h1 className="text-red-900 font-semibold text-lg">Rilevazione glicemia capillare</h1>
            </div>

            {/* Tab switcher */}
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

            {/* Content */}
            <AnimatePresence mode="wait">
                <GentleSlide key={tabKey} from="top">
                    {tab === "study"    && <GlicemiaStudy />}
                    {tab === "practice" && <GlicemiaPractice />}
                </GentleSlide>
            </AnimatePresence>
        </div>
    );
}
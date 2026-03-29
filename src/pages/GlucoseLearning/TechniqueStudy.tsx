import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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
    { id: 1, text: "Spiegare la procedura al paziente" },
    {
        id: 2,
        text: "Informare il paziente/parente che il valore sarà trasmesso alla SOREU",
    },
    { id: 3, text: "Predisporre il materiale occorrente" },
    { id: 4, text: "Preparare l'apparecchio" },
    {
        id: 5,
        text: "Inserire la striscia reagente nell'apparecchio nel verso giusto",
        detail: "L'apparecchio si accenderà automaticamente.",
    },
    {
        id: 6,
        text: "Verificare che appaia il simbolo di una goccia di sangue sul display",
        detail: "Questo conferma che l'apparecchio è pronto.",
    },
    { id: 7, text: "Disinfettare il dito su cui misurare la glicemia" },
    { id: 8, text: "Premere leggermente il dito del paziente" },
    {
        id: 9,
        text: "Prendere la lancetta pungidito e rimuovere il tappo di sicurezza",
    },
    {
        id: 10,
        text: "Applicare una pressione decisa sul polpastrello del paziente",
        detail: "Meglio se leggermente sul lato del polpastrello.",
    },
    {
        id: 11,
        text: "Premere il polpastrello per far uscire la prima goccia di sangue e pulirla",
    },
    {
        id: 12,
        text: "Premere nuovamente il polpastrello per far uscire la seconda goccia di sangue",
    },
    { id: 13, text: "Appoggiare la striscia reagente sulla goccia di sangue" },
    {
        id: 14,
        text: "Aspettare circa 5 secondi e registrare il valore della glicemia",
    },
    {
        id: 15,
        text: "Pulire il paziente e fargli tenere la garza disinfettante premuta sulla ferita",
    },
    {
        id: 16,
        text: "Smaltire la lancetta e la striscia reagente nel contenitore dei taglienti",
    },
    { id: 17, text: "Comunicare il valore rilevato" },
];

export default function TechniqueStudy() {
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
                    <span className="text-red-900 font-semibold text-sm">
                        Occorrente
                    </span>
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
                                    <div
                                        key={i}
                                        className="flex items-center gap-3"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-300 shrink-0" />
                                        <span className="text-red-900 text-sm">
                                            {item}
                                        </span>
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
                    <span className="text-red-900 font-semibold text-sm">
                        Tecnica — {STEPS.length} passi
                    </span>
                </div>
                <div className="bg-white px-5 py-4 flex flex-col gap-1">
                    {STEPS.map((step) => (
                        <div key={step.id}>
                            <button
                                onClick={() =>
                                    step.detail &&
                                    setExpandedStep(
                                        expandedStep === step.id
                                            ? null
                                            : step.id,
                                    )
                                }
                                className={`w-full flex items-start gap-3 py-2.5 text-left transition-colors rounded-xl px-2 -mx-2
                                    ${step.detail ? "cursor-pointer hover:bg-red-50" : "cursor-default"}`}
                            >
                                <span className="w-5 h-5 rounded-full bg-red-100 text-red-500 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                    {step.id}
                                </span>
                                <span className="text-red-900 text-sm leading-snug flex-1">
                                    {step.text}
                                </span>
                                {step.detail && (
                                    <motion.span
                                        animate={{
                                            rotate:
                                                expandedStep === step.id
                                                    ? 180
                                                    : 0,
                                        }}
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
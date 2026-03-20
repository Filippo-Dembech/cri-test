import { useEffect, useState } from "react";
import Button from "../ui/Button";
import Dropdown from "../ui/Dropdown";
import { useRandomList } from "../hooks/useRandomList";
import { motion, AnimatePresence } from "framer-motion";
import { BiSolidRightArrow } from "react-icons/bi";
import PracticePage from "../ui/PracticePage";

interface Disease {
    name: string;
    symptoms?: string[];
    questions?: string[];
    whatToDo?: string[];
    whatToAvoid?: string[];
}

const diseases: Disease[] = [
    {
        name: "Iperglicemia",
        questions: [
            "Prende pastiglie o insulina?",
            "Quando ha mangiato l'ultima volta?",
            "Ha seguito la terapia?",
        ],
        symptoms: [
            "Sete eccessiva",
            "Urina molto spesso",
            "Vista offuscata",
            "Bocca secca",
        ],
        whatToDo: ["Valutare secondo ABCDE", "Test glicemia"],
    },
    {
        name: "Trauma Cranico",
        symptoms: [
            "Cefalea",
            "Sonnolenza",
            "Dolore",
            "Confusione",
            "Problemi di memoria",
            "Disturbi visivi",
            "Bradicardia",
            "GRAVE: vomito a getto",
            "GRAVE: convulsioni",
            "GRAVE: PDC",
        ],
        questions: [
            "Si ricorda l'accaduto?",
            "Orientato nello spazio e nel tempo?",
        ],
        whatToDo: ["ABCDE", "Monitorare coscienza e parametri"],
        whatToAvoid: ["Posizione antishock"],
    },
    {
        name: "PDC",
        symptoms: ["Pz non contattabile"],
        whatToDo: ["ABCDE", "Assicurare la pervietà delle vie aeree"],
    },
    {
        name: "Trauma di Colonna",
        symptoms: [
            "Dolore testa, collo, schiena",
            "Coscienza alterata",
            "GRAVE: Perdita di urina/feci",
            "GRAVE: Assente o alterata sensibilità e motilità agli arti",
        ],
        whatToDo: ["ABCDE", "Immobilizzazione colonna"],
        whatToAvoid: ["Log-roll"],
    },
    {
        name: "Trauma Toracico",
        symptoms: [
            "Dispnea",
            "Asimmetria o ridotta espansione toracica",
            "Dolore (al movimento, respirazione, palpazione)",
            "Enfisemi sottocutanei",
            "GRAVE: Segni di shock",
        ],
        whatToDo: ["ABCDE"],
    },
    {
        name: "PNX",
        symptoms: [
            "Dispnea",
            "Espansione toracica asimmetrica",
            "Emissione di sangue schiumoso dalla bocca",
            "Desaturazione (dovuta alla ridotta capacità polmonare)",
            "Cianosi",
            "Ipotensione",
            "Alterazione conscienza (dovuta al ridotto ossigeno nel sangue)",
        ],
        whatToDo: [
            "ABCDE",
            "Medicazione subocclusiva (PNX Aperto)",
            "Valutazione secondaria",
        ],
    },
    {
        name: "Frattura delle Coste",
        symptoms: [
            "Dolore al torace aggravato da attività respiratoria (respiro superficiale)",
            "Movimento anormale del torace",
        ],
        whatToDo: ["ABCDE", "Valutazione secondaria"],
    },
    {
        name: "Oggetto conficcato",
        whatToDo: [
            "ABCDE",
            "Tagliare i vestiti",
            "SE emorragie, comprimere sui lati della ferita",
            "Fissare l'oggetto",
        ],
        whatToAvoid: ["Rimuovere l'oggetto", "Nascondere l'oggetto"],
    },
    {
        name: "Trauma Addominale",
        symptoms: [
            "Dolore addominale",
            "Contusioni/ematomi",
            "GRAVE: Addome contratto",
            "GRAVE: Aumento volume addominale (dovuto al riversamento di liquidi interni)",
            "GRAVE: Segni di shock",
        ],
        whatToDo: [
            "ABCDE",
            "Indagare dolore addominale per discriminarlo dall'infarto del miocardio",
        ],
    },
    {
        name: "Eviscerazione",
        whatToDo: [
            "Coprire con garze e telino sterile",
            "Contattare tempestivamente la SOREU",
        ],
        whatToAvoid: [
            "Rimettere i visceri all'interno",
            "Versare disinfettanti",
        ],
    },
    {
        name: "Trauma Parti Molli",
        whatToDo: [
            "ABCDE",
            "Rimuovere accessori o abiti stretti",
            "Valutare possibile frattura (sensibilità, motilità, colore, temperatura, e polso)",
            "Immobilizzare",
        ],
    },
    {
        name: "Frattura",
        symptoms: [
            "Dolore violento e ben localizzato",
            "Incapacità a muovere l'arto",
        ],
        whatToDo: [
            "Tagliare/sfilare delicatamente vestiti",
            "Valutare polso a valle e a monte",
            "Valutare temperatura",
            "Valutare sensibilità",
            "Valutare mobilità",
            "Immobilizzare",
            "Ricontrollare dopo immobilizzazione",
            "Favorire la posizione antalgica",
            "SE possibile, posizione antishock",
            "SE possibile, applicare il ghiaccio",
        ],
        whatToAvoid: ["Stringere troppo stretto"],
    },
    {
        name: "Frattura Esposta",
        symptoms: ["Ossa esposte"],
        whatToDo: [
            "Trattare come frattura normale",
            "Proteggere monconi esposti con telo sterile",
        ],
        whatToAvoid: [
            "Stringere troppo stetto",
            "Far rientrare i monconi ossei",
            "Toccare i monconi ossei",
            "Applicare disinfettanti",
        ],
    },
    {
        name: "Frattura Bacino",
        symptoms: [
            "Dolore anche/schiena",
            "Differenza di lunghezza",
            "Rotazione arto inferiore",
        ],
        whatToDo: ["Immobilizzazione con materassino a depressione"],
        whatToAvoid: ["Log-roll"],
    },
    {
        name: "Lussazione",
        symptoms: ["Deformità articolazione"],
        whatToDo: [
            "Bloccare la lussazione dove si trova",
            "Favorire la posizione antalgica",
            "Applicare ghiaccio",
        ],
        whatToAvoid: [
            "Cercare di riallineare le articolazioni",
            "Escludere frattura",
        ],
    },
    {
        name: "Ferita",
        whatToDo: [
            "Scoprire parte interessata",
            "Pulire con garze sterili e disinfettante",
            "Pressione diretta con garze sterili",
            "Fasciatura",
            "Applicazione ghiaccio",
        ],
    },
    {
        name: "Ferita alla Testa",
        whatToDo: ["Trattamento ferita", "Attenzione sangue in naso/bocca"],
        whatToAvoid: [
            "Comprimere la ferita",
            "Disinfettare la ferita",
            "Pulire la ferita",
        ],
    },
    {
        name: "Ferita all'Occhio",
        whatToDo: [
            "Coprire entrambi gli occhi",
            "SE possibile, sciacquare (dalla base del naso verso l'esterno)",
            "SE sostanza chimica, capire la sostanza",
        ],
        whatToAvoid: ["Togliere lenti a contatto", "Disinfettare"],
    },
];

const variants = {
    enter: { x: "100%", opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
};

export default function DiseasePractice() {
    const [roundCount, setRoundCount] = useState(0);
    const { current: currentDisease, next: nextDisease } =
        useRandomList<Disease>(diseases);

    useEffect(() => {
        setRoundCount((count) => ++count);
    }, [currentDisease]);

    if (!currentDisease) return <h2>No Patologie Disponibili</h2>;

    return (
        <PracticePage title="Pratica Patologie">
            <div className="flex flex-col pb-8 sm:w-100">
                <div style={{ overflow: "hidden" }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentDisease.name}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex flex-col max-w-200 gap-4">
                                <p className="text-2xl">
                                    {currentDisease.name}
                                </p>
                                {currentDisease.symptoms && (
                                    <Dropdown
                                        key={`${roundCount}-1`}
                                        showLabel="Mostra Segni/Sintomi"
                                    >
                                        <div className="flex flex-wrap gap-2 py-2">
                                            {currentDisease.symptoms?.map(
                                                (s) => (
                                                    <span
                                                        key={s}
                                                        className="flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-3 py-1 text-sm"
                                                    >
                                                        <span className="text-amber-400 font-bold text-xs">
                                                            !
                                                        </span>
                                                        {s}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    </Dropdown>
                                )}
                                {currentDisease.questions && (
                                    <Dropdown
                                        key={`${roundCount}-2`}
                                        showLabel="Mostra Domande di Rito"
                                    >
                                        <div className="flex flex-wrap gap-2 py-2">
                                            {currentDisease.questions?.map(
                                                (s) => (
                                                    <span
                                                        key={s}
                                                        className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1 text-sm"
                                                    >
                                                        <span className="text-blue-400 font-bold text-xs">
                                                            ?
                                                        </span>
                                                        {s}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    </Dropdown>
                                )}
                                {currentDisease.whatToDo && (
                                    <Dropdown
                                        key={`${roundCount}-3`}
                                        showLabel="Mostra Assistenza"
                                    >
                                        <div className="flex flex-wrap gap-2 py-2">
                                            {currentDisease.whatToDo?.map(
                                                (s) => (
                                                    <span
                                                        key={s}
                                                        className="flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1 text-sm"
                                                    >
                                                        <span className="text-green-500 font-bold text-xs">
                                                            ✓
                                                        </span>
                                                        {s}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    </Dropdown>
                                )}
                                {currentDisease.whatToAvoid && (
                                    <Dropdown
                                        key={`${roundCount}-4`}
                                        showLabel="Mostra Cosa NON Fare"
                                    >
                                        <div className="flex flex-wrap gap-2 py-2">
                                            {currentDisease.whatToAvoid?.map(
                                                (s) => (
                                                    <span
                                                        key={s}
                                                        className="flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-200 rounded-full px-3 py-1 text-sm"
                                                    >
                                                        <span className="text-red-400 font-bold text-xs">
                                                            ✕
                                                        </span>
                                                        {s}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    </Dropdown>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
                <Button
                    outlined
                    className="flex justify-center max-w-200 m-auto items-center gap-3"
                    style={{ marginTop: 20 }}
                    onClick={nextDisease}
                >
                    Prossima Patologia <BiSolidRightArrow />
                </Button>
            </div>
        </PracticePage>
    );
}

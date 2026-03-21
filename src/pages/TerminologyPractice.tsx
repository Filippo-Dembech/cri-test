import { useEffect, useState } from "react";
import type { TerminologyData } from "../exercises";
import PracticePage from "../ui/PracticePage";
import Confetti from "react-confetti-boom";
import { useRandomList } from "../hooks/useRandomList";
import { motion, AnimatePresence } from "framer-motion";

const terms: TerminologyData[] = [
    {
        definition: "FC troppo alta",
        validAnswers: ["Tachicardia"],
    },
    {
        definition: "FC troppo bassa",
        validAnswers: ["Bradicardia"],
    },
    {
        definition: "FC normale",
        validAnswers: ["Normocardico"],
    },
    {
        definition: "PA troppo alta",
        validAnswers: ["Ipertensione"],
    },
    {
        definition: "PA troppo bassa",
        validAnswers: ["Ipotensione"],
    },
    {
        definition: "Respiro normale",
        validAnswers: ["Eupnoico"],
    },
    {
        definition: "Respiro veloce",
        validAnswers: ["tachipnea", "tachipnoico"],
    },
    {
        definition: "Respiro lento",
        validAnswers: ["bradipnea"],
    },
    {
        definition: "Paziente che capisce ma non parla",
        validAnswers: ["Afasico"],
    },
    {
        definition: "Paziente con glicemia normale",
        validAnswers: ["normoglicemico"],
    },
    {
        definition: "Paziente che non riesce ad articolare bene le parole",
        validAnswers: ["Disartria", "Disartrico"],
    },
    {
        definition: "Sangue nel vomito",
        validAnswers: ["ematemesi"],
    },
    {
        definition: "Fuoriuscita di sangue dalle orecchie",
        validAnswers: ["otorragia"],
    },
    {
        definition: "Dolore addominale",
        validAnswers: ["Addominalgia"],
    },
    {
        definition: "Temperatura corporea molto alta",
        validAnswers: ["piressia", "ipertermia"],
    },
    {
        definition: "Fame intensa",
        validAnswers: ["polifagia"],
    },
    {
        definition: "Mancanza di coordinazione",
        validAnswers: ["atassia"],
    },
    {
        definition: "Indurimento delle arterie",
        validAnswers: ["arteriosclerosi"],
    },
    {
        definition: "Formazione di coagulo sul posto che ostruisce un vaso",
        validAnswers: ["trombosi", "trombo"],
    },
    {
        definition: "Un corpo che viaggia nel sangue e blocca un vaso altrove",
        validAnswers: ["embolo"],
    },
    {
        definition: "Necrosi da ischemia prolungata",
        validAnswers: ["infarto"],
    },
    {
        definition: "Riduzione del flusso sanguigno (ossigeno insufficiente)",
        validAnswers: ["ischemia"],
    },
    {
        definition: "Sete intensa",
        validAnswers: ["polidipsia"],
    },
    {
        definition: "Minzione frequente",
        validAnswers: ["poliuria"],
    },
    {
        definition: "Fuoriuscita di sangue dall'ano",
        validAnswers: ["rettorragia"],
    },
    {
        definition: "Fuoriuscita di sangue con colpi di tosse",
        validAnswers: ["emottisi"],
    },
    {
        definition: "Fuoriuscita di sangue dal naso",
        validAnswers: ["rinorragia", "epistassi"],
    },
    {
        definition: "Eccessiva sudorazione",
        validAnswers: ["diaforesi"],
    },
    {
        definition: "Dolore al muscolo o a più gruppi muscolari",
        validAnswers: ["mialgia"],
    },
    {
        definition:
            "Difficoltà a respirare da sdraiati (ma si respira bene da seduti o in piedi)",
        validAnswers: ["ortopnea"],
    },
    {
        definition: "Stitichezza",
        validAnswers: ["stipsi"],
    },
    {
        definition: "Sanguinamento mestruale abbondante",
        validAnswers: ["menorragia"],
    },
    {
        definition: "Assenza di ciclo mestruale",
        validAnswers: ["amenorrea"],
    },
    {
        definition: "Sangue nelle urine",
        validAnswers: ["ematuria"],
    },
    {
        definition: "Difficoltà ad urinare e a volte anche dolore",
        validAnswers: ["disuria"],
    },
    {
        definition: "Pelle a chiazze",
        validAnswers: ["marezzata"],
    },
    {
        definition:
            'Alterata percezione della sensibilità (formicolio, punture di spillo, arto "addormentato", ...)',
        validAnswers: ["parestesia"],
    },
    {
        definition:
            "Sensazione di bruciore che si avverte dietro lo sterno, spesso associata a reflusso gastroesofageo",
        validAnswers: ["pirosi"],
    },
    {
        definition: "Assenza totale di movimento in tutti e quattro gli arti",
        validAnswers: ["tetraplegia"],
    },
    {
        definition: "Ridotta forza e movimenti a tutti e quattro gli arti",
        validAnswers: ["tetraparesi"],
    },
    {
        definition: "Assenza totale di movimento negli arti inferiori",
        validAnswers: ["paraplegia"],
    },
    {
        definition: "Riduzione di forza e movimento agli arti inferiori",
        validAnswers: ["paraparesi"],
    },
    {
        definition: "Assenza totale di movimenti agli arti dello stesso lato",
        validAnswers: ["emiplegia"],
    },
    {
        definition:
            "Riduzione di forza e movimento agli arti dello stesso lato",
        validAnswers: ["emiparesi"],
    },
    {
        definition: "Assenza totale di movimento da un solo arto",
        validAnswers: ["monoplegia"],
    },
    {
        definition: "Assenza di forza da un solo arto",
        validAnswers: ["monoparesi"],
    },
    {
        definition: "Assenza di forza",
        validAnswers: ["paresi"],
    },
    {
        definition: "Assenza totale di movimento volontario",
        validAnswers: ["plegia"],
    },
    {
        definition: "Capogiri che si manifestano alzandosi",
        validAnswers: ["vertigini ortostatiche"],
    },
    {
        definition: "Vomito che si verifica dopo aver mangiato",
        validAnswers: [
            "emesi post-prandiale",
            "emesi post prandiale",
            "emesi postprandiale",
            "vomito post-prandiale",
            "vomito post prandiale",
            "vomito postprandiale",
        ],
    },
    {
        definition: "Mancanza persistente di appetito",
        validAnswers: ["anoressia"],
    },
    {
        definition: "Sensazione di stanchezza generalizzata",
        validAnswers: ["astenia"],
    },
    {
        definition: "Vomito",
        validAnswers: ["emesi"],
    },
    {
        definition:
            "Metodica utilizzata in ambito cardiologico per dilatare un restringimento coronarico che riduce il flusso del sangue al cuore",
        validAnswers: ["angioplastica"],
    },
    {
        definition: "Difficoltà nella deglutizione",
        validAnswers: ["disfagia"],
    },
    {
        definition: "Pupille ristrette",
        validAnswers: ["miosi", "miotiche"],
    },
    {
        definition: "Pupille asimmetriche tra loro",
        validAnswers: ["anisocoriche", "anisocoria"],
    },
    {
        definition: "Pupille simmetriche tra loro",
        validAnswers: ["isocoriche", "isocoria"],
    },
    {
        definition: "Pupille dilatate",
        validAnswers: ["midriatiche", "midriasi"],
    },
    {
        definition: "Danno che accade nell'istante del trauma",
        validAnswers: ["danno primario"],
    },
    {
        definition: "Danno che ha luogo nelle ore o nei giorni successivi",
        validAnswers: ["danno secondario"],
    },
    {
        definition: "Carenza di ossigeno",
        validAnswers: ["ipossia"],
    },
    {
        definition: "Raccolta di aria nella cavità pleurica",
        validAnswers: ["pneumotorace", "pnx"],
    },
    {
        definition: "Saturazione bassa",
        validAnswers: ["desaturazione"],
    },
    {
        definition: "Perdita di continuità di un segmento osseo",
        validAnswers: ["frattura"],
    },
    {
        definition: "Perdita della continuità articolare",
        validAnswers: ["lussazione"],
    },
    {
        definition:
            "Frattura con monconi ossei rimasti nella sede naturale anatomica senza spostamenti evidenti",
        validAnswers: ["frattura composta", "composta"],
    },
    {
        definition:
            "Frattura con monconi ossei spostati dalla sede naturale anatomica",
        validAnswers: ["frattura scomposta", "scomposta"],
    },
    {
        definition: "Frattura in cui la cute sovrastante è rimasta intatta",
        validAnswers: ["frattura chiusa", "chiusa"],
    },
    {
        definition:
            "Frattura in cui la cute sovrastante ha subito una lacerazione",
        validAnswers: ["frattura aperta", "aperta"],
    },
    {
        definition: "Arresto delle emorragie",
        validAnswers: ["emostasi"],
    },
];

export default function TerminologyPractice() {
    const [rounds, setRounds] = useState(0);
    const [rightAnswers, setRightAnswers] = useState(0);
    const [givenAnswer, setGivenAnswer] = useState("");
    const [showConfetti, setShowConfetti] = useState(false);
    const [revealed, setRevealed] = useState(false);
    const { current: term, next: nextTerm } = useRandomList(terms);
    const [isRightAnswer, setIsRightAnswer] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        setTimeout(() => setShowConfetti(false), 3000);
    }, [term]);

    function goNext() {
        nextTerm();
        setRounds((r) => r + 1);
        setIsRightAnswer(undefined);
        setGivenAnswer("");
        setRevealed(false);
    }

    if (!term) return <h2>Nessun termine disponibile</h2>;

    return (
        <PracticePage title="Pratica Terminologia">
            <motion.div
                className="flex flex-col w-full sm:w-100 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                {/* Definition card */}
                <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-2">
                        Definizione
                    </p>
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={term.definition}
                            className="text-lg text-red-900 leading-relaxed"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            {term.definition}
                        </motion.p>
                    </AnimatePresence>
                </div>

                {/* Revealed answer card */}
                <AnimatePresence>
                    {revealed && (
                        <motion.div
                            className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4"
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                        >
                            <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
                                Risposta corretta
                            </p>
                            <p className="text-lg text-amber-900 font-medium">
                                {term.validAnswers.join(" / ")}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Input + submit — hidden when revealed */}
                {!revealed && (
                    <form
                        className="flex flex-col gap-3 sm:flex-row"
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (
                                term.validAnswers.find(
                                    (validAnswer) =>
                                        validAnswer.toLowerCase() === givenAnswer.toLowerCase(),
                                )
                            ) {
                                setRightAnswers((r) => r + 1);
                                nextTerm();
                                setIsRightAnswer(true);
                                setRounds((r) => r + 1);
                                setGivenAnswer("");
                                setShowConfetti(true);
                                setRevealed(false);
                            } else {
                                setIsRightAnswer(false);
                            }
                        }}
                    >
                        <motion.input
                            type="text"
                            animate={isRightAnswer === false ? { x: [0, -8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            placeholder="Scrivi il termine..."
                            style={
                                isRightAnswer === false
                                    ? { backgroundColor: "rgb(254 226 226)", border: "2px solid #ef4444" }
                                    : { border: "2px solid #fecaca" }
                            }
                            className="rounded-xl py-2 px-4 outline-0 flex-1 text-red-900 placeholder-red-300 bg-white"
                            value={givenAnswer}
                            onChange={(e) => setGivenAnswer(e.target.value)}
                        />
                        <motion.input
                            type="submit"
                            className="rounded-xl bg-red-500 text-white py-2 px-5 font-medium cursor-pointer hover:bg-red-600 transition-colors duration-150"
                            value="Rispondi"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                        />
                    </form>
                )}

                {/* Bottom actions row */}
                <div className="flex gap-3">
                    {/* Show answer button — only visible before revealing */}
                    {!revealed && (
                        <motion.button
                            className="flex-1 border border-amber-200 text-amber-500 bg-transparent py-2 px-4 rounded-xl cursor-pointer hover:bg-amber-50 hover:text-amber-600 transition-all duration-200 text-sm font-medium"
                            onClick={() => {
                                setRevealed(true);
                                setIsRightAnswer(undefined);
                                setGivenAnswer("");
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.96 }}
                        >
                            Mostra risposta
                        </motion.button>
                    )}

                    {/* Skip / Next button */}
                    <motion.button
                        className="flex-1 border border-red-200 text-red-400 bg-transparent py-2 px-4 rounded-xl cursor-pointer hover:bg-red-50 hover:text-red-600 transition-all duration-200 text-sm font-medium"
                        onClick={goNext}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                    >
                        {revealed ? "Prossimo" : "Salta"}
                    </motion.button>
                </div>

                {/* Score */}
                <div className="flex justify-between items-center px-1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-red-400">
                        Risposte corrette
                    </p>
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={rightAnswers}
                            className="text-base font-semibold text-red-700"
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                        >
                            {rightAnswers}
                            <span className="text-red-300 mx-1">/</span>
                            {rounds}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </motion.div>

            {showConfetti && (
                <Confetti
                    mode="boom"
                    particleCount={150}
                    colors={["#ff577f", "#99ff4b", "#eeffe0"]}
                    y={0.9}
                />
            )}
        </PracticePage>
    );
}
import { useState } from "react";
import Button from "../ui/Button";
import PracticePage from "../ui/PracticePage";
import Dropdown from "../ui/Dropdown";
import {motion, AnimatePresence} from 'framer-motion'

interface Situation {
    name: string;
    questions: string[];
}

const situations: Situation[] = [
    {
        name: "Dolore Addominale",
        questions: [
            "Da quanto è insorto?",
            "Insorgenza graduale o improvvisa?",
            "Cosa ha assunto e quando? (cibo, farmaci e bevuto)",
            "Vomito?",
            "Scaricato regolarmente?",
            "Dove si prova dolore?",
            "Tipologia dolore? (urente, trafittivo, oppressivo, costrittivo)",
            "Dolore crampiforme o continuo?",
            "Dolore localizzato o irradiato?",
            "Intensità?",
            "Il dolore cambia al cambio della posizione?",
            "Il dolore cambia con la respirazione profonda?",
        ],
    },
    {
        name: "Vomito",
        questions: ["Colore del vomito?", "Con sangue?"],
    },
    {
        name: "Dolore",
        questions: [
            "Dove si prova dolore?",
            "Tipologia dolore? (urente, trafittivo, oppressivo, costrittivo)",
            "Dolore crampiforme o continuo?",
            "Dolore localizzato o irradiato?",
            "Intensità?",
            "Il dolore cambia al cambio della posizione?",
            "Il dolore cambia con la respirazione profonda?",
        ],
    },
    {
        name: "Dolore Toracico",
        questions: [
            "Insorgenza improvvisa o graduale?",
            "Cosa si stava facendo?",
            "Sforzi?",
            "Si ha assunto qualcosa?",
            "è la prima volta?",
            "Sintomi simili?",
            "Come si è risolta?",
            "Predita di coscienza?",
            "Dove si prova dolore?",
            "Tipologia dolore? (urente, trafittivo, oppressivo, costrittivo)",
            "Dolore crampiforme o continuo?",
            "Dolore localizzato o irradiato?",
            "Intensità?",
            "Il dolore cambia al cambio della posizione?",
            "Il dolore cambia con la respirazione profonda?",
        ],
    },
    {
        name: "Ictus",
        questions: [
            "Qual è il grado di autonomia?",
            "A che ora è stato male?",
            "Quand'è l'ultima volta che è stato visto in salute?",
            "Numero caregiver",
        ],
    },
    {
        name: "Precipitato",
        questions: [
            "Altezza da cui è precipitato?",
            "Superficie di impatto?",
            "Parte del corpo che ha colpito il terreno per prima? (triplice impatto)"
        ],
    },
];

function getRandomSituation() {
    const index = Math.floor(Math.random() * situations.length);
    return situations[index];
}
export default function AnalyzePractice() {
    const [currentSituation, setCurrentSituation] = useState(() =>
        getRandomSituation(),
    );

    return (
        <PracticePage title="Pratica Domande di Rito">
            <motion.div
                className="flex flex-col p-8 w-full max-w-120"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                {/* Situation name — slides in from right on change */}
                <AnimatePresence mode="wait">
                    <motion.p
                        key={currentSituation.name}
                        className="text-2xl mb-4"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        {currentSituation.name}
                    </motion.p>
                </AnimatePresence>

                {/* Dropdown — fades and scales in on change */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSituation.name}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3, ease: "easeInOut", delay: 0.05 }}
                    >
                        <Dropdown key={currentSituation.name}>
                            <ul className="my-3">
                                {currentSituation.questions.map((question) => (
                                    <li>- {question}</li>
                                ))}
                            </ul>
                        </Dropdown>
                    </motion.div>
                </AnimatePresence>

                {/* Button — subtle hover/tap */}
                <motion.div
                    style={{ marginTop: 20 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                >
                    <Button
                        outlined
                        onClick={() => setCurrentSituation(getRandomSituation())}
                    >
                        Prossima Situazione
                    </Button>
                </motion.div>
            </motion.div>
        </PracticePage>
    );
}
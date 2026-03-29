import { useState } from "react";
import Button from "../../ui/Button";
import {motion, AnimatePresence} from 'framer-motion'
import Accordion from "../../ui/Accordion";
import { situations } from "./situations";

function getRandomSituation() {
    const index = Math.floor(Math.random() * situations.length);
    return situations[index];
}

export default function StudyQuestions() {
    const [currentSituation, setCurrentSituation] = useState(() =>
        getRandomSituation(),
    );
    return (
            <motion.div
                className="flex flex-col gap-4 w-full max-w-120 p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                {/* Situation card */}
                <div className="bg-red-100 border border-red-200 rounded-2xl px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-2">
                        Situazione
                    </p>
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={currentSituation.name}
                            className="text-xl font-semibold text-red-900"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            {currentSituation.name}
                        </motion.p>
                    </AnimatePresence>
                </div>

                <Accordion>
                    <Accordion.Section label="Mostra domande">
                        
                            <div className="flex flex-wrap gap-2 py-2">
                                {currentSituation.questions.map((question, i) => (
                                    <span
                                        key={i}
                                        className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1 text-sm"
                                    >
                                        <span className="text-blue-400 font-bold text-xs">?</span>
                                        {question}
                                    </span>
                                ))}
                            </div>
                    </Accordion.Section>
                </Accordion>

                {/* Next button */}
                <motion.div
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
    )
}
import { useState } from "react";
import type { StepsData } from "../../exercises";
import Button from "../Button";
import { GiPartyPopper } from "react-icons/gi";
import Modal from "react-modal";
import { motion, AnimatePresence } from "framer-motion";

function Step({ step }: { step: string }) {
    return (
        <motion.div
            layout
            className="border-2 border-red-200 rounded-lg p-3"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
        >
            {step}
        </motion.div>
    );
}

export default function Steps({ procedureName, steps, onReset }: StepsData & { onReset: () => void }) {
    const [stepsToShow, setStepsToShow] = useState(0);
    const [showAlignment, setShowAlignment] = useState(false);

    return (
        <div>
            <Modal
                isOpen={showAlignment}
                onRequestClose={() => setShowAlignment(false)}
                style={{
                    content: { maxHeight: "max-content", borderRadius: "40px", padding: "30px" },
                    overlay: { backgroundColor: "rgba(0,0,0,0.3)" },
                }}
            >
                <div className="flex flex-col gap-8">
                    <h3 className="text-2xl">Come allineare gli arti?</h3>
                    <ul className="list-disc ml-8">
                        <li>Un arto alla volta</li>
                        <li>Prima un lato e poi l'altro</li>
                        <li>Prima arti inferiori</li>
                        <li>Afferrare articolazioni distale e a valle</li>
                        <li>Lieve trazione</li>
                        <li>Non portare l'arto verso di sè</li>
                        <li>Mani che sorreggono l'arto, non pinzarlo dall'alto</li>
                    </ul>
                    <button
                        onClick={() => setShowAlignment(false)}
                        className="bg-red-50 rounded-2xl py-2 cursor-pointer outline-0"
                    >
                        Chiudi
                    </button>
                </div>
            </Modal>

            <h2 className="text-xl mb-4">{procedureName}</h2>

            <div className="flex flex-col gap-3">
                <AnimatePresence>
                    {steps
                        .filter((_, i) => i < stepsToShow)
                        .map((step, i) =>
                            step.toLowerCase().includes("allinea") &&
                            step.toLowerCase().includes("arti") ? (
                                <motion.button
                                    key={i}
                                    layout
                                    onClick={() => setShowAlignment(true)}
                                    className="border-2 border-red-200 rounded-lg p-3 underline underline-offset-2 cursor-pointer text-left outline-0"
                                    initial={{ opacity: 0, x: -40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.35, ease: "easeOut" }}
                                >
                                    {step}
                                </motion.button>
                            ) : (
                                <Step key={i} step={step} />
                            ),
                        )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    {stepsToShow < steps.length ? (
                        <motion.div
                            key="next-btn"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Button onClick={() => setStepsToShow((curr) => curr + 1)}>
                                Guarda Prossimo Step
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.button
                            key="end"
                            onClick={onReset}
                            className="flex gap-3 items-center justify-center border-red-600 border-2 rounded-2xl text-red-600 p-3 w-full cursor-pointer outline-0 hover:bg-red-600 hover:text-white transition-colors"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            End <GiPartyPopper />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
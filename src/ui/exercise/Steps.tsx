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
            className="bg-white border border-red-200 rounded-xl px-4 py-3 text-red-900 text-sm leading-relaxed"
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
        <div className="flex flex-col gap-4">
            <Modal
                isOpen={showAlignment}
                onRequestClose={() => setShowAlignment(false)}
                style={{
                    content: {
                        maxHeight: "max-content",
                        borderRadius: "24px",
                        padding: "0",
                        border: "none",
                        boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        transform: "translate(-50%, -50%)",
                        width: "min(90vw, 480px)",
                    },
                    overlay: {
                        backgroundColor: "rgba(0,0,0,0.4)",
                        backdropFilter: "blur(2px)",
                        zIndex: 1000,
                    },
                }}
            >
                <div className="flex flex-col gap-6 p-8">
                    {/* Modal header */}
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-1">
                            Procedura
                        </p>
                        <h3 className="text-xl font-semibold text-red-900">
                            Come allineare gli arti?
                        </h3>
                    </div>

                    {/* Modal items */}
                    <ul className="flex flex-col gap-2">
                        {[
                            "Un arto alla volta",
                            "Prima un lato e poi l'altro",
                            "Prima arti inferiori",
                            "Afferrare articolazioni distale e a valle",
                            "Lieve trazione",
                            "Non portare l'arto verso di sè",
                            "Mani che sorreggono l'arto, non pinzarlo dall'alto",
                        ].map((item, i) => (
                            <li
                                key={i}
                                className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-sm text-red-900"
                            >
                                <span className="text-red-300 font-bold text-xs mt-0.5 shrink-0">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                {item}
                            </li>
                        ))}
                    </ul>

                    {/* Close button */}
                    <button
                        onClick={() => setShowAlignment(false)}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 rounded-xl cursor-pointer outline-0 transition-colors duration-150"
                    >
                        Chiudi
                    </button>
                </div>
            </Modal>

            {/* Procedure name */}
            <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-1">
                    Procedura
                </p>
                <h2 className="text-xl font-semibold text-red-900">{procedureName}</h2>
            </div>

            {/* Step counter */}
            <p className="text-xs font-semibold uppercase tracking-widest text-red-300">
                Step{" "}
                <span className="text-red-600">
                    {Math.min(stepsToShow, steps.length)}
                </span>{" "}
                / {steps.length}
            </p>

            <div className="flex flex-col gap-2">
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
                                    className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-amber-800 text-sm text-left cursor-pointer outline-0 hover:bg-amber-100 transition-colors duration-150 underline underline-offset-2"
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
                            className={stepsToShow > 0 ? "mt-4" : ""}
                        >
                            <Button onClick={() => setStepsToShow((curr) => curr + 1)}>
                                Guarda Prossimo Step
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.button
                            key="end"
                            onClick={onReset}
                            className="flex gap-2 items-center justify-center bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl p-3 w-full cursor-pointer outline-0 transition-colors duration-150"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            Fine <GiPartyPopper />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PracticePage from "../../ui/PracticePage";
import SpeedRoundMode from "./modes/SpeedRoundMode";
import SlidingSelector from "../../ui/selections/SlidingSelector";
import ClassifyMode from "./modes/ClassifyMode";

type Mode = "classifica" | "speed";

const MODES: { id: Mode; label: string; icon: string }[] = [
    { id: "classifica", label: "Classifica", icon: "◎" },
    { id: "speed", label: "Speed Round", icon: "✦" },
];

export default function ParametersQuiz() {
    const [mode, setMode] = useState<Mode>("classifica");

    return (
        <PracticePage title="Pratica Parametri">
            <div className="flex flex-col gap-5 w-full sm:max-w-200">

                <SlidingSelector
                    options={MODES}
                    onSelect={(mode) => setMode(mode.id)}
                    currentOption={mode}
                />

                {/* Active mode */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={mode}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    >
                        {mode === "classifica" && (
                            <ClassifyMode />
                        )}
                        {mode === "speed" && (
                            <SpeedRoundMode />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </PracticePage>
    );
}

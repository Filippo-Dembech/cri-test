import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import FlashcardMode from "./modes/FlashcardMode";
import ModeSelector from "./ModeSelector";
import type { ModeType } from "./types";
import TypeMode from "./modes/TypeMode";
import MatchMode from "./modes/MatchMode";

export default function TerminologyLearning() {
    const [mode, setMode] = useState<ModeType>("flashcard");
    const [modeKey, setModeKey] = useState(0);

    function handleModeChange(mode: ModeType) {
        setMode(mode);
        setModeKey((k) => k + 1);
    };


    return (
        <div className="flex flex-col gap-5 w-full sm:max-w-200">

            <ModeSelector
                currentMode={mode}
                onSelect={(m) => handleModeChange(m.id)}
            />

            {/* Mode content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={modeKey}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                >
                    {mode === "flashcard" && <FlashcardMode />}
                    {mode === "type"      && <TypeMode />}
                    {mode === "match"     && <MatchMode />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
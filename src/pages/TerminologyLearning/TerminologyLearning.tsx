import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import FlashcardMode from "./modes/FlashcardMode";
import ModeSelector from "./ModeSelector";
import type { ModeType } from "./types";
import TypingMode from "./modes/TypingMode";
import MatchMode from "./modes/MatchMode";
import GentleSlide from "../../ui/animations/GentleSlide";

export default function TerminologyLearning() {
    const [mode, setMode] = useState<ModeType>("flashcard");
    const [modeKey, setModeKey] = useState(0);

    function updateMode(mode: ModeType) {
        setMode(mode);
        setModeKey((k) => k + 1);
    };

    return (
        <div className="flex flex-col gap-5 w-full sm:max-w-200">

            <ModeSelector
                currentMode={mode}
                onSelect={(mode) => updateMode(mode.id)}
            />

            <AnimatePresence mode="wait">
                <GentleSlide
                    key={modeKey}
                    from="top"
                >
                    {mode === "flashcard" && <FlashcardMode />}
                    {mode === "type"      && <TypingMode />}
                    {mode === "match"     && <MatchMode />}
                </GentleSlide>
            </AnimatePresence>
        </div>
    );
}
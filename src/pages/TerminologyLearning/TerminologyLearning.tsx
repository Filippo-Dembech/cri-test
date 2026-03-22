import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import FlashcardMode from "./modes/FlashcardMode";
import ModeSelector from "./ModeSelector";
import type { ModeType } from "./types";
import TypingMode from "./modes/TypingMode";
import MatchMode from "./modes/MatchMode";
import GentleSlide from "../../ui/animations/GentleSlide";
import TermCountSelector from "./TermCountSelector";
import { terms } from "./terminologyData";

export default function TerminologyLearning() {
    const [mode, setMode] = useState<ModeType>("flashcard");
    const [modeKey, setModeKey] = useState(0);
    const [termCount, setTermCount] = useState<number | "all">(20);

    function updateMode(mode: ModeType) {
        setMode(mode);
        setModeKey((k) => k + 1);
    };

    function updateTermCount(count: number | "all") {
        setTermCount(count);
        setModeKey((k) => k + 1); // resetta il mode corrente
    }

    return (
        <div className="flex flex-col gap-5 w-full sm:max-w-200">
            <ModeSelector
                currentMode={mode}
                onSelect={(mode) => updateMode(mode.id)}
            />
            <TermCountSelector
                value={termCount}
                onChange={updateTermCount}
                max={terms.length}
            />
            <AnimatePresence mode="wait">
                <GentleSlide key={modeKey} from="top">
                    {mode === "flashcard" && <FlashcardMode termsCount={termCount} />}
                    {mode === "type"      && <TypingMode termsCount={termCount} />}
                    {mode === "match"     && <MatchMode termsCount={termCount} />}
                </GentleSlide>
            </AnimatePresence>
        </div>
    );
}

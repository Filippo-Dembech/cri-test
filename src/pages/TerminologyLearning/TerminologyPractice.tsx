import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import FlashcardMode from "./modes/flashcardMode/FlashcardMode";
import { type ModeType } from "./types";
import TypingMode from "./modes/typingMode/TypingMode";
import MatchMode from "./modes/MatchMode";
import GentleSlide from "../../ui/animations/GentleSlide";
import TermCountSelector from "./TermCountSelector";
import { terms } from "./terminologyData";
import SlidingSelector, {
    type SelectorOption,
} from "../../ui/selections/SlidingSelector";
import PracticePage from "../../ui/PracticePage";

const modes: SelectorOption<ModeType>[] = [
    { id: "flashcard", label: "Flashcard", sub: "studia", icon: "⧉" },
    { id: "type", label: "Scrivi", sub: "ricorda", icon: "✎" },
    { id: "match", label: "Abbina", sub: "gioca", icon: "⇄" },
];

export default function TerminologyPractice() {
    const [modeType, setModeType] = useState<ModeType>("flashcard");
    const [modeKey, setModeKey] = useState(0);
    const [termCount, setTermCount] = useState<number | "all">(20);

    function updateMode(mode: ModeType) {
        setModeType(mode);
        setModeKey((k) => k + 1);
    }

    function updateTermCount(count: number | "all") {
        setTermCount(count);
        setModeKey((k) => k + 1); // resetta il mode corrente
    }

    return (
        <PracticePage title="Pratica Terminologia">
            <div className="flex flex-col gap-5 w-full sm:max-w-200">
                <SlidingSelector
                    options={modes}
                    currentOption={modeType}
                    onSelect={(option) => updateMode(option.id)}
                />
                <TermCountSelector
                    value={termCount}
                    onChange={updateTermCount}
                    max={terms.length}
                />
                <AnimatePresence mode="wait">
                    <GentleSlide
                        key={modeKey}
                        from="top"
                    >
                        {modeType === "flashcard" && (
                            <FlashcardMode termsCount={termCount} />
                        )}
                        {modeType === "type" && (
                            <TypingMode termsCount={termCount} />
                        )}
                        {modeType === "match" && (
                            <MatchMode termsCount={termCount} />
                        )}
                    </GentleSlide>
                </AnimatePresence>
            </div>
        </PracticePage>
    );
}

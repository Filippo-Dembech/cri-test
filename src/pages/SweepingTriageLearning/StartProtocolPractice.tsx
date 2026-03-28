import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import PracticeFeedback from "./PracticeFeedback";
import type { ColorCode, ScenarioType } from "./types";
import { scenarios } from "./scenarios";
import ProgressBar from "../../ui/ProgressBar";
import Subtitle from "../../ui/typography/Subtitle";
import Scenario from "./Scenario";
import AnswerOptions from "./AnswerOptions";
import Explanation from "./Explanation";
import { useRandomList } from "../../hooks/useRandomList";


export default function StartProtocolPractice() {
    const {
        current: scenario,
        currentIndex,
        next: nextScenario,
        isExhausted: doneScenarios,
        reset: resetScenarios,
    } = useRandomList(scenarios, { infinite: false });
    const [selectedColorCode, setSelectedColorCode] = useState<
        ColorCode | undefined
    >(undefined);
    const [attempts, setAttempts] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [results, setResults] = useState<
        { correct: boolean; scenario: ScenarioType }[]
    >([]);
    const [cardKey, setCardKey] = useState(0);

    const isAnswered = selectedColorCode !== undefined;
    const isCorrect = selectedColorCode === scenario?.correctAnswer;

    function handleSelect(color: ColorCode) {
        if (isAnswered) return;
        const attempt = attempts + 1;
        setAttempts(attempt);
        setSelectedColorCode(color);

        if (
            color !== scenario?.correctAnswer &&
            attempt === 1 &&
            scenario?.hint
        ) {
            setShowHint(true);
        }
    }

    function handleNext() {
        if (!scenario) return;
        setResults((r) => [...r, { correct: isCorrect, scenario }]);
        nextScenario();
        setSelectedColorCode(undefined);
        setAttempts(0);
        setShowHint(false);
        setCardKey((k) => k + 1);
    }

    function restart() {
        resetScenarios();
        setSelectedColorCode(undefined);
        setAttempts(0);
        setShowHint(false);
        setResults([]);
        setCardKey((k) => k + 1);
    }

    // ── Done screen ───────────────────────────────────────────────────────────
    if (doneScenarios) {
        const correct = results.filter((r) => r.correct).length;
        const total = results.length;

        return (
            <PracticeFeedback
                results={results}
                correct={correct}
                total={total}
                onRestart={restart}
            />
        );
    }
    
    if (!scenario) return <h2>no scenario</h2>

    return (
        <div className="flex flex-col gap-5 w-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Subtitle>Protocollo S.T.A.R.T.</Subtitle>
                    <h2 className="text-red-900 font-semibold text-base">
                        Esercitazione
                    </h2>
                </div>
            </div>

            <ProgressBar
                done={currentIndex}
                total={scenarios.length}
            />

            <AnimatePresence mode="wait">
                <motion.div
                    key={cardKey}
                    className="flex flex-col gap-4"
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.25 }}
                >
                    <Scenario
                        scenario={scenario}
                        showHint={showHint}
                    />

                    <AnswerOptions
                        scenario={scenario}
                        selected={selectedColorCode}
                        isAnswered={isAnswered}
                        onSelect={handleSelect}
                    />

                    <Explanation
                        idx={currentIndex}
                        queue={scenarios}
                        isAnswered={isAnswered}
                        isCorrect={isCorrect}
                        onNext={handleNext}
                        scenario={scenario}
                    />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

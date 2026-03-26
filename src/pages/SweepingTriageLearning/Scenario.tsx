import { motion, AnimatePresence } from "framer-motion";
import Card from "../../ui/Card";
import Subtitle from "../../ui/typography/Subtitle";
import type { ExerciseType, ScenarioType } from "./types";

const TYPE_LABEL: Record<ExerciseType, string> = {
    scenario: "Scenario",
    "next-step": "Passo successivo",
    "what-if": "E se...?",
};

interface Props {
    scenario: ScenarioType,
    showHint: boolean
}

export default function Scenario({ scenario, showHint }: Props) {
    return (
        <div className="flex flex-col gap-4">

            {/* Type badge */}
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-red-300">
                    {TYPE_LABEL[scenario.type]}
                </span>
            </div>

            {/* Vignette */}
            <Card>
                <Subtitle>Paziente</Subtitle>
                <p className="text-red-900 text-base leading-relaxed mt-2">
                    {scenario.vignette}
                </p>
            </Card>

            {/* Hint */}
            <AnimatePresence>
                {showHint && scenario.hint && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                    >
                        <Card color="yellow">
                            <Subtitle className="text-amber-300">Suggerimento</Subtitle>
                            <p className="text-amber-900 text-sm leading-snug mt-1">
                                {scenario.hint}
                            </p>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

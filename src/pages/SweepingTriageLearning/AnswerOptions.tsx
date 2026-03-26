import Subtitle from "../../ui/typography/Subtitle";
import type { ColorCode, ScenarioType } from "./types";
import { motion } from "framer-motion";

const COLOR_STYLE: Record<ColorCode, { pill: string; dot: string }> = {
    green: {
        pill: "bg-green-100 text-green-800 border-green-300",
        dot: "bg-green-500",
    },
    yellow: {
        pill: "bg-amber-100 text-amber-800 border-amber-300",
        dot: "bg-amber-400",
    },
    red: { pill: "bg-red-100 text-red-700 border-red-300", dot: "bg-red-500" },
};

interface Props {
    onSelect: (selectedOption: ColorCode) => void;
    scenario: ScenarioType;
    selected: ColorCode | undefined;
    isAnswered: boolean
}

export default function AnswerOptions({scenario, onSelect, selected, isAnswered }: Props) {
    return (
        <div className="flex flex-col gap-2">
            <Subtitle>Codice triage</Subtitle>
            <div className="grid grid-cols-3 gap-2">
                {scenario.options.map((color) => {
                    const isThis = selected === color;
                    const correct = color === scenario.correctAnswer;
                    let style =
                        "bg-white border-red-100 text-red-900 hover:border-red-300 hover:bg-red-50";
                    if (isAnswered) {
                        if (correct)
                            style =
                                "bg-green-50 border-green-400 text-green-800";
                        else if (isThis && !correct)
                            style =
                                "bg-red-100 border-red-400 text-red-700 opacity-70";
                        else
                            style =
                                "bg-white border-red-100 text-red-300 opacity-40";
                    }

                    return (
                        <motion.button
                            key={color}
                            onClick={() => onSelect(color)}
                            disabled={isAnswered}
                            whileTap={isAnswered ? {} : { scale: 0.96 }}
                            className={`relative border rounded-xl py-3 flex flex-col items-center gap-1.5 transition-colors duration-150 cursor-pointer font-semibold text-sm ${style}`}
                        >
                            <span
                                className={`w-3 h-3 rounded-full ${COLOR_STYLE[color].dot}`}
                            />
                            {color === "green"
                                ? "VERDE"
                                : color === "yellow"
                                  ? "GIALLO"
                                  : "ROSSO"}
                            {isAnswered && correct && (
                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                                    ✓
                                </span>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}

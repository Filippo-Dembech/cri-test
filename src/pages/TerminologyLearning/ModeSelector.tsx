import { motion } from "framer-motion"
import type { ModeType, ModeData } from "./types";

interface Props {
    currentMode: ModeType;
    onSelect: (mode: ModeData) => void
}

export default function ModeSelector({currentMode, onSelect}: Props) {

    const modes: ModeData[] = [
        { id: "flashcard", label: "Flashcard", sub: "studia" },
        { id: "type",      label: "Scrivi",    sub: "ricorda" },
        { id: "match",     label: "Abbina",    sub: "gioca" },
    ];

    return (
            <motion.div
                className="flex gap-2"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {modes.map((m) => (
                    <motion.button
                        key={m.id}
                        onClick={() => onSelect(m)}
                        className={`relative flex flex-1 flex-col items-center py-3 px-2 rounded-2xl border transition-colors duration-150 cursor-pointer ${
                            currentMode === m.id
                                ? "bg-red-500 border-red-500"
                                : "bg-white border-red-200 hover:border-red-300 hover:bg-red-50"
                        }`}
                        whileTap={{ scale: 0.96 }}
                    >
                        <span className={`text-sm font-semibold ${currentMode === m.id ? "text-white" : "text-red-700"}`}>
                            {m.label}
                        </span>
                        <span className={`text-[10px] font-medium uppercase tracking-widest mt-0.5 ${currentMode === m.id ? "text-red-200" : "text-red-300"}`}>
                            {m.sub}
                        </span>
                    </motion.button>
                ))}
            </motion.div>
    )
}
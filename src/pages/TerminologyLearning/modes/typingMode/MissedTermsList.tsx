import { motion } from "framer-motion";
import type { TermEntry } from "../../types";

interface Props {
    missed: TermEntry[];
}

export default function MissedTermsList({ missed }: Props) {
    return (
        <div className="flex flex-col gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300 px-1">
                Da ripassare
            </p>
            <div className="flex flex-col gap-2">
                {missed.map((term, i) => (
                    <motion.div
                        key={i}
                        className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                    >
                        <p className="text-red-400 text-xs leading-relaxed flex-1">
                            {term.definition}
                        </p>
                        <p className="text-red-900 font-semibold text-sm sm:text-right sm:shrink-0 sm:max-w-[40%]">
                            {term.validAnswers[0]}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

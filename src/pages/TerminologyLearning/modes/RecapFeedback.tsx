import { motion } from "framer-motion";

interface Props {
    right: number;
    total: number;
    onRestart: () => void;
}

export default function RecapFeedback({ right, total, onRestart}: Props) {
        const percentage = Math.round((right / total) * 100);
        return (
            <motion.div
                className="flex flex-col items-center gap-5 py-6"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div
                    className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${percentage >= 80 ? "border-green-400 bg-green-50" : percentage >= 50 ? "border-amber-400 bg-amber-50" : "border-red-400 bg-red-50"}`}
                >
                    <span
                        className={`text-2xl font-semibold ${percentage >= 80 ? "text-green-700" : percentage >= 50 ? "text-amber-700" : "text-red-700"}`}
                    >
                        {percentage}%
                    </span>
                </div>
                <p className="text-red-900 font-medium text-lg">
                    {right} su {total} termini conosciuti
                </p>
                <p className="text-red-400 text-sm text-center">
                    {percentage >= 80
                        ? "Ottimo lavoro! Stai memorizzando bene."
                        : percentage >= 50
                          ? "Buon progresso, continua a esercitarti!"
                          : "Continua a studiare, ci vuole pratica!"}
                </p>
                <motion.button
                    className="rounded-xl bg-red-500 text-white py-2.5 px-8 font-medium cursor-pointer hover:bg-red-600 transition-colors text-sm"
                    onClick={onRestart}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                >
                    Ricomincia
                </motion.button>
            </motion.div>
        );
}
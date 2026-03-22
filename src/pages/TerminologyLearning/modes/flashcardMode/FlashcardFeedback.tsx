import { motion } from "framer-motion";

interface Props {
    right: number;
    total: number;
    onRestart: () => void;
}

export default function FlashcardFeedback({ right, total, onRestart}: Props) {
        const percentage = Math.round((right / total) * 100);
        return (
            <motion.div
                className="flex flex-col items-center gap-5 py-6"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
            >
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
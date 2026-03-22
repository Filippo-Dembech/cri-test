import { AnimatePresence, motion } from "framer-motion";

interface Props {
    showBackActions: boolean;
    disableBackActions: boolean;
    onShow?: () => void;
    onRemember?: () => void;
    onReview?: () => void;
}

export default function Actions({showBackActions, onShow, disableBackActions, onRemember, onReview}: Props) {
    return (
            <AnimatePresence mode="wait">
                {!showBackActions ? (
                    <motion.button
                        key="flip-btn"
                        className="w-full border border-red-200 text-red-400 bg-transparent py-2.5 rounded-xl cursor-pointer hover:bg-red-50 transition-all text-sm font-medium"
                        onClick={onShow}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        Mostra risposta
                    </motion.button>
                ) : (
                    <motion.div
                        key="result-btns"
                        className="flex gap-2"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.button
                            className="flex-1 border border-red-200 text-red-500 bg-red-50 py-2.5 rounded-xl cursor-pointer hover:bg-red-100 transition-all text-sm font-medium"
                            onClick={onReview}
                            whileTap={{ scale: 0.96 }}
                            disabled={disableBackActions}
                        >
                            Non sapevo
                        </motion.button>
                        <motion.button
                            className="flex-1 border border-green-200 text-green-700 bg-green-50 py-2.5 rounded-xl cursor-pointer hover:bg-green-100 transition-all text-sm font-medium"
                            onClick={onRemember}
                            whileTap={{ scale: 0.96 }}
                            disabled={disableBackActions}
                        >
                            Sapevo
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
    )
}
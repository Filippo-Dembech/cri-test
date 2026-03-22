import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Props {
    front: string;
    back: string[];
    isFlipped?: boolean; // to give parent control over card flipping
    onFlipChange?: (isFlipped: boolean) => void;
    onRemember?: () => void;
    onReview?: () => void;
    onDeclare?: () => void;
    onFlipComplete?: () => void;
}

export default function Flashcard({
    front,
    back,
    isFlipped: controlledFlip,
    onFlipChange,
    onRemember,
    onDeclare,
    onReview,
    onFlipComplete,
}: Props) {

    const [internalFlip, setInternalFlip] = useState(false);
    const [result, setResult] = useState<"remember" | "review" | null>(null);

    // If parent passes isFlipped, use that — otherwise use internal state
    const isControlled = controlledFlip !== undefined;
    const isFlipped = isControlled ? controlledFlip : internalFlip;
    
    function setIsFlipped(value: boolean) {
        if (!isControlled) setInternalFlip(value);
        onFlipChange?.(value);
    }

    function handleResult(r: "remember" | "review") {
        if (result) return;
        setResult(r);
        onDeclare?.();
        if (r === "remember") onRemember?.();
        else onReview?.();
        setIsFlipped(false);

        const halfFlipDuration = 225;

        setTimeout(() => {
            setResult(null);
            onFlipComplete?.();
        }, halfFlipDuration);
    }

    return (
        <div className="flex flex-col gap-4">
            <div
                className="relative"
                style={{ perspective: 1000 }}
            >
                <motion.div
                    className="relative w-full cursor-pointer"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.45, ease: "easeInOut" }}
                    onClick={() => !result && setIsFlipped(!isFlipped)}
                >
                    {/* Front */}
                    <div
                        className="w-full bg-red-50 border border-red-200 rounded-2xl px-6 py-10 flex flex-col items-center justify-center gap-3 min-h-44"
                        style={{ backfaceVisibility: "hidden" }}
                    >
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300">
                            Definizione
                        </p>
                        <p className="text-red-900 text-center text-base leading-relaxed">
                            {front}
                        </p>
                        <p className="text-[11px] text-red-300 mt-2">
                            tocca per girare
                        </p>
                    </div>
                    {/* Back */}
                    <div
                        className="absolute inset-0 w-full bg-white border border-red-300 rounded-2xl px-6 py-10 flex flex-col items-center justify-center gap-3 min-h-44"
                        style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                        }}
                    >
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300">
                            Termine
                        </p>
                        <p className="text-red-900 text-center text-xl font-semibold leading-relaxed">
                            {back[0]}
                        </p>
                        {back.length > 1 && (
                            <p className="text-[11px] text-red-300">
                                anche: {back.slice(1).join(", ")}
                            </p>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Actions */}
            <AnimatePresence mode="wait">
                {!isFlipped ? (
                    <motion.button
                        key="flip-btn"
                        className="w-full border border-red-200 text-red-400 bg-transparent py-2.5 rounded-xl cursor-pointer hover:bg-red-50 transition-all text-sm font-medium"
                        onClick={() => setIsFlipped(true)}
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
                            onClick={() => handleResult("review")}
                            whileTap={{ scale: 0.96 }}
                            disabled={!!result}
                        >
                            Non sapevo
                        </motion.button>
                        <motion.button
                            className="flex-1 border border-green-200 text-green-700 bg-green-50 py-2.5 rounded-xl cursor-pointer hover:bg-green-100 transition-all text-sm font-medium"
                            onClick={() => handleResult("remember")}
                            whileTap={{ scale: 0.96 }}
                            disabled={!!result}
                        >
                            Sapevo
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

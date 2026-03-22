import { motion } from "framer-motion";
import { useState } from "react";
import Actions from "./Actions";
import Front from "./Front";
import Back from "./Back";

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
                    <Front>
                        <p className="text-red-900 text-center text-base leading-relaxed">
                            {front}
                        </p>
                        <p className="text-[11px] text-red-300 mt-2">
                            tocca per girare
                        </p>
                    </Front>
                    <Back>
                        <p className="text-red-900 text-center text-xl font-semibold leading-relaxed">
                            {back[0]}
                        </p>
                        {back.length > 1 && (
                            <p className="text-[11px] text-red-300">
                                anche: {back.slice(1).join(", ")}
                            </p>
                        )}
                    </Back>

                </motion.div>
            </div>

            <Actions
                showBackActions={isFlipped}
                disableBackActions={!!result}
                onShow={() => setIsFlipped(true)}
                onRemember={() => handleResult("remember")}
                onReview={() => handleResult("review")}
            />
        </div>
    );
}

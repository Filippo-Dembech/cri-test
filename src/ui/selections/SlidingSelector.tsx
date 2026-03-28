import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface SelectorOption<TId extends string = string> {
    id: TId;
    label: string;
    sub?: string;
    icon?: string;
}

interface Props<TId extends string> {
    options: SelectorOption<TId>[];
    currentOption: TId;
    onSelect: (option: SelectorOption<TId>) => void;
}

export default function SlidingSelector<TId extends string>({ options, currentOption, onSelect }: Props<TId>) {
    const [open, setOpen] = useState(false);
    const current = options.find((m) => m.id === currentOption)!;

    // Close on back navigation / escape
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open]);

    // Prevent body scroll while sheet is open
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    function handleSelect(option: SelectorOption<TId>) {
        onSelect(option);
        setOpen(false);
    }

    return (
        <>
            {/* ── Pill trigger ──────────────────────────────────────────── */}
            <motion.button
                onClick={() => setOpen(true)}
                className="flex items-center justify-between px-3 py-1.5 rounded-full border border-red-200 bg-white hover:bg-red-50 transition-colors cursor-pointer"
                whileTap={{ scale: 0.95 }}
            >
                <div>
                    <span className="text-red-500 text-sm mr-1.5">{current.icon}</span>
                    <span className="text-sm font-semibold text-red-700">{current.label}</span>
                </div>
                <span className="text-red-300 text-xs">▾</span>
            </motion.button>

            {/* ── Bottom sheet ──────────────────────────────────────────── */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 bg-black/30 z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                        />

                        {/* Sheet */}
                        <motion.div
                            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl px-4 pt-3 pb-8 shadow-xl"
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", stiffness: 400, damping: 35 }}
                        >
                            {/* Handle */}
                            <div className="w-10 h-1 bg-red-100 rounded-full mx-auto mb-5" />

                            <p className="text-xs font-semibold uppercase tracking-widest text-red-300 mb-3 px-1">
                                Modalità
                            </p>

                            <div className="flex flex-col gap-2">
                                {options.map((m) => {
                                    const isActive = m.id === currentOption;
                                    return (
                                        <motion.button
                                            key={m.id}
                                            onClick={() => handleSelect(m)}
                                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-colors cursor-pointer ${
                                                isActive
                                                    ? "bg-red-500 border-red-500"
                                                    : "bg-white border-red-100 hover:bg-red-50 hover:border-red-200"
                                            }`}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <span className={`text-xl w-7 text-center ${isActive ? "text-white" : "text-red-400"}`}>
                                                {m.icon}
                                            </span>
                                            <div className="flex flex-col items-start">
                                                <span className={`text-sm font-semibold ${isActive ? "text-white" : "text-red-700"}`}>
                                                    {m.label}
                                                </span>
                                                <span className={`text-[10px] font-medium uppercase tracking-widest ${isActive ? "text-red-200" : "text-red-300"}`}>
                                                    {m.sub}
                                                </span>
                                            </div>
                                            {isActive && (
                                                <span className="ml-auto text-white text-base">✓</span>
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
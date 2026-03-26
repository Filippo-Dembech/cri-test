import { motion } from "framer-motion"
import ColorPill from "../../ui/ColorPill"
import type { ScenarioType } from "./types";
import Score from "../../ui/Score";

interface Props {
    onRestart: () => void;
    results: { correct: boolean, scenario: ScenarioType }[];
    correct: number;
    total: number
}

export default function PracticeFeedback({ results, correct, total, onRestart }: Props) {
    const pct = Math.round((correct / total) * 100);
    return (
            <motion.div
                className="flex flex-col gap-6 py-2"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Score */}
               <div className="flex flex-col items-center gap-3">
                    <Score correct={correct} total={total} />
                    <p className="text-red-400 text-sm text-center">
                        {pct >= 80 ? "Ottima padronanza del protocollo." : pct >= 50 ? "Buon lavoro, ripassare gli step critici." : "Rileggi il protocollo e riprova."}
                    </p>
                </div>

                {/* Per-question recap */}
                <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300 px-1">
                        Riepilogo
                    </p>
                    {results.map((r, i) => (
                        <motion.div
                            key={i}
                            className={`rounded-xl border px-4 py-3 flex flex-col gap-1.5
                                ${r.correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <p className={`text-xs leading-snug flex-1 font-medium ${r.correct ? "text-green-900" : "text-red-900"}`}>
                                    {r.scenario.vignette.length > 90
                                        ? r.scenario.vignette.slice(0, 90) + "…"
                                        : r.scenario.vignette}
                                </p>
                                <span className={`text-xs font-bold shrink-0 ${r.correct ? "text-green-600" : "text-red-500"}`}>
                                    {r.correct ? "✓" : "✗"}
                                </span>
                            </div>
                            {!r.correct && (
                                <p className="text-[11px] text-red-500">
                                    Risposta corretta: <ColorPill color={r.scenario.correctAnswer}>{r.scenario.correctAnswer === "green" ? "VERDE" : r.scenario.correctAnswer === "yellow" ? "GIALLO" : "ROSSO"}</ColorPill>
                                </p>
                            )}
                        </motion.div>
                    ))}
                </div>

                <motion.button
                    onClick={onRestart}
                    className="w-full bg-red-500 text-white py-2.5 rounded-xl font-semibold text-sm cursor-pointer hover:bg-red-600 transition-colors"
                    whileTap={{ scale: 0.96 }}
                    whileHover={{ scale: 1.01 }}
                >
                    Ricomincia
                </motion.button>
            </motion.div>
    )
}
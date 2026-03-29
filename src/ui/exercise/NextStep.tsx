import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Step {
  /** Unique identifier for the step (auto-assigned if omitted) */
  id?: string | number;
  /** The main text describing this step */
  text: string;
  /** Optional extended explanation shown after answering */
  detail?: string;
  /** Optional subtle hint shown before the user answers */
  hint?: string;
  /** Optional category/tag label (e.g. "Preparation", "Safety") */
  category?: string;
  /** Difficulty affects how many distractors are shown (default: "medium") */
  difficulty?: "easy" | "medium" | "hard";
}

export interface NextStepProps {
  /** Ordered list of steps to quiz on. Must have at least 3 items. */
  steps: Step[];
  /** Number of questions per session (default: 10) */
  questionsCount?: number;
  /** Called when the quiz ends with the final score [correct, total] */
  onComplete?: (correct: number, total: number) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function normalizeSteps(steps: Step[]): Required<Pick<Step, "id">> & Step[] {
  return steps.map((s, i) => ({ id: i + 1, ...s })) as any;
}

interface QuizQuestion {
  prompt: Step;
  options: Step[];
  correct: Step;
}

function buildQuestions(
  steps: Step[],
  count: number
): QuizQuestion[] {
  const normalized = normalizeSteps(steps);

  const all = normalized.slice(0, -1).map((step, i) => {
    const correct = normalized[i + 1];
    const distractorCount =
      step.difficulty === "hard" ? 3 : step.difficulty === "easy" ? 1 : 2;
    const distractors = shuffle(
      normalized.filter((s) => s.id !== correct.id && s.id !== step.id)
    ).slice(0, Math.min(distractorCount, normalized.length - 2));

    return {
      prompt: step,
      correct,
      options: shuffle([correct, ...distractors]),
    };
  });

  return shuffle(all).slice(0, Math.min(count, all.length));
}

// ─── Difficulty badge ─────────────────────────────────────────────────────────

const difficultyColors: Record<string, string> = {
  easy: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-red-100 text-red-600",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function NextStep({
  steps,
  questionsCount = 10,
  onComplete,
}: NextStepProps) {

  const questions = useMemo(
    () => buildQuestions(steps, questionsCount),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<Step | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);
  const [cardKey, setCardKey] = useState(0);

  if (steps.length < 3) {
    return (
      <p className="text-red-500 text-sm font-medium">NextStep requires at least 3 steps.</p>
    );
  }

  const q = questions[idx];
  const isAnswered = selected !== null;
  const isCorrect = selected?.id === q?.correct.id;

  function handleSelect(step: Step) {
    if (isAnswered) return;
    setSelected(step);
    setShowHint(false);
  }

  function handleNext() {
    const newResults = [...results, isCorrect];
    setResults(newResults);
    const next = idx + 1;
    if (next >= questions.length) {
      setDone(true);
      const correct = newResults.filter(Boolean).length;
      onComplete?.(correct, newResults.length);
    } else {
      setIdx(next);
      setSelected(null);
      setShowHint(false);
      setCardKey((k) => k + 1);
    }
  }

  function restart() {
    setIdx(0);
    setSelected(null);
    setShowHint(false);
    setResults([]);
    setDone(false);
    setCardKey((k) => k + 1);
  }

  // ── Results screen ──────────────────────────────────────────────────────────
  if (done) {
    const correct = results.filter(Boolean).length;
    const pct = Math.round((correct / results.length) * 100);
    const tier = pct >= 80 ? "great" : pct >= 50 ? "ok" : "bad";
    const tierStyles = {
      great: {
        ring: "border-emerald-400 bg-emerald-50",
        text: "text-emerald-700",
        msg: "Eccellente conoscenza della sequenza.",
      },
      ok: {
        ring: "border-amber-400 bg-amber-50",
        text: "text-amber-700",
        msg: "Buon lavoro — riguarda alcuni step.",
      },
      bad: {
        ring: "border-red-400 bg-red-50",
        text: "text-red-700",
        msg: "Ristudia la tecnica a riprova.",
      },
    }[tier];

    return (
      <motion.div
        className="flex flex-col items-center gap-5 py-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >

        <motion.div
          className={`w-28 h-28 rounded-full flex flex-col items-center justify-center border-4 ${tierStyles.ring}`}
          initial={{ scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        >
          <span className={`text-3xl font-bold ${tierStyles.text}`}>
            {pct}%
          </span>
        </motion.div>

        <p className="text-red-900 font-semibold text-base">
          {correct} corretti su {results.length}
        </p>

        {/* Per-question result dots */}
        <div className="flex gap-1.5 flex-wrap justify-center max-w-xs">
          {results.map((r, i) => (
            <motion.div
              key={i}
              className={`w-3 h-3 rounded-full ${r ? "bg-emerald-400" : "bg-red-300"}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.04 }}
              title={`Q${i + 1}: ${r ? "✓" : "✗"}`}
            />
          ))}
        </div>

        <p className="text-red-400 text-sm text-center px-2">{tierStyles.msg}</p>

        <motion.button
          onClick={restart}
          className="w-full bg-red-500 text-white py-2.5 rounded-xl font-semibold text-sm cursor-pointer hover:bg-red-600 active:scale-95 transition-all"
          whileTap={{ scale: 0.96 }}
        >
          Ricomincia
        </motion.button>
      </motion.div>
    );
  }

  // ── Quiz screen ─────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300">
          Prossimo Step
        </p>
        <span className="text-xs text-red-400 font-medium tabular-nums">
          {idx + 1}/{questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-red-100 overflow-hidden">
        <motion.div
          className="h-full bg-red-400 rounded-full"
          animate={{ width: `${(idx / questions.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={cardKey}
          className="flex flex-col gap-4"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
        >
          {/* Prompt card */}
          <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300 mb-2">
              You just completed
            </p>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-red-200 text-red-700 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                {q.prompt.id}
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-red-900 text-base leading-snug font-medium">
                  {q.prompt.text}
                </p>
                {q.prompt.category && (
                  <span className="self-start text-[10px] font-semibold uppercase tracking-wider bg-red-100 text-red-500 px-2 py-0.5 rounded-full">
                    {q.prompt.category}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Hint toggle */}
          {q.correct.hint && !isAnswered && (
            <div>
              {!showHint ? (
                <button
                  onClick={() => setShowHint(true)}
                  className="text-[11px] text-red-300 hover:text-red-400 underline underline-offset-2 transition-colors cursor-pointer"
                >
                  💡 Hint
                </button>
              ) : (
                <motion.div
                  className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <p className="text-xs text-amber-700 leading-relaxed">
                    {q.correct.hint}
                  </p>
                </motion.div>
              )}
            </div>
          )}

          {/* Options */}
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300">
              Cosa viene dopo?
            </p>
            {q.options.map((opt) => {
              const isThis = selected?.id === opt.id;
              const isCorrectOpt = opt.id === q.correct.id;
              let style =
                "bg-white border-red-100 text-red-900 hover:border-red-300 hover:bg-red-50";
              if (isAnswered) {
                if (isCorrectOpt)
                  style = "bg-green-50 border-green-400 text-green-800";
                else if (isThis)
                  style = "bg-red-100 border-red-400 text-red-700 opacity-70";
                else style = "opacity-40 bg-white border-red-100 text-red-300";
              }

              return (
                <motion.button
                  key={opt.id}
                  onClick={() => handleSelect(opt)}
                  disabled={isAnswered}
                  whileTap={isAnswered ? {} : { scale: 0.98 }}
                  className={`relative text-left border rounded-xl px-4 py-3 text-sm leading-snug font-medium transition-colors duration-150 cursor-pointer ${style}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span>{opt.text}</span>
                    {opt.difficulty && (
                      <span
                        className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full shrink-0 mt-0.5 ${difficultyColors[opt.difficulty] ?? ""}`}
                      >
                        {opt.difficulty}
                      </span>
                    )}
                  </div>
                  {isAnswered && isCorrectOpt && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                      ✓
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Feedback + Next */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                className="flex flex-col gap-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div
                  className={`rounded-xl border px-4 py-3 ${
                    isCorrect
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <p
                    className={`text-xs font-semibold ${
                      isCorrect ? "text-green-700" : "text-red-500"
                    }`}
                  >
                    {isCorrect
                      ? "Correct!"
                      : `Lo step successivo era: "${q.correct.text}"`}
                  </p>
                  {q.correct.detail && (
                    <p className="text-xs text-red-400 mt-1 leading-relaxed">
                      {q.correct.detail}
                    </p>
                  )}
                </div>

                <motion.button
                  onClick={handleNext}
                  className="w-full bg-red-500 text-white py-2.5 rounded-xl font-semibold text-sm cursor-pointer hover:bg-red-600 transition-colors"
                  whileTap={{ scale: 0.96 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  {idx + 1 < questions.length ? "Prossimo →" : "Guarda Risultati"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
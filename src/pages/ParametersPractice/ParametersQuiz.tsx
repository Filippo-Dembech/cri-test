import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────

type Parameter = {
  name: string;
  shortName: string;
  unit: string;
  healthyRange: { min: number | string; max: number | string };
  unhealthyRange: { min: number; max: number };
  step?: number;
  isBloodPressure?: boolean;
};

const parameters: Parameter[] = [
  {
    name: "Frequenza Cardiaca",
    shortName: "FC",
    unit: "bpm",
    healthyRange: { min: 60, max: 100 },
    unhealthyRange: { min: 40, max: 130 },
    step: 1,
  },
  {
    name: "Frequenza Respiratoria",
    shortName: "FR",
    unit: "atti/min",
    healthyRange: { min: 12, max: 20 },
    unhealthyRange: { min: 6, max: 40 },
    step: 1,
  },
  {
    name: "Pressione Arteriosa",
    shortName: "PA",
    unit: "mmHg",
    healthyRange: { min: "90/60", max: "120/80" },
    unhealthyRange: { min: 70, max: 180 },
    isBloodPressure: true,
    step: 5,
  },
  {
    name: "Glicemia",
    shortName: "BG",
    unit: "mg/dL",
    healthyRange: { min: 70, max: 99 },
    unhealthyRange: { min: 40, max: 210 },
    step: 1,
  },
  {
    name: "Temperatura",
    shortName: "T°",
    unit: "°C",
    healthyRange: { min: 36.0, max: 37.0 },
    unhealthyRange: { min: 34, max: 40 },
    step: 0.1,
  },
  {
    name: "Saturazione",
    shortName: "SpO₂",
    unit: "%",
    healthyRange: { min: 95, max: 100 },
    unhealthyRange: { min: 70, max: 100 },
    step: 1,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function randBetween(min: number, max: number, step = 1) {
  const steps = Math.floor((max - min) / step);
  return parseFloat((min + Math.floor(Math.random() * (steps + 1)) * step).toFixed(2));
}

function generateValue(p: Parameter): string {
  if (p.isBloodPressure) {
    const sys = randBetween(p.unhealthyRange.min, p.unhealthyRange.max, 5);
    const dia = randBetween(40, 120, 5);
    return `${sys}/${dia}`;
  }
  const v = randBetween(p.unhealthyRange.min, p.unhealthyRange.max, p.step ?? 1);
  return p.step === 0.1 ? v.toFixed(1) : String(v);
}

function classifyValue(p: Parameter, value: string): "bassa" | "normale" | "alta" {
  if (p.isBloodPressure) {
    const [sys, dia] = value.split("/").map(Number);
    if (sys < 90 || dia < 40) return "bassa";
    if (sys > 150 || dia > 130) return "alta";
    return "normale";
  }
  const v = parseFloat(value);
  if (v < (p.healthyRange.min as number)) return "bassa";
  if (v > (p.healthyRange.max as number)) return "alta";
  return "normale";
}

function getHealthyRangeLines(p: Parameter): string[] {
  if (p.isBloodPressure) return ["90/60 – 120/80 mmHg", "PAD < 130 mmHg"];
  return [`${p.healthyRange.min} – ${p.healthyRange.max} ${p.unit}`];
}

const LABELS = [
  { value: "bassa" as const, label: "Bassa" },
  { value: "normale" as const, label: "Normale" },
  { value: "alta" as const, label: "Alta" },
];

// ─── Mode: Classifica ─────────────────────────────────────────────────────────

function ClassificaMode({ onScore }: { onScore: (c: boolean) => void }) {
  const [paramIdx, setParamIdx] = useState(0);
  const [value, setValue] = useState("");
  const [correct, setCorrect] = useState<"bassa" | "normale" | "alta">("normale");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [givenAnswer, setGivenAnswer] = useState<string | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });

  const next = useCallback(() => {
    const idx = Math.floor(Math.random() * parameters.length);
    const v = generateValue(parameters[idx]);
    setParamIdx(idx);
    setValue(v);
    setCorrect(classifyValue(parameters[idx], v));
    setFeedback(null);
    setGivenAnswer(null);
  }, []);

  useEffect(() => { next(); }, []);

  const check = (answer: "bassa" | "normale" | "alta") => {
    if (feedback) return;
    const isCorrect = answer === correct;
    setGivenAnswer(answer);
    setFeedback(isCorrect ? "correct" : "wrong");
    setScore((s) => ({ right: s.right + (isCorrect ? 1 : 0), total: s.total + 1 }));
    onScore(isCorrect);
  };

  const p = parameters[paramIdx];

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col items-center gap-5">
        {/* Param label */}
        <div className="flex flex-col items-center gap-0.5 text-center">
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-red-400">
            {p.shortName} · {p.unit}
          </p>
          <p className="text-base font-semibold text-red-900">{p.name}</p>
        </div>

        {/* Value */}
        <motion.p
          key={value}
          initial={{ scale: 0.6, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 16 }}
          className="font-black tabular-nums leading-none tracking-tighter transition-colors duration-200"
          style={{
            fontSize: "clamp(3.5rem, 12vw, 6rem)",
            color:
              feedback === "correct" ? "#16a34a" : feedback === "wrong" ? "#dc2626" : "#9f1239",
          }}
        >
          {value}
        </motion.p>

        {/* Wrong hint */}
        <AnimatePresence>
          {feedback === "wrong" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="w-full overflow-hidden"
            >
              <div className="bg-red-100 border border-red-200 rounded-xl p-4 text-center">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-red-400 mb-2">
                  Range normale
                </p>
                {getHealthyRangeLines(p).map((line, i) => (
                  <p key={i} className="font-bold text-xl text-red-900 tabular-nums">{line}</p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full h-px bg-red-200" />

        {/* Answer buttons */}
        <div className="flex gap-2 sm:gap-3 w-full">
          {LABELS.map(({ value: v, label }) => {
            const isCorrectAnswer = !!feedback && v === correct;
            const isWrongAnswer = feedback === "wrong" && v === givenAnswer && v !== correct;
            return (
              <motion.button
                key={v}
                onClick={() => check(v)}
                disabled={!!feedback}
                whileHover={!feedback ? { scale: 1.04, y: -1 } : {}}
                whileTap={!feedback ? { scale: 0.96 } : {}}
                className={`flex-1 py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 border ${
                  isCorrectAnswer
                    ? "bg-green-100 border-green-400 text-green-800"
                    : isWrongAnswer
                    ? "bg-red-100 border-red-300 text-red-400 line-through"
                    : feedback
                    ? "bg-white border-red-100 text-red-300"
                    : "bg-white border-red-200 text-red-800 hover:border-red-400 hover:bg-red-50"
                }`}
              >
                {label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Score + next */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-red-400 font-medium">
          <span className="text-red-700 font-bold text-base tabular-nums">{score.right}</span>
          <span className="mx-1 text-red-300">/</span>
          <span className="text-red-600 font-semibold tabular-nums">{score.total}</span>
          <span className="ml-2 text-xs uppercase tracking-widest">corrette</span>
        </p>
        <AnimatePresence>
          {feedback && (
            <motion.button
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              onClick={next}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl px-5 py-2.5 text-sm tracking-wide transition-colors duration-150 shadow-sm"
            >
              Avanti →
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Mode: Speed Round ────────────────────────────────────────────────────────

const SPEED_TIME = 60;

function SpeedRoundMode({ onScore }: { onScore: (c: boolean) => void }) {
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [timeLeft, setTimeLeft] = useState(SPEED_TIME);
  const [paramIdx, setParamIdx] = useState(0);
  const [value, setValue] = useState("");
  const [correct, setCorrect] = useState<"bassa" | "normale" | "alta">("normale");
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [roundScore, setRoundScore] = useState({ right: 0, total: 0 });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextQuestion = useCallback(() => {
    const idx = Math.floor(Math.random() * parameters.length);
    const v = generateValue(parameters[idx]);
    setParamIdx(idx);
    setValue(v);
    setCorrect(classifyValue(parameters[idx], v));
    setFlash(null);
  }, []);

  const start = () => {
    setPhase("playing");
    setTimeLeft(SPEED_TIME);
    setStreak(0);
    setMaxStreak(0);
    setRoundScore({ right: 0, total: 0 });
    nextQuestion();
  };

  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current!); setPhase("done"); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const check = (answer: "bassa" | "normale" | "alta") => {
    const isCorrect = answer === correct;
    setFlash(isCorrect ? "correct" : "wrong");
    onScore(isCorrect);
    setRoundScore((s) => ({ right: s.right + (isCorrect ? 1 : 0), total: s.total + 1 }));
    if (isCorrect) {
      setStreak((s) => { const n = s + 1; setMaxStreak((m) => Math.max(m, n)); return n; });
    } else {
      setStreak(0);
    }
    setTimeout(nextQuestion, 280);
  };

  const timerPct = timeLeft / SPEED_TIME;
  const timerBg = timerPct > 0.5 ? "bg-red-400" : timerPct > 0.25 ? "bg-amber-400" : "bg-rose-600";
  const timerText = timerPct > 0.5 ? "text-red-500" : timerPct > 0.25 ? "text-amber-600" : "text-rose-700";

  // Idle
  if (phase === "idle") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border border-red-200 rounded-2xl p-8 flex flex-col items-center gap-4 text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center text-2xl">
          ⚡
        </div>
        <div>
          <p className="text-red-900 font-bold text-lg">Speed Round</p>
          <p className="text-red-400 text-sm mt-0.5">
            Classifica più valori possibili in {SPEED_TIME} secondi
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={start}
          className="mt-1 px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm tracking-wide transition-colors duration-150 shadow-sm"
        >
          Inizia
        </motion.button>
      </motion.div>
    );
  }

  // Done
  if (phase === "done") {
    const pct = roundScore.total > 0 ? Math.round((roundScore.right / roundScore.total) * 100) : 0;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-red-50 border border-red-200 rounded-2xl p-8 flex flex-col items-center gap-6"
      >
        <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-red-400">Risultato</p>
        <p className="font-black text-7xl text-red-900 tabular-nums leading-none">
          {pct}<span className="text-3xl font-bold text-red-300">%</span>
        </p>
        <div className="flex gap-8 justify-center w-full border-t border-red-200 pt-5">
          {[
            { label: "Corrette", value: roundScore.right, color: "text-green-600" },
            { label: "Totale", value: roundScore.total, color: "text-red-900" },
            { label: "Streak max", value: maxStreak, color: "text-amber-600" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-0.5">
              <span className={`font-black text-3xl tabular-nums ${s.color}`}>{s.value}</span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-red-300">{s.label}</span>
            </div>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={start}
          className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm tracking-wide transition-colors duration-150 shadow-sm"
        >
          Riprova
        </motion.button>
      </motion.div>
    );
  }

  // Playing
  const p = parameters[paramIdx];

  return (
    <div className="flex flex-col gap-4">
      {/* Timer bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-red-100 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full transition-colors duration-500 ${timerBg}`}
            animate={{ width: `${timerPct * 100}%` }}
            transition={{ duration: 0.9, ease: "linear" }}
          />
        </div>
        <span className={`font-black tabular-nums text-lg w-10 text-right ${timerText}`}>
          {timeLeft}s
        </span>
      </div>

      {/* Streak */}
      <AnimatePresence>
        {streak >= 2 && (
          <motion.div
            key={streak}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center"
          >
            <span className="bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-4 py-1.5 rounded-full">
              🔥 {streak} consecutivi
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question card */}
      <div
        className={`bg-red-50 border rounded-2xl p-6 flex flex-col items-center gap-5 transition-colors duration-150 ${
          flash === "correct" ? "border-green-300 bg-green-50"
          : flash === "wrong" ? "border-red-400"
          : "border-red-200"
        }`}
      >
        <div className="flex flex-col items-center gap-0.5 text-center">
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-red-400">
            {p.shortName} · {p.unit}
          </p>
          <p className="text-base font-semibold text-red-900">{p.name}</p>
        </div>

        <motion.p
          key={value}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 16 }}
          className="font-black tabular-nums leading-none tracking-tighter transition-colors duration-150"
          style={{
            fontSize: "clamp(3.5rem, 12vw, 6rem)",
            color:
              flash === "correct" ? "#16a34a" : flash === "wrong" ? "#dc2626" : "#9f1239",
          }}
        >
          {value}
        </motion.p>

        <div className="w-full h-px bg-red-200" />

        <div className="flex gap-2 sm:gap-3 w-full">
          {LABELS.map(({ value: v, label }) => (
            <motion.button
              key={v}
              whileTap={{ scale: 0.95 }}
              onClick={() => check(v)}
              className="flex-1 py-3 bg-white border border-red-200 text-red-800 font-bold rounded-xl text-sm tracking-wide hover:border-red-400 hover:bg-red-50 active:bg-red-100 transition-all duration-150"
            >
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Live score */}
      <p className="text-sm text-red-400 font-medium px-1">
        <span className="text-red-700 font-bold text-base tabular-nums">{roundScore.right}</span>
        <span className="mx-1 text-red-300">/</span>
        <span className="text-red-600 font-semibold tabular-nums">{roundScore.total}</span>
        <span className="ml-2 text-xs uppercase tracking-widest">corrette</span>
      </p>
    </div>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

type Mode = "classifica" | "speed";

const MODES: { id: Mode; label: string; emoji: string }[] = [
  { id: "classifica", label: "Classifica", emoji: "🎯" },
  { id: "speed", label: "Speed Round", emoji: "⚡" },
];

export default function ParametersQuiz() {
  const [mode, setMode] = useState<Mode>("classifica");
  const [totalRight, setTotalRight] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  const handleScore = (correct: boolean) => {
    setTotalRight((r) => r + (correct ? 1 : 0));
    setTotalAnswered((t) => t + 1);
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Tabs + global score */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2">
          {MODES.map((m) => (
            <motion.button
              key={m.id}
              onClick={() => setMode(m.id)}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-150 ${
                mode === m.id
                  ? "bg-red-500 border-red-500 text-white shadow-sm"
                  : "bg-white border-red-200 text-red-700 hover:border-red-300 hover:bg-red-50"
              }`}
            >
              <span className="text-base leading-none">{m.emoji}</span>
              {m.label}
            </motion.button>
          ))}
        </div>

        {totalAnswered > 0 && (
          <p className="text-xs font-semibold text-red-400 tabular-nums shrink-0">
            <span className="text-red-700 font-bold">{totalRight}</span>
            <span className="mx-1 text-red-300">/</span>
            <span className="text-red-600">{totalAnswered}</span>
          </p>
        )}
      </div>

      {/* Active mode */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          {mode === "classifica" && <ClassificaMode onScore={handleScore} />}
          {mode === "speed" && <SpeedRoundMode onScore={handleScore} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
// import { useEffect, useState } from "react";
// import PracticePage from "../ui/PracticePage";
// import Confetti from "react-confetti-boom";
// import { useRandomList } from "../hooks/useRandomList";
// import { motion, AnimatePresence } from "framer-motion";

import PracticePage from "../ui/PracticePage";
import TerminologyLearning from "./TerminologyLearning/TerminologyLearning";

// export default function TerminologyPractice() {
//     const [rounds, setRounds] = useState(0);
//     const [rightAnswers, setRightAnswers] = useState(0);
//     const [givenAnswer, setGivenAnswer] = useState("");
//     const [showConfetti, setShowConfetti] = useState(false);
//     const [revealed, setRevealed] = useState(false);
//     const { current: term, next: nextTerm } = useRandomList(terms);
//     const [isRightAnswer, setIsRightAnswer] = useState<boolean | undefined>(undefined);

//     useEffect(() => {
//         setTimeout(() => setShowConfetti(false), 3000);
//     }, [term]);

//     function goNext() {
//         nextTerm();
//         setRounds((r) => r + 1);
//         setIsRightAnswer(undefined);
//         setGivenAnswer("");
//         setRevealed(false);
//     }

//     if (!term) return <h2>Nessun termine disponibile</h2>;

//     return (
//         <PracticePage title="Pratica Terminologia">
//             <motion.div
//                 className="flex flex-col w-full sm:w-100 gap-4"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4, ease: "easeOut" }}
//             >
//                 {/* Definition card */}
//                 <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
//                     <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-2">
//                         Definizione
//                     </p>
//                     <AnimatePresence mode="wait">
//                         <motion.p
//                             key={term.definition}
//                             className="text-lg text-red-900 leading-relaxed"
//                             initial={{ opacity: 0, x: 30 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             exit={{ opacity: 0, x: -30 }}
//                             transition={{ duration: 0.3, ease: "easeInOut" }}
//                         >
//                             {term.definition}
//                         </motion.p>
//                     </AnimatePresence>
//                 </div>

//                 {/* Revealed answer card */}
//                 <AnimatePresence>
//                     {revealed && (
//                         <motion.div
//                             className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4"
//                             initial={{ opacity: 0, y: -8 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             exit={{ opacity: 0, y: -8 }}
//                             transition={{ duration: 0.25, ease: "easeOut" }}
//                         >
//                             <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
//                                 Risposta corretta
//                             </p>
//                             <p className="text-lg text-amber-900 font-medium">
//                                 {term.validAnswers.join(" / ")}
//                             </p>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>

//                 {/* Input + submit — hidden when revealed */}
//                 {!revealed && (
//                     <form
//                         className="flex flex-col gap-3 sm:flex-row"
//                         onSubmit={(e) => {
//                             e.preventDefault();
//                             if (
//                                 term.validAnswers.find(
//                                     (validAnswer) =>
//                                         validAnswer.toLowerCase() === givenAnswer.toLowerCase(),
//                                 )
//                             ) {
//                                 setRightAnswers((r) => r + 1);
//                                 nextTerm();
//                                 setIsRightAnswer(true);
//                                 setRounds((r) => r + 1);
//                                 setGivenAnswer("");
//                                 setShowConfetti(true);
//                                 setRevealed(false);
//                             } else {
//                                 setIsRightAnswer(false);
//                             }
//                         }}
//                     >
//                         <motion.input
//                             type="text"
//                             animate={isRightAnswer === false ? { x: [0, -8, 8, -6, 6, -4, 4, 0] } : { x: 0 }}
//                             transition={{ duration: 0.4, ease: "easeInOut" }}
//                             placeholder="Scrivi il termine..."
//                             style={
//                                 isRightAnswer === false
//                                     ? { backgroundColor: "rgb(254 226 226)", border: "2px solid #ef4444" }
//                                     : { border: "2px solid #fecaca" }
//                             }
//                             className="rounded-xl py-2 px-4 outline-0 flex-1 text-red-900 placeholder-red-300 bg-white"
//                             value={givenAnswer}
//                             onChange={(e) => setGivenAnswer(e.target.value)}
//                         />
//                         <motion.input
//                             type="submit"
//                             className="rounded-xl bg-red-500 text-white py-2 px-5 font-medium cursor-pointer hover:bg-red-600 transition-colors duration-150"
//                             value="Rispondi"
//                             whileHover={{ scale: 1.03 }}
//                             whileTap={{ scale: 0.96 }}
//                         />
//                     </form>
//                 )}

//                 {/* Bottom actions row */}
//                 <div className="flex gap-3">
//                     {/* Show answer button — only visible before revealing */}
//                     {!revealed && (
//                         <motion.button
//                             className="flex-1 border border-amber-200 text-amber-500 bg-transparent py-2 px-4 rounded-xl cursor-pointer hover:bg-amber-50 hover:text-amber-600 transition-all duration-200 text-sm font-medium"
//                             onClick={() => {
//                                 setRevealed(true);
//                                 setIsRightAnswer(undefined);
//                                 setGivenAnswer("");
//                             }}
//                             whileHover={{ scale: 1.02 }}
//                             whileTap={{ scale: 0.96 }}
//                         >
//                             Mostra risposta
//                         </motion.button>
//                     )}

//                     {/* Skip / Next button */}
//                     <motion.button
//                         className="flex-1 border border-red-200 text-red-400 bg-transparent py-2 px-4 rounded-xl cursor-pointer hover:bg-red-50 hover:text-red-600 transition-all duration-200 text-sm font-medium"
//                         onClick={goNext}
//                         whileHover={{ scale: 1.02 }}
//                         whileTap={{ scale: 0.96 }}
//                     >
//                         {revealed ? "Prossimo" : "Salta"}
//                     </motion.button>
//                 </div>

//                 {/* Score */}
//                 <div className="flex justify-between items-center px-1">
//                     <p className="text-xs font-semibold uppercase tracking-widest text-red-400">
//                         Risposte corrette
//                     </p>
//                     <AnimatePresence mode="wait">
//                         <motion.p
//                             key={rightAnswers}
//                             className="text-base font-semibold text-red-700"
//                             initial={{ opacity: 0, scale: 0.85 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             transition={{ duration: 0.25, ease: "easeOut" }}
//                         >
//                             {rightAnswers}
//                             <span className="text-red-300 mx-1">/</span>
//                             {rounds}
//                         </motion.p>
//                     </AnimatePresence>
//                 </div>
//             </motion.div>

//             {showConfetti && (
//                 <Confetti
//                     mode="boom"
//                     particleCount={150}
//                     colors={["#ff577f", "#99ff4b", "#eeffe0"]}
//                     y={0.9}
//                 />
//             )}
//         </PracticePage>
//     );
// }

export default function TerminologyPractice() {
    return (
        <PracticePage title="Pratica Terminologia">
            <TerminologyLearning />
        </PracticePage>
    )
}
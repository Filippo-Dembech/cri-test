import { useEffect, useState } from "react";
import Button from "../../ui/Button";
import NextButton from "../../ui/NextButton";
import { getRandomParameter } from "./getRandomParameter";
import { getRandomUnhealthyValue } from "./getRandomUnhealthyValue";
import { classifyValue } from "./classifyValue";
import PracticePage from "../../ui/PracticePage";
import { motion, AnimatePresence } from "framer-motion";

export default function ParametersGame() {
    const [roundsCount, setRoundsCount] = useState(0);
    const [rightAnswersCount, setRightAnswersCount] = useState(0);
    const [parameter, setParameter] = useState(() => getRandomParameter());
    const [feedback, setFeedback] = useState<"correct" | "wrong" | undefined>(
        undefined,
    );
    const [givenAnswer, setGivenAnswer] = useState<
        "valore-basso" | "valore-normale" | "valore-alto" | undefined
    >(undefined);
    const [randomUnhealthyValue, setRandomUnhealthyValue] = useState(
        getRandomUnhealthyValue(parameter.name),
    );
    const rightAnswer = classifyValue(parameter.name, randomUnhealthyValue);

    function checkAnswer(
        answer: "valore-basso" | "valore-alto" | "valore-normale",
    ) {
        setGivenAnswer(answer);
        if (rightAnswer === answer) {
            setRightAnswersCount((r) => r + 1);
            setFeedback("correct");
        } else {
            setFeedback("wrong");
        }
        setRoundsCount((r) => r + 1);
    }

    useEffect(() => {
        //setFeedback(undefined);
        setRandomUnhealthyValue(() => getRandomUnhealthyValue(parameter.name));
    }, [parameter]);

    return (
        <PracticePage title="Pratica Parametri">
            <div className="flex flex-col gap-4 w-full items-center">
                {/* Main card */}
                <div className="w-full sm:w-120 bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col items-center gap-6">
                    {/* Parameter name */}
                    <p className="text-xs font-semibold uppercase tracking-widest text-red-400">
                        Parametro
                    </p>
                    <p className="text-2xl font-medium text-red-900 -mt-4">
                        {parameter.name}
                    </p>

                    {/* Big value — always visible */}
                    <motion.p
                        key={randomUnhealthyValue}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 15,
                        }}
                        style={
                            feedback
                                ? feedback === "correct"
                                    ? { color: "#16a34a" }
                                    : { color: "#dc2626" }
                                : { color: "#9f1239" }
                        }
                        className="text-6xl font-bold sm:text-8xl leading-none"
                    >
                        {randomUnhealthyValue}
                    </motion.p>

                    {/* Hint — slides down inside the card, no external layout impact */}
                        <AnimatePresence>
                            {feedback === "wrong" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{
                                        duration: 0.3,
                                        ease: "easeInOut",
                                    }}
                                    className="w-full"
                                >
                                    <div className="w-full bg-red-200 border border-red-300 rounded-xl p-4 mt-2 text-center">
                                        <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-2">
                                            Range corretto
                                        </p>
                                        {parameter.name ===
                                        "Pressione Arteriosa (PA)" ? (
                                            <>
                                                <p className="font-bold text-2xl text-red-900">
                                                    90 &lt; PAS &lt; 150
                                                </p>
                                                <p className="font-bold text-2xl text-red-900">
                                                    PAD &lt; 130
                                                </p>
                                            </>
                                        ) : (
                                            <p className="font-bold text-2xl text-red-900">
                                                {parameter.healthyRange.min} –{" "}
                                                {parameter.healthyRange.max}
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    {/* Divider */}
                    <div className="w-full border-t border-red-200" />

                    {/* Answer buttons */}
                    <div className="flex gap-3 justify-center w-full">
                        {(
                            [
                                { value: "valore-basso", label: "Bassa" },
                                { value: "valore-normale", label: "Normale" },
                                { value: "valore-alto", label: "Alta" },
                            ] as const
                        ).map(({ value, label }) => (
                            <motion.div
                                key={value}
                                animate={
                                    givenAnswer === value
                                        ? { scale: 1.1 }
                                        : { scale: 1 }
                                }
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 15,
                                }}
                                className="flex-1"
                            >
                                <Button
                                    onClick={() => checkAnswer(value)}
                                    disabled={!!feedback}
                                    className={`w-full justify-center ${
                                        givenAnswer === value
                                            ? "outline-3 outline-black"
                                            : ""
                                    }`}
                                >
                                    {label}
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Score + next button */}
                <div className="flex justify-between items-center w-full sm:w-120 px-1">
                    <p className="text-sm text-red-400 font-medium">
                        <span className="text-red-700 font-semibold text-base">
                            {rightAnswersCount}
                        </span>
                        <span className="mx-1 text-red-300">/</span>
                        <span className="text-red-700 font-semibold text-base">
                            {roundsCount}
                        </span>
                        <span className="ml-2">corrette</span>
                    </p>
                    <NextButton
                        show={!!feedback}
                        style={{ padding: "0px 10px" }}
                        onClick={() => {
                            setParameter(() => getRandomParameter());
                            setGivenAnswer(undefined);
                            setFeedback(undefined);
                        }}
                    />
                </div>
            </div>
        </PracticePage>
    );
}

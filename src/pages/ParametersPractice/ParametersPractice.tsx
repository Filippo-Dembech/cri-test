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
        setFeedback(undefined);
        setRandomUnhealthyValue(() => getRandomUnhealthyValue(parameter.name));
    }, [parameter]);

    return (
        <PracticePage title="Pratica Parametri">
            <div className="flex flex-col items-center">
                <div className="text-center border-2 border-red-200 rounded-xl p-3 mb-3 sm:w-120">
                    <p className="text-2xl">{parameter.name}</p>

                    {/* 1. Value bounces in when it changes */}
                    <motion.p
                        key={randomUnhealthyValue}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 15,
                        }}
                        style={
                            feedback &&
                            (feedback === "correct"
                                ? { color: "green" }
                                : { color: "red" })
                        }
                        className="text-6xl font-bold mb-8 mt-4 sm:text-8xl"
                    >
                        {randomUnhealthyValue}
                    </motion.p>

                    <div className="flex gap-3 justify-center">
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
                            >
                                <Button
                                    onClick={() => checkAnswer(value)}
                                    disabled={!!feedback}
                                    className={
                                        givenAnswer === value
                                            ? "outline-3 outline-black"
                                            : ""
                                    }
                                >
                                    {label}
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between gap-8 items-center">
                    <p>
                        Risposte esatte: {rightAnswersCount}/{roundsCount}
                    </p>
                    <NextButton
                        show={!!feedback}
                        onClick={() => {
                            setParameter(() => getRandomParameter());
                            setGivenAnswer(undefined);
                        }}
                    />
                </div>

                {/* 3. Hint panel slides up and fades in */}
                <AnimatePresence>
                    {feedback === "wrong" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-slate-200 p-3 rounded-2xl mt-8 max-w-100 m-auto"
                        >
                            <p>Il range della {parameter.name} è:</p>
                            {parameter.name === "Pressione Arteriosa (PA)" ? (
                                <>
                                    <p className="font-bold text-2xl text-center">
                                        90 &lt; PAS &lt; 150
                                    </p>
                                    <p className="font-bold text-2xl text-center">
                                        PAD &lt; 130
                                    </p>
                                </>
                            ) : (
                                <p className="font-bold text-2xl text-center">
                                    {parameter.healthyRange.min} -{" "}
                                    {parameter.healthyRange.max}
                                </p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </PracticePage>
    );
}

import { useEffect, useState } from "react";
import Button from "../../ui/Button";
import NextButton from "../../ui/NextButton";
import { getRandomParameter } from "./getRandomParameter";
import { getRandomUnhealthyValue } from "./getRandomUnhealthyValue";
import { classifyValue } from "./classifyValue";

export default function ParametersGame() {
    const [roundsCount, setRoundsCount] = useState(0);
    const [rightAnswersCount, setRightAnswersCount] = useState(0);
    const [parameter, setParameter] = useState(() => getRandomParameter());
    const [feedback, setFeedback] = useState<"correct" | "wrong" | undefined>(
        undefined,
    );
    const [givenAnswer, setGivenAnswer] = useState<"valore-basso" | "valore-normale" | "valore-alto" | undefined>(undefined)
    const [randomUnhealthyValue, setRandomUnhealthyValue] = useState(
        getRandomUnhealthyValue(parameter.name),
    );
    const rightAnswer = classifyValue(parameter.name, randomUnhealthyValue);

    function checkAnswer(
        answer: "valore-basso" | "valore-alto" | "valore-normale",
    ) {
        setGivenAnswer(answer);
        if (rightAnswer === answer) {
            setRightAnswersCount((rightAnswers) => rightAnswers + 1);
            setFeedback("correct");
        } else {
            setFeedback("wrong");
        }
        setRoundsCount((round) => round + 1);
    }

    useEffect(() => {
        setFeedback(undefined);
        setRandomUnhealthyValue(() => getRandomUnhealthyValue(parameter.name));
    }, [parameter]);

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">Pratica Parametri</h1>
            <div className="text-center border-2 border-red-200 rounded-xl p-3 mb-3">
                <p className="text-2xl">{parameter.name}</p>
                <p
                    style={
                        feedback &&
                        (feedback === "correct"
                            ? { color: "green" }
                            : { color: "red" })
                    }
                    className="text-6xl font-bold mb-8 mt-4 sm:text-8xl"
                >
                    {randomUnhealthyValue}
                </p>
                <div className="flex gap-3 justify-center">
                    <Button
                        onClick={() => checkAnswer("valore-basso")}
                        disabled={!!feedback}
                        className={givenAnswer === "valore-basso" ? "outline-3 outline-black" : ""}
                    >
                        Bassa
                    </Button>
                    <Button
                        onClick={() => checkAnswer("valore-normale")}
                        disabled={!!feedback}
                        className={givenAnswer === "valore-normale" ? "outline-3 outline-black" : ""}
                    >
                        Normale
                    </Button>
                    <Button
                        onClick={() => checkAnswer("valore-alto")}
                        disabled={!!feedback}
                        className={givenAnswer === "valore-alto" ? "outline-3 outline-black" : ""}
                    >
                        Alta
                    </Button>
                </div>
            </div>
            <div className="flex justify-between">
                <p>
                    Risposte esatte: {rightAnswersCount}/{roundsCount}
                </p>
                <NextButton
                    show={!!feedback}
                    onClick={() => {
                        setParameter(() => getRandomParameter());
                        setGivenAnswer(undefined)
                    }}
                />
            </div>
            {feedback === "wrong" && (
                <div className="bg-slate-200 p-3 rounded-2xl mt-8 max-w-100 m-auto">
                    <p>Il range della {parameter.name} è:</p>
                    {parameter.name === "Pressione Arteriosa (PA)" ? (
                        <>
                            <p className="font-bold text-2xl text-center">
                                90 &lt; PAS &lt; 150
                            </p>
                            <p className="font-bold text-2xl text-center">
                                PAD &lt; 130{" "}
                            </p>
                        </>
                    ) : (
                        <p className="font-bold text-2xl text-center">
                            {parameter.healthyRange.min} -{" "}
                            {parameter.healthyRange.max}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

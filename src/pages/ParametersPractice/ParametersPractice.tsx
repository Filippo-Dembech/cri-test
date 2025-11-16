import { useEffect, useState } from "react";
import Button from "../../ui/Button";
import NextButton from "../../ui/NextButton";
import { getRandomParameter } from "./getRandomParameter";
import { getRandomUnhealthyValue } from "./getRandomUnhealthyValue";
import { classifyValue } from "./classifyValue";


export default function ParametersGame() {
    const [rounds, setRounds] = useState(0);
    const [rightAnswers, setRightAnswers] = useState(0);
    const [parameter, setParameter] = useState(() => getRandomParameter());
    const [feedback, setFeedback] = useState<"correct" | "wrong" | undefined>(
        undefined
    );
    const [randomUnhealthyValue, setRandomUnhealthyValue] = useState(getRandomUnhealthyValue(parameter.name));
    const rightAnswer = classifyValue(parameter.name, randomUnhealthyValue);

    function checkAnswer(
        answer: "valore-basso" | "valore-alto" | "valore-normale"
    ) {
        if (rightAnswer === answer) {
            setRightAnswers((rightAnswers) => rightAnswers + 1);
            setFeedback("correct");
        } else {
            setFeedback("wrong");
        }
        setRounds((round) => round + 1);
    }

    useEffect(() => {
        setFeedback(undefined);
        setRandomUnhealthyValue(() => getRandomUnhealthyValue(parameter.name))
    }, [parameter]);

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">Pratica Parametri</h1>
            <div className="text-center border-2 border-red-200 rounded-xl p-3 mb-3">
                <p className="text-2xl">{parameter.name}</p>
                <p style={feedback && (feedback === "correct" ? { color: "green" }: {color: "red" })} className="text-8xl font-bold mb-8 mt-4 ">
                    {randomUnhealthyValue}
                </p>
                <div className="flex gap-3 justify-center">
                    <Button onClick={() => checkAnswer("valore-basso")} disabled={!!feedback}>
                        Bassa
                    </Button>
                    <Button onClick={() => checkAnswer("valore-normale")} disabled={!!feedback}>
                        Normale
                    </Button>
                    <Button onClick={() => checkAnswer("valore-alto")} disabled={!!feedback}>
                        Alta
                    </Button>
                </div>
            </div>
            <div className="flex justify-between">
                <p>
                    Risposte esatte: {rightAnswers}/{rounds}
                </p>
                    <NextButton
                        show={!!feedback}
                        onClick={() => {
                            setParameter(() => getRandomParameter());
                        }}
                    />
            </div>
        </div>
    );
}

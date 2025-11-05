import { useEffect, useState } from "react";
import type { TerminologyData } from "../exercises";

const terms: TerminologyData[] = [
    {
        definition: "FC troppo alta",
        answer: "Tachicardia",
    },
    {
        definition: "FC troppo bassa",
        answer: "Bradicardia",
    },
    {
        definition: "FC normale",
        answer: "Normocardico",
    },
    {
        definition: "PA troppo alta",
        answer: "Ipertensione",
    },
    {
        definition: "PA troppo bassa",
        answer: "Ipotensione",
    },
    {
        definition: "Respiro normale",
        answer: "Eupnoico",
    },
    {
        definition: "Respiro veloce",
        answer: "tachipnea",
    },
    {
        definition: "Respiro lento",
        answer: "bradipnea",
    },
    {
        definition: "Paziente che capisce ma non parla",
        answer: "Afasico",
    },
    {
        definition: "Paziente con glicemia normale",
        answer: "normoglicemico",
    },
    {
        definition: "Paziente che non riesce ad articolare bene le parole",
        answer: "Disartrico",
    },
    {
        definition: "Sangue nel vomito",
        answer: "ematemesi",
    },
    {
        definition: "Fuoriuscita di sangue dalle orecchie",
        answer: "otorragia",
    },
    {
        definition: "Dolore addominale",
        answer: "Addominalgia",
    },
    {
        definition: "Temperatura corporea molto alta",
        answer: "piressia",
    },
];

function getRandomTerm() {
    const index = Math.floor(Math.random() * terms.length);
    return terms[index];
}

export default function TerminologyPractice() {
    const [rounds, setRounds] = useState(0);
    const [rightAnswers, setRightAnswers] = useState(0);
    const [givenAnswer, setGivenAnswer] = useState("");
    const [term, setTerm] = useState(() => getRandomTerm());
    const [isRightAnswer, setIsRightAnswer] = useState(false);
    
    useEffect(() => {
        setTerm(getRandomTerm())
    }, [rounds])

    return (
        <div>
            <h1 className="text-4xl font-bold mb-4">Terminology Practice</h1>
            <div>
                <p className="text-xl mb-3">{term.definition}</p>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (givenAnswer.toLowerCase() === term.answer.toLowerCase()) {
                            setRightAnswers(rightAnswers => rightAnswers + 1);
                            setIsRightAnswer(true)
                        } else {
                            setIsRightAnswer(false);
                        }
                        setRounds(rounds => rounds + 1)
                        setGivenAnswer("");
                    }}
                >
                    <input
                        type="text"
                        style={isRightAnswer ? {backgroundColor: "oklch(96.7% 0.067 122.328)"}: {}}
                        className="border-2 border-red-200 rounded-lg pb-1 px-2"
                        value={givenAnswer}
                        onChange={(e) => setGivenAnswer(e.target.value)}
                    />
                    <input
                        type="submit"
                        className="ml-3 rounded-lg bg-red-500 text-white pb-1 px-2 transition-colors hover:bg-red-600 duration-100 cursor-pointer"
                        value="Rispondi"
                    />
                </form>
            </div>
            <div>
                <p>Risposte corrette: {rightAnswers} / {rounds}</p>
            </div>
        </div>
    );
}

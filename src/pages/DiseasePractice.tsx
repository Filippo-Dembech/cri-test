import { useState } from "react";
import Button from "../ui/Button";

interface Disease {
    name: string;
    symptoms: string[];
    questions?: string[];
    whatToDo?: string[];
    whatToAvoid?: string[]
}

const diseases: Disease[] = [
    {
        name: "Iperglicemia",
        questions: [
            "Prende pastiglie o insulina?",
            "Quando ha mangiato l'ultima volta?",
            "Ha seguito la terapia?"
        ],
        symptoms: [
            "Sete eccessiva",
            "Urina molto spesso",
            "Vista offuscata",
            "Bocca secca"
        ],
        whatToDo: [
            "Valutare secondo ABCDE",
            "Test glicemia",
        ]
    }
]

function getRandomDesease() {
    return diseases[0]
}

export default function DiseasePractice() {
    
    const [currentDesease, setCurrentDesease] = useState(getRandomDesease);
    const [showQuestions, setShowQuestion] = useState(false);
    const [showSyntomps, setShowSyntomps] = useState(false);
    const [showWhatToDo, setShowWhatToDo] = useState(false)

    return (
        <div>
            <h1 className="text-4xl font-bold">Pratica Patologie</h1>
            <div className="flex flex-col max-w-200 gap-4">
                <p className="text-2xl">{currentDesease.name}</p>
                <Button onClick={() => setShowSyntomps(curr => !curr)}>{showSyntomps ? "Nascondi" : "Mostra"} Sintomi</Button>
                {showSyntomps && (
                    <ul>
                        {currentDesease.symptoms.map(s => (
                            <li>- {s}</li>
                        ))}
                    </ul>
                )}
                <Button onClick={() => setShowQuestion(curr => !curr)}>{showQuestions ? "Nascondi" : "Mostra"} Domande di Rito</Button>
                {showQuestions && (
                    <ul>
                        {currentDesease.questions?.map(s => (
                            <li>- {s}</li>
                        ))}
                    </ul>
                )}
                <Button onClick={() => setShowWhatToDo(curr => !curr)}>{showWhatToDo ? "Nascondi" : "Mostra" } Assistenza</Button>
                {showWhatToDo && (
                    <ul>
                        {currentDesease.whatToDo?.map(s => (
                            <li>- {s}</li>
                        ))}
                    </ul>
                )}
            </div>
            <Button outlined className="flex justify-center max-w-200 m-auto" style={{marginTop: 20}} onClick={() => {
            }}>Prossima Patologia</Button>
        </div>
    )
}
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

export default function DiseasePractice() {
    
    const [showQuestions, setShowQuestion] = useState(false);
    const [showSyntomps, setShowSyntomps] = useState(false);
    const [showWhatToDo, setShowWhatToDo] = useState(false)
    const disease = diseases[0];

    return (
        <div>
            <h1 className="text-4xl font-bold">Disease Practice</h1>
            <div className="flex flex-col w-100 gap-4">
                <p className="text-2xl">{disease.name}</p>
                <Button onClick={() => setShowSyntomps(curr => !curr)}>{showSyntomps ? "Nascondi" : "Mostra"} Sintomi</Button>
                {showSyntomps && (
                    <ul>
                        {disease.symptoms.map(s => (
                            <li>- {s}</li>
                        ))}
                    </ul>
                )}
                <Button onClick={() => setShowQuestion(curr => !curr)}>{showQuestions ? "Nascondi" : "Mostra"} Domande di Rito</Button>
                {showQuestions && (
                    <ul>
                        {disease.questions?.map(s => (
                            <li>- {s}</li>
                        ))}
                    </ul>
                )}
                <Button onClick={() => setShowWhatToDo(curr => !curr)}>{showWhatToDo ? "Nascondi" : "Mostra" } Assistenza</Button>
                {showWhatToDo && (
                    <ul>
                        {disease.whatToDo?.map(s => (
                            <li>- {s}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}
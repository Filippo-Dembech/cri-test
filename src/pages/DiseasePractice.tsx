import { useState } from "react";
import Button from "../ui/Button";
import Dropdown from "../ui/Dropdown";

interface Disease {
    name: string;
    symptoms: string[];
    questions?: string[];
    whatToDo?: string[];
    whatToAvoid?: string[];
}

const diseases: Disease[] = [
    {
        name: "Iperglicemia",
        questions: [
            "Prende pastiglie o insulina?",
            "Quando ha mangiato l'ultima volta?",
            "Ha seguito la terapia?",
        ],
        symptoms: [
            "Sete eccessiva",
            "Urina molto spesso",
            "Vista offuscata",
            "Bocca secca",
        ],
        whatToDo: ["Valutare secondo ABCDE", "Test glicemia"],
    },
];

function getRandomDisease() {
    return diseases[0];
}

export default function DiseasePractice() {
    const [currentDisease, setCurrentDisease] = useState(getRandomDisease);

    return (
        <div>
            <h1 className="text-4xl font-bold">Pratica Patologie</h1>
            <div className="flex flex-col max-w-200 gap-4">
                <p className="text-2xl">{currentDisease.name}</p>
                <Dropdown
                    key={currentDisease.name}
                    showLabel="Mostra Sintomi"
                >
                    <ul>
                        {currentDisease.symptoms.map((s) => (
                            <li>- {s}</li>
                        ))}
                    </ul>
                </Dropdown>
                <Dropdown
                    key={currentDisease.name}
                    showLabel="Mostra Domande di Rito"
                >
                    <ul>
                        {currentDisease.questions?.map((s) => (
                            <li>- {s}</li>
                        ))}
                    </ul>
                </Dropdown>
                <Dropdown
                    key={currentDisease.name}
                    showLabel="Mostra Assistenza"
                >
                    <ul>
                        {currentDisease.whatToDo?.map((s) => (
                            <li>- {s}</li>
                        ))}
                    </ul>
                </Dropdown>
            </div>
            <Button
                outlined
                className="flex justify-center max-w-200 m-auto"
                style={{ marginTop: 20 }}
                onClick={() => {}}
            >
                Prossima Patologia
            </Button>
        </div>
    );
}

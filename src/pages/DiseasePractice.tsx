import { useEffect, useState } from "react";
import Button from "../ui/Button";
import Dropdown from "../ui/Dropdown";

interface Disease {
    name: string;
    symptoms?: string[];
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
    {
        name: "Trauma Cranico",
        symptoms: [
            "Cefalea",
            "Sonnolenza",
            "Dolore",
            "Confusione",
            "Problemi di memoria",
            "Disturbi visivi",
            "Bradicardia",
            "GRAVE: vomito a getto",
            "GRAVE: convulsioni",
            "GRAVE: PDC",
        ],
        questions: [
            "Si ricorda l'accaduto?",
            "Orientato nello spazio e nel tempo?",
        ],
        whatToDo: ["ABCDE", "Monitorare coscienza e parametri"],
        whatToAvoid: ["Posizione antishock"],
    },
    {
        name: "PDC",
        symptoms: ["Pz non contattabile"],
        whatToDo: ["ABCDE", "Assicurare la pervietà delle vie aeree"],
    },
    {
        name: "Trauma di Colonna",
        symptoms: [
            "Dolore testa, collo, schiena",
            "Coscienza alterata",
            "GRAVE: Perdita di urina/feci",
            "GRAVE: Assente o alterata sensibilità e motilità agli arti",
        ],
        whatToDo: ["ABCDE", "Immobilizzazione colonna"],
        whatToAvoid: ["Log-roll"],
    },
    {
        name: "Trauma Toracico",
        symptoms: [
            "Dispnea",
            "Asimmetria o ridotta espansione toracica",
            "Dolore (al movimento, respirazione, palpazione)",
            "Enfisemi sottocutanei",
            "GRAVE: Segni di shock",
        ],
        whatToDo: ["ABCDE"],
    },
    {
        name: "PNX",
        symptoms: [
            "Dispnea",
            "Espansione toracica asimmetrica",
            "Emissione di sangue schiumoso dalla bocca",
            "Desaturazione (dovuta alla ridotta capacità polmonare)",
            "Cianosi",
            "Ipotensione",
            "Alterazione conscienza (dovuta al ridotto ossigeno nel sangue)",
        ],
        whatToDo: [
            "ABCDE",
            "Medicazione subocclusiva (PNX Aperto)",
            "Valutazione secondaria",
        ],
    },
    {
        name: "Frattura delle Coste",
        symptoms: [
            "Dolore al torace aggravato da attività respiratoria (respiro superficiale)",
            "Movimento anormale del torace",
        ],
        whatToDo: ["ABCDE", "Valutazione secondaria"],
    },
    {
        name: "Oggetto conficcato",
        whatToDo: ["ABCDE", "Fissare manualmente l'oggetto"],
        whatToAvoid: ["Rimuovere l'oggetto"],
    },
    {
        name: "Trauma Addominale",
        symptoms: [
            "Dolore addominale",
            "Contusioni/ematomi",
            "GRAVE: Addome contratto",
            "GRAVE: Aumento volume addominale (dovuto al riversamento di liquidi interni)",
            "GRAVE: Segni di shock"
        ],
        whatToDo: [
            "ABCDE",
            "Indagare dolore addominale per discriminarlo dall'infarto del miocardio"
        ]
    }
];

function getRandomDisease() {
    const index = Math.floor(Math.random() * diseases.length);
    return diseases[index];
}

export default function DiseasePractice() {
    const [roundCount, setRoundCount] = useState(0);
    const [currentDisease, setCurrentDisease] = useState(getRandomDisease);

    useEffect(() => {
        setRoundCount((count) => ++count);
    }, [currentDisease]);

    return (
        <div>
            <h1 className="text-4xl font-bold">Pratica Patologie</h1>
            <div className="flex flex-col max-w-200 gap-4">
                <p className="text-2xl">{currentDisease.name}</p>
                {currentDisease.symptoms && (
                    <Dropdown
                        key={`${roundCount}-1`}
                        showLabel="Mostra Sintomi"
                    >
                        <ul>
                            {currentDisease.symptoms?.map((s) => (
                                <li>- {s}</li>
                            ))}
                        </ul>
                    </Dropdown>
                )}
                {currentDisease.questions && (
                    <Dropdown
                        key={`${roundCount}-2`}
                        showLabel="Mostra Domande di Rito"
                    >
                        <ul>
                            {currentDisease.questions?.map((s) => (
                                <li>- {s}</li>
                            ))}
                        </ul>
                    </Dropdown>
                )}
                {currentDisease.whatToDo && (
                    <Dropdown
                        key={`${roundCount}-3`}
                        showLabel="Mostra Assistenza"
                    >
                        <ul>
                            {currentDisease.whatToDo?.map((s) => (
                                <li>- {s}</li>
                            ))}
                        </ul>
                    </Dropdown>
                )}
                {currentDisease.whatToAvoid && (
                    <Dropdown
                        key={`${roundCount}-4`}
                        showLabel="Mostra Cosa NON Fare"
                    >
                        <ul>
                            {currentDisease.whatToAvoid?.map((s) => (
                                <li>- {s}</li>
                            ))}
                        </ul>
                    </Dropdown>
                )}
            </div>
            <Button
                outlined
                className="flex justify-center max-w-200 m-auto"
                style={{ marginTop: 20 }}
                onClick={() => {
                    setCurrentDisease(getRandomDisease);
                }}
            >
                Prossima Patologia
            </Button>
        </div>
    );
}

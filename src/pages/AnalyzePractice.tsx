import { useState } from "react";
import Button from "../ui/Button";

interface Situation {
    name: string;
    questions: string[];
}

const situations: Situation[] = [
    {
        name: "Dolore Addnominale",
        questions: [
            "Da quanto è insorto?",
            "Insorgenza graduale o improvvisa?",
            "Cosa ha assunto e quando? (cibo, farmaci e bevuto)",
            "Vomito?",
            "Scaricato regolarmente?",
            "Dove si prova dolore?",
            "Tipologia dolore? (urente, trafittivo, oppressivo, costrittivo)",
            "Dolore crampiforme o continuo?",
            "Dolore localizzato o irradiato?",
            "Intensità?",
            "Il dolore cambia al cambio della posizione?",
            "Il dolore cambia con la respirazione profonda?",
        ]
    },
    {
        name: "Vomito",
        questions: [
            "Colore del vomito?",
            "Con sangue?"
        ]
    },
    {
        name: "Dolore",
        questions: [
            "Dove si prova dolore?",
            "Tipologia dolore? (urente, trafittivo, oppressivo, costrittivo)",
            "Dolore crampiforme o continuo?",
            "Dolore localizzato o irradiato?",
            "Intensità?",
            "Il dolore cambia al cambio della posizione?",
            "Il dolore cambia con la respirazione profonda?",
        ]
    },
    {
        name: "Dolore Toracico",
        questions: [
            "Insorgenza improvvisa o graduale?",
            "Cosa si stava facendo?",
            "Sforzi?",
            "Si ha assunto qualcosa?",
            "è la prima volta?",
            "Sintomi simili?",
            "Come si è risolta?",
            "Predita di coscienza?",
            "Dove si prova dolore?",
            "Tipologia dolore? (urente, trafittivo, oppressivo, costrittivo)",
            "Dolore crampiforme o continuo?",
            "Dolore localizzato o irradiato?",
            "Intensità?",
            "Il dolore cambia al cambio della posizione?",
            "Il dolore cambia con la respirazione profonda?",
        ]
    },
    {
        name: "Ictus",
        questions: [
            "Qual è il grado di autonomia?",
            "A che ora è stato male?",
            "Quand'è l'ultima volta che è stato visto in salute?",
            "Numero caregiver",
        ]
    }
]

function getRandomSituation() {
  const index = Math.floor(Math.random() * situations.length);
  return situations[index];
}


export default function AnalyzePractice() {
    const [currentSituation, setCurrentSituation] = useState(() => getRandomSituation());
    const [showQuestions, setShowQuestions] = useState(false);

    return (
        <div>
            <h1 className="text-4xl font-bold">Domande di Rito</h1>
            <div className="mt-8">
                <p className="text-2xl mb-4">{currentSituation.name}</p>
                <Button onClick={() => setShowQuestions(show => !show)}>{showQuestions ? "Nascondi" : "Mostra"} domande</Button>
                {showQuestions && (
                    <ul className="my-3">
                        {currentSituation.questions.map(question => (
                            <li>- {question}</li>
                        ))}
                    </ul>
                )}
            </div>
            <Button style={{marginTop: 20}} onClick={() => {
                setCurrentSituation(getRandomSituation())
                setShowQuestions(false);
            }}>Prossima Situazione</Button>
        </div>
    )
}
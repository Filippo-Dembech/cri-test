export interface Situation {
    name: string;
    questions: string[];
}

export const situations: Situation[] = [
    {
        name: "Dolore Addominale",
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
        ],
    },
    {
        name: "Vomito",
        questions: ["Colore del vomito?", "Con sangue?"],
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
        ],
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
        ],
    },
    {
        name: "Ictus",
        questions: [
            "Qual è il grado di autonomia?",
            "A che ora è stato male?",
            "Quand'è l'ultima volta che è stato visto in salute?",
            "Numero caregiver",
        ],
    },
    {
        name: "Precipitato",
        questions: [
            "Altezza da cui è precipitato?",
            "Superficie di impatto?",
            "Parte del corpo che ha colpito il terreno per prima? (triplice impatto)"
        ],
    },
];
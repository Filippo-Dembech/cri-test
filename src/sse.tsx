import type { Course } from "./courses";
import { ExerciseFactory } from "./exercises";

export const sse: Course = {
    name: "Soccorso Sanitario Extraospedaliero",
    chapters: [
        {
            name: "Ruolo e Responsabilità",
            exercises: [
                ExerciseFactory.trueFalse({
                    prompt: "L'AREU è stata istituita in Lombardia nel 2010",
                    answer: false,
                }),
                ExerciseFactory.trueFalse({
                    prompt: "Il Numero Unico d'Emergenza (NUE) è il 112",
                    answer: true,
                }),
                ExerciseFactory.fillIn({
                    sentence:
                        "Con la Legge Madia del ... si istituisce il numero unico europeo 112 su tutto il territorio nazionale",
                    correctWords: "2015",
                }),
                ExerciseFactory.fillIn({
                    sentence: "Il Numero Unico d'Emergenza (NUE) è il ...",
                    correctWords: "112",
                }),
                ExerciseFactory.fillIn({
                    sentence:
                        "La legge ... del 3 aprile 2001 riguarda i Defibrillatori Semi-Automatici Esterni (DAE)",
                    correctWords: "120",
                }),
                ExerciseFactory.flashcard({
                    front: 'Quali sono le condizioni "soggettive" del trasporto?',
                    back: (
                        <ul>
                            <li>Condizioni sanitarie del trasportato</li>
                            <li>Condizioni psico-fisiche dell'autista</li>
                        </ul>
                    ),
                }),
                ExerciseFactory.flashcard({
                    front: 'Quali sono le condizioni "oggettive" del trasporto?',
                    back: (
                        <ul>
                            <li>Condizioni meteorologiche</li>
                            <li>Condizioni del traffico e della viabilità</li>
                            <li>Condizioni del mezzo</li>
                        </ul>
                    ),
                }),
                ExerciseFactory.flashcard({
                    front: "Quali sono i doveri principali dell'incaricato di Pubblico Servizio?",
                    back: (
                        <ul>
                            <li>Obbligo di denuncia</li>
                            <li>Obbligo di discrezionalità</li>
                            <li>Obbligo di intervento</li>
                        </ul>
                    ),
                }),
                ExerciseFactory.multipleChoice({
                    question: "L'Articolo 1218 riguarda",
                    options: [
                        "Circolazione di mezzi adibiliti a servizi d'emergenza o d'istituto",
                        "Limiti di velocità",
                        "Inadempimento e obbligazioni",
                        "Obbligazioni di solido",
                    ],
                    answerId: 2,
                }),
                ExerciseFactory.multipleChoice({
                    question:
                        "Quali leggi disciplina l'utilizzo dei Defibrillatori semi-automatici?",
                    options: [
                        "Art. 22 Legge 675 del 31 dicembre 1996, e Art. 4 Legge 196 del 30 giugno 2003",
                        "Legge 120 del 03 aprile 2001, e Art. 3 Legge 116 del 4 agosto 2021",
                        "Art. 326 del Codice Penale, e Art. 622 del Codice Penale",
                    ],
                    answerId: 1,
                }),
                ExerciseFactory.terminology({
                    definition:
                        "Strumenti con la finalità di orientare attività e comportamenti discrezionali degli operatori.",
                    answer: "Protocollo",
                }),
                ExerciseFactory.terminology({
                    definition:
                        "Regole scritte, sintetiche, atte a supportare nel dettaglio specifiche attività operative",
                    answer: "Istruzioni Operative",
                }),
                ExerciseFactory.terminology({
                    definition:
                        "Raccomandazioni di comportamento clinico, elaborate mediante un processo di revisione della letteratura e delle opinioni di esperti, con lo scopo di decidere le modalità assistenziali più appropriate in specifiche situazioni cliniche",
                    answer: "Linee Guida",
                }),
            ],
        },
        {
            name: "Trauma",
            subchapters: [
                {
                    name: "Intruduzione",
                    exercises: [
                        ExerciseFactory.trueFalse({
                            prompt: "La morte a seguito di un evento traumatico può essere descritta da un andamento con 4 picchi di mortalità",
                            answer: false,
                        }),
                        ExerciseFactory.fillIn({
                            sentence:
                                "La Prevenzione ... consiste nella riduzione della probabilità che l'incidente possa accadere",
                            correctWords: "primaria",
                        }),
                        ExerciseFactory.flashcard({
                            front: "In cosa consiste la Prevenzione Secondaria?",
                            back: "Condiste nella riduzione della gravità delle lesioni del trauma",
                        }),
                        ExerciseFactory.multipleChoice({
                            question:
                                "In cosa consiste la Prevenzione Terziaria?",
                            options: [
                                "Consiste nella riduzione della probabilità che l'inciente possa accadere",
                                "Consiste nella riduzione della gravità delle lesioni del trauma",
                                "Consiste nell'ottimizzare il soccorso pre e intra-ospedaliero",
                            ],
                            answerId: 2,
                        }),
                        ExerciseFactory.terminology({
                            definition:
                                "Riduzione della gravità delle lesioni del trauma",
                            answer: "Prevenzione secondaria",
                        }),
                    ],
                },
                {
                    name: "valutazione del paziente",
                },
                {
                    name: "lesioni della colonna",
                },
                {
                    name: "lesioni delle parti molli e ossee",
                },
                {
                    name: "trauma cranico",
                },
                {
                    name: "lesioni dell'addome",
                },
                {
                    name: "trauma in casi particolari",
                },
                {
                    name: "skills",
                },
            ],
        },
        {
            name: "emergenze mediche",
            subchapters: [
                {
                    name: "patologie cardio vascolari",
                },
                {
                    name: "patologie mediche",
                },
                {
                    name: "urgenze pediatriche",
                },
            ],
        },
        {
            name: "Urgenze Ostetriche e Ginecologiche",
        },
        {
            name: "Emergenze Ambientali",
            subchapters: [
                { name: "Temperatura" },
                { name: "Ambiente acquatico" },
            ],
        },
        {
            name: "Trattamento Primario",
            subchapters: [
                { name: "BLSD" },
                { name: "PBLSD" },
                { name: "Ostruzione vie aeree adulto" },
                { name: "Ostruzione vie aeree pediatriche" },
            ],
        },
        {
            name: "Aspetti psicologici",
        },
        {
            name: "Operazioni in ambulanza",
            subchapters: [
                { name: "Compilazione relazione di soccorso" },
                { name: "Operazioni in ambulanza" },
            ],
        },
        {
            name: "Maxiemergenza",
            subchapters: [
                { name: "Gestione maxi emergenza" },
                { name: "Ruolo del MSB, triage e codici colore" },
                { name: "Aspetti psicologici nelle maxi emergenze" },
            ],
        },
    ],
};

import { ExerciseFactory, Exercise, type ExerciseType } from "./exercises";

export interface ExerciseData {
    type: ExerciseType;
    data: object;
}

export interface ChapterData {
    name: string;
    exercises?: ExerciseData[];
    subchapters?: ChapterData[];
}

export interface CourseData {
    name: string;
    acronym?: string;
    chapters: ChapterData[];
}

export class Chapter {
    private static id = 0;

    public id: number;
    public courseId: number;
    public name: string;
    public exercises?: Exercise[] = [];
    public subchapters?: Chapter[] = [];

    constructor(courseId: number, chapterData: ChapterData) {
        this.id = Chapter.id++;
        this.courseId = courseId;
        this.name = chapterData.name;
        chapterData.exercises?.forEach((exerciseData) =>
            this.exercises?.push(
                new Exercise(
                    this.courseId,
                    this.id,
                    exerciseData.type,
                    exerciseData.data
                )
            )
        );
        chapterData.subchapters?.forEach((subchapterData) =>
            this.subchapters?.push(new Chapter(this.courseId, subchapterData))
        );
    }
}

export class Course {
    private static id = 0;

    public id: number;
    public chapters: Chapter[] = [];
    public name: string;
    public acronym?: string;

    constructor(courseData: CourseData) {
        this.id = Course.id++;
        this.name = courseData.name;
        this.acronym = courseData.acronym;
        courseData.chapters.forEach((chapterData) =>
            this.chapters.push(new Chapter(this.id, chapterData))
        );
    }
}

export const sse: Course = new Course({
    name: "Soccorso Sanitario Extraospedaliero",
    acronym: "SSE",
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
                        "Strumenti con la finalità di orientare attività e comportamenti discrezionali degli operatori",
                    validAnswers: ["Protocollo"],
                }),
                ExerciseFactory.terminology({
                    definition:
                        "Regole scritte, sintetiche, atte a supportare nel dettaglio specifiche attività operative",
                    validAnswers: ["Istruzioni Operative"],
                }),
                ExerciseFactory.terminology({
                    definition:
                        "Raccomandazioni di comportamento clinico, elaborate mediante un processo di revisione della letteratura e delle opinioni di esperti, con lo scopo di decidere le modalità assistenziali più appropriate in specifiche situazioni cliniche",
                    validAnswers: ["Linee Guida"],
                }),
            ],
        },
        {
            name: "Trauma",
            subchapters: [
                {
                    name: "Introduzione",
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
                            validAnswers: ["Prevenzione secondaria"],
                        }),
                    ],
                },
                {
                    name: "valutazione del paziente",
                    exercises: [
                        ExerciseFactory.terminology({
                            definition: "La A dell'ABCDE per cosa sta?",
                            validAnswers: ["Airways"]
                        }),
                        ExerciseFactory.fillIn({
                            sentence: "La C dell'ABCDE sta per ...",
                            correctWords: "Circulation",
                        }),
                        ExerciseFactory.flashcard({
                            front: "Qual è l'obiettivo della valutazione primaria?",
                            back: "Identificare e trattare immediatamente le condizioni pericolose per la vita.",
                        }),
                    ]
                },
                {
                    name: "lesioni della colonna",
                    exercises: [
                        ExerciseFactory.multipleChoice({
                            question: "Qual è la cosa da non fare in caso di trauma di colonna?",
                            options: [
                                "Immobilizzare il rachide",
                                "Far camminare il paziente",
                                "Chiedere al paziente di non muoversi"
                            ],
                            answerId: 1
                        }),
                        ExerciseFactory.flashcard({
                            front: "Qual è la posizione più indicata in caso di sospetta lesione spinale?",
                            back: "Supina con immobilizzazione manuale del rachide e collare cervicale.",
                        }),
                    ]
                },
                {
                    name: "lesioni delle parti molli e ossee",
                    exercises: [
                        ExerciseFactory.trueFalse({
                            prompt: "Le fratture esposte sono meno gravi delle fratture chiuse",
                            answer: false,
                        }),
                        ExerciseFactory.fillIn({
                            sentence: "In caso di frattura esposta bisogna ... l'osso e coprire la ferita con garze sterili.",
                            correctWords: "non riposizionare",
                        }),
                        ExerciseFactory.multipleChoice({
                            question: "Qual è la priorità in caso di emorragia importante da una ferita?",
                            options: [
                                "Applicare un laccio emostatico",
                                "Applicare compressione diretta",
                                "Attendere i soccorsi avanzati",
                            ],
                            answerId: 1,
                        }),
                    ],
                },
                {
                    name: "trauma cranico",
                    exercises: [
                        ExerciseFactory.trueFalse({
                            prompt: "Un trauma cranico lieve non necessita mai di valutazione ospedaliera",
                            answer: false,
                        }),
                        ExerciseFactory.fillIn({
                            sentence: "In caso di trauma cranico con perdita di coscienza si sospetta una ...",
                            correctWords: "commozione cerebrale",
                        }),
                        ExerciseFactory.flashcard({
                            front: "Qual è il segno più grave in un trauma cranico?",
                            back: "Perdita di coscienza prolungata o segni neurologici focali.",
                        }),
                    ],
                },
                {
                    name: "lesioni dell'addome",
                    exercises: [
                        ExerciseFactory.trueFalse({
                            prompt: "Il trauma addominale chiuso può provocare emorragie interne non visibili.",
                            answer: true,
                        }),
                        ExerciseFactory.fillIn({
                            sentence: "In caso di eviscerazione bisogna coprire le anse intestinali con ...",
                            correctWords: "garze sterili umidificate",
                        }),
                        ExerciseFactory.multipleChoice({
                            question: "Qual è un segno tipico di trauma addominale grave?",
                            options: [
                                "Dolore localizzato e contrattura di difesa",
                                "Pallore e sudorazione fredda",
                                "Entrambi i precedenti",
                            ],
                            answerId: 2,
                        }),
                    ],
                },
                {
                    name: "trauma in casi particolari",
                    exercises: [
                        ExerciseFactory.flashcard({
                            front: "Cosa va considerato in un trauma in gravidanza?",
                            back: "La priorità è la madre; il feto viene valutato successivamente.",
                        }),
                        ExerciseFactory.multipleChoice({
                            question: "Cosa bisogna valutare in un trauma pediatrico?",
                            options: [
                                "Peso e dimensioni ridotte che influenzano l’energia del trauma",
                                "Nessuna differenza rispetto all’adulto",
                                "Solo la frequenza cardiaca",
                            ],
                            answerId: 0,
                        }),
                    ],
                },
                {
                    name: "skills",
                    exercises: [
                        ExerciseFactory.steps({
                            procedureName: "Collare Cervicale",
                            steps: [
                                "Immobilizzare capo in posizione neutra",
                                "Presentarsi al paziente e spiegare manovra",
                                "Liberare il collo da impedimenti e ispezionare il collo",
                                "Misurare con le dita affiancate la distanza tra il mento ed il margine superiore del muscolo trapezio (base del collo)",
                                "Identificare il collare della misura adeguata rapportando la misura con la parte laterale del collare",
                                "Afferrare con la mano la parte anteriore del collare piegandola leggermente su se stessa",
                                "Posizionare la parte anteriore facendola scivolare sino ad appoggiarsi alla parte inferiore della mandibola",
                                "Fissare la parte antariore con il velcro senza ruotare il collo",
                                "Posizionare la parte posteriore",
                                "Stringere il velcro applicando trazione di eguale forza da entrambi i lati in contemporanea",
                                "Posizionare uno spessore adeguato sotto al nuca (se necessario)",
                                "Far continuare il mantenimento dell'immobilizzazione manuale al secondo soccorritore",
                            ]
                        }),
                        ExerciseFactory.steps({
                            procedureName: "Rimozione Casco Integrale",
                            steps: [
                                "Immobilizzare il capo",
                                "Chiamare il paziente, aprire la visiera, presentarsi e spiegare la manovra",
                                "Rimuovere oggetti mobili non conficcati (occhiali, auricolari, etc.)",
                                "Far raggiungere e mantenere posizione neutra del capo, mentre si allineano gli arti del paziente (se necessario)",
                                "Slacciare o tagliare il cinturino, controllare il collo",
                                "Inserire una mano sotto il casco e afferrare la nuca (gomito e avambraccio appoggiato a terra)",
                                "Posizionare delicatamente l'avambraccio sul torace e afferrare la mandibola con pollice e indice",
                                "Il 2° soccorritore afferra i lati del casco con il cinturino, li allarga, bascula il casco all'indietro ed inizia a sfilarlo",
                                "Quando è visibile il naso, avvisa il 1° soccorritore di tenersi pronto e sfila il casco",
                                "Il 1° soccorritore mantiene stabile il capo (attenzione alla mano sulla nuca che si sposta sorreggendo il capo) doppo l'estrazione completa del casco",
                                "Il 2° soccorritore afferra il capo e lo immobilizza in posizione neutra",
                                "Dare indicazione di posizionare il collare cervicale (previa ulteriore valutazione del collo)"
                            ]
                        }),
                        ExerciseFactory.steps({
                            procedureName: "Pronosupinazione",
                            steps: [
                                "Far immobilizzare manualmente il capo, in posizione già pronta per la rotazione al 1° soccorritore, si presenta al paziente, gli spiega la manovra (2° soccorritore)",
                                "Allineare gli arti superiori lungo l'asse del corpo e gli arti inferiori avvicinandoli tra loro senza effettuare rotazioni o trazioni anomale",
                                "Inginocchiarsi a lato del paziente posizionando le mani all'altezza della spalla e del bacino contenendo il polso del paziente",
                                "Il 3° soccorritore si posiziona a lato del paziente, cno la mano a livello del torace incrociando il braccio con quello del 2° soccorritore e l'altra mano a livello del femore poco sopra l'articolazione del ginocchio",
                                "Il 1° soccorritore (alla testa) dà il via alla manovra di rotazione del paziente di 90ç gradi (sul fianco); la testa va portata in posizione neutra",
                                "Il 2° soccorritore cambia orientamento delle mani; sposta la mano dalla spalla al centro del dorso posteriormente e la mano dal bacino lungo il tronco anteriormente",
                                "Il 3° soccorritore cambia orientamento delle mani; sposta la mano dal torace al centro del ratto lombo-sacrale posteriormente e la mano sul fermore lungo il acino anteriormente",
                                "Al via del 1° soccorritore si porta il paziente in posizione supina mantenendo la colonna vertebrale allineata"
                            ]
                        })
                    ],
                },
            ],
        },
        {
            name: "emergenze mediche",
            subchapters: [
                {
                    name: "patologie cardio vascolari",
                    exercises: [
                        ExerciseFactory.trueFalse({
                            prompt: "Il dolore toracico da infarto è sempre alleviato dal riposo.",
                            answer: false,
                        }),
                        ExerciseFactory.fillIn({
                            sentence: "Il ritmo cardiaco assente richiede l’inizio immediato del ...",
                            correctWords: "massaggio cardiaco",
                        }),
                        ExerciseFactory.flashcard({
                            front: "Qual è la differenza tra angina stabile e infarto?",
                            back: "L’angina stabile regredisce con il riposo, l’infarto no.",
                        }),
                    ],
                },
                {
                    name: "patologie mediche",
                    exercises: [
                        ExerciseFactory.multipleChoice({
                            question: "Quale sintomo è tipico dell’ipoglicemia?",
                            options: [
                                "Sudorazione fredda e tremori",
                                "Pelle calda e secca",
                                "Respiro profondo e lento",
                            ],
                            answerId: 0,
                        }),
                        ExerciseFactory.fillIn({
                            sentence: "La crisi epilettica generalizzata comporta perdita di ...",
                            correctWords: "coscienza",
                        }),
                    ],
                },
                {
                    name: "urgenze pediatriche",
                    exercises: [
                        ExerciseFactory.flashcard({
                            front: "Qual è la priorità nel trattamento di un bambino con febbre alta?",
                            back: "Escludere segni di compromissione neurologica o difficoltà respiratoria.",
                        }),
                        ExerciseFactory.trueFalse({
                            prompt: "Nei bambini la frequenza cardiaca è normalmente più bassa che negli adulti.",
                            answer: false,
                        }),
                    ],
                },
            ],
        },
        {
            name: "Urgenze Ostetriche e Ginecologiche",
            exercises: [
                ExerciseFactory.fillIn({
                    sentence: "In caso di parto imminente bisogna preparare un ambiente ... e sicuro.",
                    correctWords: "pulito",
                }),
                ExerciseFactory.multipleChoice({
                    question: "Qual è la posizione corretta per assistere una partoriente?",
                    options: ["Supina con gambe tese", "Semiseduta o litotomica", "Laterale destra"],
                    answerId: 1,
                }),
            ],
        },
        {
            name: "Emergenze Ambientali",
            subchapters: [
                {
                    name: "Temperatura",
                    exercises: [
                        ExerciseFactory.trueFalse({
                            prompt: "L’ipotermia grave è definita da una temperatura corporea inferiore a 35°C.",
                            answer: true,
                        }),
                        ExerciseFactory.flashcard({
                            front: "Qual è il trattamento iniziale per un colpo di calore?",
                            back: "Raffreddamento rapido e rimozione dagli ambienti caldi.",
                        }),
                    ],
                },
                {
                    name: "Ambiente acquatico",
                    exercises: [
                        ExerciseFactory.multipleChoice({
                            question: "Qual è la priorità in caso di annegamento?",
                            options: [
                                "Controllo del polso",
                                "Sicurezza della scena e rimozione dall’acqua",
                                "Applicazione immediata del DAE",
                            ],
                            answerId: 1,
                        }),
                    ],
                },
            ],
        },
        {
            name: "Trattamento Primario",
            subchapters: [
                {
                    name: "BLSD",
                    exercises: [
                        ExerciseFactory.fillIn({
                            sentence: "La sequenza BLSD inizia sempre con la verifica della ...",
                            correctWords: "sicurezza della scena",
                        }),
                        ExerciseFactory.flashcard({
                            front: "Quando va utilizzato il DAE?",
                            back: "Appena disponibile, dopo aver iniziato la RCP.",
                        }),
                    ],
                },
                {
                    name: "PBLSD",
                    exercises: [
                        ExerciseFactory.trueFalse({
                            prompt: "Nel PBLSD le compressioni si eseguono con due dita nel lattante.",
                            answer: true,
                        }),
                    ],
                },
                {
                    name: "Ostruzione vie aeree adulto",
                    exercises: [
                        ExerciseFactory.flashcard({
                            front: "Qual è la manovra indicata in caso di ostruzione totale?",
                            back: "Manovra di Heimlich.",
                        }),
                    ],
                },
                {
                    name: "Ostruzione vie aeree pediatriche",
                    exercises: [
                        ExerciseFactory.multipleChoice({
                            question: "Qual è la sequenza in un bambino con ostruzione completa?",
                            options: [
                                "5 pacche dorsali + 5 compressioni toraciche",
                                "Solo Heimlich",
                                "Ventilazioni forzate",
                            ],
                            answerId: 0,
                        }),
                    ],
                },
            ],
        },
        {
            name: "Aspetti psicologici",
            exercises: [
                ExerciseFactory.trueFalse({
                    prompt: "Il soccorritore deve mantenere sempre un atteggiamento empatico e calmo.",
                    answer: true,
                }),
                ExerciseFactory.flashcard({
                    front: "Come si definisce lo stress da soccorso?",
                    back: "Reazione emotiva e fisiologica a situazioni di emergenza ripetute o traumatiche.",
                }),
            ],
        },
        {
            name: "Operazioni in ambulanza",
            subchapters: [
                {
                    name: "Compilazione relazione di soccorso",
                    exercises: [
                        ExerciseFactory.fillIn({
                            sentence: "La relazione di soccorso deve essere ... e leggibile.",
                            correctWords: "completa",
                        }),
                        ExerciseFactory.flashcard({
                            front: "Quali dati sono essenziali nella relazione?",
                            back: (
                                <ul>
                                    <li>Dati anagrafici del paziente</li>
                                    <li>Ora di intervento</li>
                                    <li>Parametri vitali</li>
                                </ul>
                            ),
                        }),
                    ],
                },
                {
                    name: "Operazioni in ambulanza",
                    exercises: [
                        ExerciseFactory.trueFalse({
                            prompt: "Durante la guida in emergenza non valgono le regole del codice della strada.",
                            answer: false,
                        }),
                    ],
                },
            ],
        },
        {
            name: "Maxiemergenza",
            subchapters: [
                {
                    name: "Gestione maxi emergenza",
                    exercises: [
                        ExerciseFactory.flashcard({
                            front: "Cosa si intende per maxi emergenza?",
                            back: "Evento con numero di vittime superiore alla capacità di risposta dei soccorsi.",
                        }),
                    ],
                },
                {
                    name: "Ruolo del MSB, triage e codici colore",
                    exercises: [
                        ExerciseFactory.multipleChoice({
                            question: "Cosa indica il codice rosso?",
                            options: [
                                "Paziente stabile",
                                "Paziente in pericolo di vita",
                                "Paziente deceduto",
                            ],
                            answerId: 1,
                        }),
                    ],
                },
                {
                    name: "Aspetti psicologici nelle maxi emergenze",
                    exercises: [
                        ExerciseFactory.flashcard({
                            front: "Qual è la reazione più comune nei soccorritori dopo una maxi emergenza?",
                            back: "Stress acuto o trauma da esposizione.",
                        }),
                    ],
                },
            ],
        },
    ],
});

export const ts = new Course({
    name: "Trasporto Semplice",
    acronym: "TS",
    chapters: [
        {
            name: "Modulo B",
            subchapters: [
                {
                    name: "Normativa, Ruolo e Responsabilità"
                }
            ]
        },
        {
            name: "Modulo C",
            subchapters: [
                {
                    name: "Cenni di Anatomia e Fisiologia",
                },
                {
                    name: "Rilevazione dei Parametri Vitali",
                },
                {
                    name: "Valutazione Primaria del Paziente",
                },
                {
                    name: "Rilevazione dei Parametri",
                },
            ]
        },
        {
            name: "Modulo D",
            subchapters: [
                {
                    name: "Caratteristiche del Paziente da Assistere e Trasportare"
                }
            ]
        },
        {
            name: "Modulo E",
            subchapters: [
                {
                    name: "Approccio Psicologico e Relazionale con le Persone Malate"
                }
            ]
        },
        {
            name: "Modulo F",
            subchapters: [
                {
                    name: "Tecniche Assistenziali di Approccio al Paziente"
                }
            ]
        },
        {
            name: "Modulo G",
            subchapters: [
                {
                    name: "BLSD",
                },
                {
                    name: "Ostruzione delle Vie Aeree"
                }
            ]
        },
        {
            name: "Modulo I",
            subchapters: [
                {
                    name: "Trasporto in Ambulanza",
                },
            ]
        }
    ]
})
    

export const courses = [
    sse,
    ts
]
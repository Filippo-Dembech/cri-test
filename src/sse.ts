import type { Course } from "./courses";
import { ExerciseFactory } from "./exercises";

export const sse: Course = {
    name: "Soccorso Sanitario Extraospedaliero",
    chapters: [
        {
            name: "Eventi Medici",
            exercises: [
                ExerciseFactory.trueFalse({
                    question: "Un paziente con 30bpm di FC è tachicardico",
                    answer: false,
                }),
                ExerciseFactory.trueFalse({
                    question: "Un paziente con 200bpm di FC è tachicardico",
                    answer: true,
                }),
                ExerciseFactory.trueFalse({
                    question: "Un paziente che ha subito un trauma può essere spostato con il telo portaferiti",
                    answer: false,
                }),
                ExerciseFactory.fillIn({
                    sentence: "Un paziente con 40 FR è detto ...",
                    correctWords: "tachipnoico"
                }),
                ExerciseFactory.fillIn({
                    sentence: ""
                }),
                ExerciseFactory.steps({
                    prompt: "Quali sono le domande da fare per analizzare il dolore addominale?",
                    steps
                })
            ],
        },
    ],
};

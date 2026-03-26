export type Color = "green" | "yellow" | "red";
export type ExerciseType = "scenario" | "next-step" | "what-if";

export interface Scenario {
    id: string;
    type: ExerciseType;
    vignette: string;       // what the user reads
    hint?: string;          // shown after first wrong attempt
    correctAnswer: Color;
    options: Color[];       // always 2–3 choices
    explanation: string;    // shown after answering
    path: string[];         // the logical steps, shown in recap
}
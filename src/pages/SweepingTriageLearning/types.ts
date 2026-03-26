export type ColorCode = "green" | "yellow" | "red";
export type ExerciseType = "scenario" | "next-step" | "what-if";

export interface ScenarioType {
    id: string;
    type: ExerciseType;
    vignette: string;       // what the user reads
    hint?: string;          // shown after first wrong attempt
    correctAnswer: ColorCode;
    options: ColorCode[];       // always 2–3 choices
    explanation: string;    // shown after answering
    path: string[];         // the logical steps, shown in recap
}
import type { ReactNode } from "react";

export interface TrueFalseData {
    prompt: string;
    answer: boolean;
}

export interface FillInData {
    sentence: string;
    correctWords: string;
}

export interface ReorderData {
    prompt: string;
    steps: string[];
    correctOrder: number[];
}

export interface MultipleChoiceData {
    question: string;
    options: string[];
    answerId: number;
}

export interface StepsData {
    steps: string[];
}

export interface CategorizeData {
    givenValue: string;
    rangeOptions: string[];
    categorization: string;
}

export interface TerminologyData {
    definition: string;
    answer: string;
}

export interface FlashcardData {
    front: string;
    back: ReactNode;
}

export interface Exercise {
    id?: number;
    courseId?: number;
    chapterId?: number;
    type: "true-false" | "fill-in" | "steps" | "multiple-choice" | "terminology" | "reorder" | "categorize" | "flashcard"
    data: object;
}


export class ExerciseFactory {
    static trueFalse(data: TrueFalseData): Exercise {
        return {
            type: "true-false",
            data
        };
    }
    static multipleChoice(data: MultipleChoiceData): Exercise {
        return {
            type: "multiple-choice",
            data
        };
    }

    static terminology(data: TerminologyData): Exercise {
        return {
            type: "terminology",
            data
        };
    }

    static fillIn(data: FillInData): Exercise {
        return {
            type: "fill-in",
            data
        };
    }
    static steps(data: StepsData): Exercise {
        return {
            type: "steps",
            data
        };
    }

    static reorder(data: ReorderData): Exercise {
        return {
            type: "reorder",
            data
        };
    }

    static categorize(data: CategorizeData): Exercise {
        return {
            type: "categorize",
            data
        };
    }
    static flashcard(data: FlashcardData): Exercise {
        return {
            type: "flashcard",
            data
        }
    }
}

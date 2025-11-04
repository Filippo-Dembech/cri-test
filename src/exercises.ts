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

export type ExerciseType = 
        | "true-false"
        | "fill-in"
        | "steps"
        | "multiple-choice"
        | "terminology"
        | "reorder"
        | "categorize"
        | "flashcard";

export interface ExerciseData {
    type: ExerciseType;
    data: object    
}

export class Exercise {
    private static id = 0;
    
    public id: number;
    public courseId: number;
    public chapterId: number;
    public type: ExerciseType;
    public data: object;

    constructor(
        courseId: number,
        chapterId: number,
        type: ExerciseType,
        data: object,
    ) {
        this.id = Exercise.id++;
        this.courseId = courseId;
        this.chapterId = chapterId;
        this.type = type;
        this.data = data;
    }
}

export class ExerciseFactory {

    static trueFalse(data: TrueFalseData): ExerciseData {
        return {
            type: "true-false",
            data,
        };
    }
    static multipleChoice(data: MultipleChoiceData):ExerciseData {
        return {
            type: "multiple-choice",
            data,
        };
    }

    static terminology(data: TerminologyData): ExerciseData {
        return {
            type: "terminology",
            data,
        };
    }

    static fillIn(data: FillInData): ExerciseData {
        return {
            type: "fill-in",
            data,
        };
    }
    static steps(data: StepsData): ExerciseData {
        return {
            type: "steps",
            data,
        };
    }

    static reorder(data: ReorderData): ExerciseData {
        return {
            type: "reorder",
            data,
        };
    }

    static categorize(data: CategorizeData): ExerciseData {
        return {
            type: "categorize",
            data,
        };
    }
    static flashcard(data: FlashcardData): ExerciseData {
        return {
            type: "flashcard",
            data,
        };
    }
}

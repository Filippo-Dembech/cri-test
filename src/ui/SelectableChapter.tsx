import { useState, type CSSProperties } from "react";
import type { Chapter } from "../courses";
import { type ExerciseType, type Exercise } from "../exercises";
import { usePractice } from "../context/PracticeContext";

interface ExerciseTypeFlagProps {
    isChecked?: boolean;
    onCheck: () => void;
    text: string;
}

function ExerciseTypeFlag({ isChecked, onCheck, text }: ExerciseTypeFlagProps) {
    return (
        <label className="inline-flex items-center">
            <input
                className="accent-red-500 mr-2"
                type="checkbox"
                checked={isChecked}
                onChange={onCheck}
            />
            <span>{text}</span>
        </label>
    );
}

interface SelectableChapterProps {
    chapter: Chapter;
    style?: CSSProperties;
}

export default function SelectableChapter({
    chapter,
    style,
}: SelectableChapterProps) {
    const { exercises, addExercise, removeExercise } = usePractice();

    const hasExercisesInPractice = (
        chapter: Chapter,
        exercises: Exercise[]
    ): boolean | undefined => {
        const hasOwn = exercises.some((ex) => ex.chapterId === chapter.id);
        const hasSubs = chapter.subchapters?.some((sub) =>
            hasExercisesInPractice(sub, exercises)
        );
        return hasOwn || hasSubs;
    };

    const isChecked = hasExercisesInPractice(chapter, exercises);
    const [choosenExerciseTypes, setChoosenExerciseTypes] = useState<
        ExerciseType[]
    >([]);

    function toggleExerciseType(exerciseType: ExerciseType) {
        const isExerciseTypePresent = choosenExerciseTypes.some(
            (choosenExerciseType) => choosenExerciseType === exerciseType
        );
        if (isExerciseTypePresent) {
            setChoosenExerciseTypes((exTypes) =>
                exTypes.filter((exType) => exType !== exerciseType)
            );
            getAllExercisesOf(chapter).forEach((exercise) => {
                if (exercise.type === exerciseType) removeExercise(exercise);
            });
        } else {
            setChoosenExerciseTypes((exTypes) => [...exTypes, exerciseType]);
            getAllExercisesOf(chapter).forEach((exercise) => {
                if (exercise.type === exerciseType) addExercise(exercise);
            });
        }
    }

    function hasExerciseType(chapter: Chapter, exerciseType: ExerciseType): boolean {
        // Check exercises in current chapter
        const foundHere = exercises.some(
            (exercise) =>
                exercise.chapterId === chapter.id &&
                exercise.type === exerciseType
        );

        if (foundHere) return true;

        // Recursively check subchapters
        return (
            chapter.subchapters?.some((sub) =>
                hasExerciseType(sub, exerciseType)
            ) ?? false
        );
    }

    function getAllExercisesOf(chapter: Chapter): Exercise[] {
        const currentExercises = chapter.exercises ?? [];
        const subExercises =
            chapter.subchapters?.flatMap((sub) => getAllExercisesOf(sub)) ?? [];
        return [...currentExercises, ...subExercises];
    }

    return (
        <div className="select-none">
            <details className="max-w-200">
                <summary>
                    <label
                        style={style}
                        className="flex gap-3 text-[1rem] font-bold items-center md:text-xl bg-slate-200 p-2 rounded-2xl mt-3 cursor-pointer"
                        htmlFor={chapter.name}
                    >
                        <input
                            type="checkbox"
                            className="accent-red-500"
                            checked={isChecked}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    if (choosenExerciseTypes.length === 0)
                                        getAllExercisesOf(chapter).forEach(
                                            addExercise
                                        );
                                    else
                                        getAllExercisesOf(chapter).forEach(
                                            (exercise) => {
                                                if (
                                                    !choosenExerciseTypes.includes(
                                                        exercise.type
                                                    )
                                                )
                                                    return;
                                                addExercise(exercise);
                                            }
                                        );
                                } else {
                                    getAllExercisesOf(chapter).forEach(
                                        removeExercise
                                    );
                                }
                            }}
                            name={chapter.name}
                            id={chapter.name}
                        />
                        {chapter.name}
                    </label>
                </summary>

                <div
                    style={style}
                    className="inline-flex gap-3 bg-red-100 px-3 py-1 rounded-lg translate-x-6 mt-1 text-sm flex-col my-4 md:flex-row md:my-0"
                >
                    <ExerciseTypeFlag
                        text="Vero/Falso"
                        isChecked={hasExerciseType(chapter, "true-false")}
                        onCheck={() => toggleExerciseType("true-false")}
                    />
                    <ExerciseTypeFlag
                        text="Scelta Multipla"
                        isChecked={hasExerciseType(chapter, "multiple-choice")}
                        onCheck={() => toggleExerciseType("multiple-choice")}
                    />
                    <ExerciseTypeFlag
                        text="Completa"
                        isChecked={hasExerciseType(chapter, "fill-in")}
                        onCheck={() => toggleExerciseType("fill-in")}
                    />
                    <ExerciseTypeFlag
                        text="Terminologia"
                        isChecked={hasExerciseType(chapter, "terminology")}
                        onCheck={() => toggleExerciseType("terminology")}
                    />
                    <ExerciseTypeFlag
                        text="Steps"
                        isChecked={hasExerciseType(chapter, "steps")}
                        onCheck={() => toggleExerciseType("steps")}
                    />
                    <ExerciseTypeFlag
                        text="Flashcard"
                        isChecked={hasExerciseType(chapter, "flashcard")}
                        onCheck={() => toggleExerciseType("flashcard")}
                    />
                </div>
            </details>
        </div>
    );
}

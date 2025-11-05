import { useCallback, useEffect, useState, type CSSProperties } from "react";
import type { Chapter } from "../courses";
import { type ExerciseType, type Exercise } from "../exercises";
import { usePractice } from "../context/PracticeContext";

interface SelectableChapterProps {
    chapter: Chapter;
    style?: CSSProperties;
}

export default function SelectableChapter({
    chapter,
    style,
}: SelectableChapterProps) {
    const { exercises, addExercise, removeExercise } = usePractice();
    const [isChecked, setIsChecked] = useState(
        () =>
            chapter.subchapters?.some((subchapter) =>
                exercises.some(
                    (exercise) => exercise.chapterId === subchapter.id
                )
            ) || false
    );
    const hasExercisePractice = exercises.some(
        (exercise) => exercise.chapterId === chapter.id
    );
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
            getAllExercisesOf(chapter).forEach(exercise => {
                if (exercise.type === exerciseType) removeExercise(exercise)
            })
        } else {
            setChoosenExerciseTypes((exTypes) => [...exTypes, exerciseType]);
            getAllExercisesOf(chapter).forEach(exercise => {
                if (exercise.type === exerciseType) addExercise(exercise);
            })
        }
    }

    function toggle() {
        setIsChecked((curr) => !curr);
    }

    // helper: get all exercises recursively
    const getAllExercisesOf = useCallback((chapter: Chapter): Exercise[] => {
        const currentExercises = chapter.exercises ?? [];
        const subExercises =
            chapter.subchapters?.flatMap((sub) => getAllExercisesOf(sub)) ?? [];
        return [...currentExercises, ...subExercises];
    }, []);

    useEffect(() => {
        if (hasExercisePractice) {
            setIsChecked(true);
        }
        if (
            !hasExercisePractice &&
            chapter.exercises &&
            chapter.exercises.length > 0
        ) {
            setIsChecked(false);
        }
    }, [isChecked, setIsChecked, hasExercisePractice, chapter]);

    return (
        <div>
            <label
                style={style}
                className="flex gap-3 text-xl"
                htmlFor={chapter.name}
            >
                <input
                    type="checkbox"
                    className="accent-red-500"
                    checked={hasExercisePractice || isChecked}
                    onChange={(e) => {
                        toggle();
                        if (e.target.checked) {
                            if (choosenExerciseTypes.length === 0)
                                getAllExercisesOf(chapter).forEach(addExercise);
                            else 
                                getAllExercisesOf(chapter).forEach(exercise => {
                                    if (!choosenExerciseTypes.includes(exercise.type)) return
                                    addExercise(exercise)
                                });
                        } else {
                            getAllExercisesOf(chapter).forEach(removeExercise);
                        }
                    }}
                    name={chapter.name}
                    id={chapter.name}
                />
                {chapter.name}
            </label>
            <div
                style={style}
                className="flex gap-3 bg-red-100 px-2 py-1 rounded-lg"
            >
                <label>
                    <input
                        className="accent-red-500 mr-2"
                        type="checkbox"
                        onChange={() => toggleExerciseType("true-false")}
                    />
                    <span>Vero/Falso</span>
                </label>
                <label>
                    <input
                        className="accent-red-500 mr-2"
                        type="checkbox"
                        onChange={() => toggleExerciseType("multiple-choice")}
                    />
                    <span>Scelta Multipla</span>
                </label>
                <label>
                    <input
                        className="accent-red-500 mr-2"
                        type="checkbox"
                        onChange={() => toggleExerciseType("fill-in")}
                    />
                    <span>Completa</span>
                </label>
                <label>
                    <input
                        className="accent-red-500 mr-2"
                        type="checkbox"
                        onChange={() => toggleExerciseType("terminology")}
                    />
                    <span>Terminologia</span>
                </label>
                <label>
                    <input
                        className="accent-red-500 mr-2"
                        type="checkbox"
                        onChange={() => toggleExerciseType("steps")}
                    />
                    <span>Steps</span>
                </label>
                <label>
                    <input
                        className="accent-red-500 mr-2"
                        type="checkbox"
                        onChange={() => toggleExerciseType("flashcard")}
                    />
                    <span>Flashcard</span>
                </label>
            </div>
        </div>
    );
}

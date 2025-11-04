import { useCallback, useEffect, useState, type CSSProperties } from "react";
import type { Chapter } from "../courses";
import type { Exercise } from "../exercises";
import { usePractice } from "../context/PracticeContext";

interface SelectableChapterProps {
    chapter: Chapter;
    style?: CSSProperties;
}

export default function SelectableChapter({
    chapter,
    style,
}: SelectableChapterProps) {
    
    const [isChecked, setIsChecked] = useState(false);
    const { exercises, addExercise, removeExercise } = usePractice();
    const hasExercisePractice = exercises.some(exercise => exercise.chapterId === chapter.id);
    
    function toggle() {
        setIsChecked(curr => !curr);
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
        if (!hasExercisePractice && chapter.exercises && chapter.exercises.length > 0) {
            setIsChecked(false);
        }
    }, [isChecked, setIsChecked, hasExercisePractice, chapter])

    return (
        <div>
            <label
                style={style}
                className="flex gap-3"
                htmlFor={chapter.name}
            >
                <input
                    type="checkbox"
                    className="accent-red-500"
                    checked={hasExercisePractice || isChecked}
                    onChange={(e) => {
                        toggle();
                        if (e.target.checked) {
                            getAllExercisesOf(chapter).forEach(addExercise)
                        } else {
                            getAllExercisesOf(chapter).forEach(removeExercise);
                        }
                    }}
                    name={chapter.name}
                    id={chapter.name}
                />
                {chapter.name}
            </label>
        </div>
    );
}

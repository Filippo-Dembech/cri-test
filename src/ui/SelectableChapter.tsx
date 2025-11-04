import { type CSSProperties } from "react";
import type { CourseChapter } from "../courses";

interface SelectableChapterProps {
    chapter: CourseChapter;
    style?: CSSProperties;
}

export default function SelectableChapter({
    chapter,
    style,
}: SelectableChapterProps) {

    // helper: get all exercises recursively
    // const getAllExercisesOf = useCallback((chapter: CourseChapter): Exercise[] => {
    //     const currentExercises = chapter.exercises ?? [];
    //     const subExercises =
    //         chapter.subchapters?.flatMap((sub) => getAllExercisesOf(sub)) ?? [];
    //     return [...currentExercises, ...subExercises];
    // }, []);

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
                    checked={undefined}
                    onChange={() => {}}
                    name={chapter.name}
                    id={chapter.name}
                />
                {chapter.name}
            </label>
        </div>
    );
}

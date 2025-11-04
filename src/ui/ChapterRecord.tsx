import type { Chapter } from "../courses";
import SelectableChapter from "./SelectableChapter";

interface ChapterRecordProps {
    chapter: Chapter;
    level?: number;
}

export default function ChapterRecord({ chapter, level = 0 }: ChapterRecordProps) {

    return (
        <>
            <SelectableChapter
                style={{ marginLeft: level * 20 }}
                chapter={chapter}
            />
            {chapter.subchapters?.map((subchapter, i) => (
                <ChapterRecord
                    key={`${subchapter.id}-${i}`}
                    level={level + 1}
                    chapter={subchapter}
                />
            ))}
        </>
    );
}
import ChapterRecord from "../ui/ChapterRecord";
import PracticeRecapButton from "../ui/PracticeRecapButton";
import Title from "../ui/Title";
import { courses } from "../courses";
import Background from "../ui/Background";

export default function SSETheory() {
    
    return (
        <div>
            <Title h={1}>Teoria SSE</Title>
            <Background />
            <div className="mb-3">
                {courses.find(course => course.acronym === "SSE")?.chapters.map((chapter) => (
                    <ChapterRecord chapter={chapter} />
                ))}
            </div>
            <PracticeRecapButton />
        </div>
    );
}


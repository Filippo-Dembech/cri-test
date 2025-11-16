import { useParams } from "react-router-dom";
import ChapterRecord from "../ui/ChapterRecord";
import PracticeRecapButton from "../ui/PracticeRecapButton";
import Title from "../ui/Title";
import { courses } from "../courses";
import Background from "../ui/Background";

export default function TheoryPage() {
    
    const { course } = useParams();

    const pickedCourse = courses.find(c => c.acronym === course)!;
    
    return (
        <div>
            <Title h={1}>{pickedCourse.name.toUpperCase()}</Title>
            <Background />
            <div className="mb-3">
                {pickedCourse.chapters.map((chapter) => (
                    <ChapterRecord chapter={chapter} />
                ))}
            </div>
            <PracticeRecapButton />
        </div>
    );
}

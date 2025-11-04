import ChapterRecord from "../ui/ChapterRecord";
import { sse } from "../sse";
import PracticeRecapButton from "../ui/PracticeRecapButton";

export default function SsePage() {
    return (
        <div>
            <h1 className="text-6xl">SSE</h1>
            <div>
                <h2>Index</h2>
                <div>
                    {sse.chapters.map((chapter) => (
                        <ChapterRecord chapter={chapter} />
                    ))}
                </div>
                <PracticeRecapButton />
            </div>
        </div>
    );
}

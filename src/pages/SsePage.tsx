import ChapterRecord from "../ui/ChapterRecord";
import { sse } from "../sse";
import PracticeRecapButton from "../ui/PracticeRecapButton";
import Button from "../ui/Button";
import { Link } from "react-router-dom";

export default function SsePage() {
    return (
        <div>
            <h1 className="text-6xl">SSE</h1>
            <div>
                <h2>Index</h2>
                <div className="mb-3">
                    {sse.chapters.map((chapter) => (
                        <ChapterRecord chapter={chapter} />
                    ))}
                </div>
                <div>
                    <Link to="/parameters-game"><Button>Pratica Parametri</Button></Link>
                </div>
                <PracticeRecapButton />
            </div>
        </div>
    );
}

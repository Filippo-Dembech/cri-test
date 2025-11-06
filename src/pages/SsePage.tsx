import ChapterRecord from "../ui/ChapterRecord";
import { sse } from "../sse";
import PracticeRecapButton from "../ui/PracticeRecapButton";
import Button from "../ui/Button";
import { Link } from "react-router-dom";
import Title from "../ui/Title";

export default function SsePage() {
    return (
        <div>
            <Title h={1}>SSE</Title>
            <div>
                <div className="flex gap-3 my-4">
                    <Link to="/parameters-practice"><Button>Pratica Parametri</Button></Link>
                    <Link to="/terminology-practice"><Button>Pratica Terminologia</Button></Link>
                    <Link to="/skills-practice"><Button>Pratica Skills</Button></Link>
                    <Link to="/analyze-practice"><Button>Pratica Domande di Rito</Button></Link>
                    <Link to="/disease-practice"><Button>Pratica Patologie</Button></Link>
                </div>
                <div className="mb-3">
                    {sse.chapters.map((chapter) => (
                        <ChapterRecord chapter={chapter} />
                    ))}
                </div>
                <PracticeRecapButton />
            </div>
        </div>
    );
}

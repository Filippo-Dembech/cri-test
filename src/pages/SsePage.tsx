import ChapterRecord from "../ui/ChapterRecord";
import { sse } from "../sse";
import PracticeRecapButton from "../ui/PracticeRecapButton";
import Button from "../ui/Button";
import { Link } from "react-router-dom";

export default function SsePage() {
    return (
        <div>
            <h1 className="text-6xl">SSE</h1>
            <p>Opzioni di esercizi:</p>
            <ul>
                <li>- Selezionare cosa si vuole ripassare e poi scegliere come (e.g. vero/falso, scelta multipla, flashcards, ...)</li>
                <li>- Mettere tutti gli esercizi associati ad un singolo argomento, di diverse tipologie</li>
            </ul>
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

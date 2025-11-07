import { Link, useParams } from "react-router-dom";
import Title from "../ui/Title";
import Button from "../ui/Button";
import { courses } from "../courses";

export default function RecapPage() {
    const { course } = useParams();

    const pickedCourse = courses.find(c => c.acronym === course)!;

    return (
        <div>
            <Title h={1}>PRATICA {pickedCourse.name.toUpperCase()}</Title>
            <div className="flex gap-3 my-4">
                <Link to="/parameters-practice">
                    <Button>Pratica Parametri</Button>
                </Link>
                <Link to="/terminology-practice">
                    <Button>Pratica Terminologia</Button>
                </Link>
                <Link to="/skills-practice">
                    <Button>Pratica Skills</Button>
                </Link>
                <Link to="/analyze-practice">
                    <Button>Pratica Domande di Rito</Button>
                </Link>
                <Link to="/disease-practice">
                    <Button>Pratica Patologie</Button>
                </Link>
            </div>
        </div>
    );
}

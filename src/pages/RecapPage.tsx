import { Link, useParams } from "react-router-dom";
import Title from "../ui/Title";
import Button from "../ui/Button";
import { courses } from "../courses";
import Background from "../ui/Background";
import { FaAmbulance, FaBook, FaQuestionCircle, FaStethoscope } from "react-icons/fa";
import { MdSick } from "react-icons/md";

export default function RecapPage() {
    const { course } = useParams();

    const pickedCourse = courses.find((c) => c.acronym === course)!;

    return (
        <div>
            <Title h={1}>
                PRATICA{" "}
                {pickedCourse.acronym?.toUpperCase() ||
                    pickedCourse.name.toUpperCase()}
            </Title>
            <Background />
            <div className="flex flex-col gap-3 my-4 w-3/4 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
                <Link to="/parameters-practice">
                    <Button
                        outlined
                        icon={<FaStethoscope />}
                        style={{ width: "100%" }}
                    >
                        Pratica Parametri
                    </Button>
                </Link>
                <Link to="/terminology-practice">
                    <Button outlined icon={<FaBook/>} style={{ width: "100%" }}>
                        Pratica Terminologia
                    </Button>
                </Link>
                <Link to="/skills-practice">
                    <Button outlined icon={<FaAmbulance />} style={{ width: "100%" }}>Pratica Skills</Button>
                </Link>
                <Link to="/analyze-practice">
                    <Button outlined icon={<FaQuestionCircle />} style={{ width: "100%" }}>
                        Pratica Domande di Rito
                    </Button>
                </Link>
                <Link to="/disease-practice">
                    <Button outlined icon={<MdSick />} style={{ width: "100%" }}>Pratica Patologie</Button>
                </Link>
            </div>
        </div>
    );
}

import { Link } from "react-router-dom";
import Title from "../ui/Title";
import Button from "../ui/Button";
import Background from "../ui/Background";
import {
    FaAmbulance,
    FaBook,
    FaFlagCheckered,
    FaQuestionCircle,
    FaStethoscope,
    FaSyringe,
} from "react-icons/fa";
import { MdSick } from "react-icons/md";
import { SiO2 } from "react-icons/si";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { TbActivityHeartbeat } from "react-icons/tb";

export default function SSEPractice() {
    return (
        <div className="p-8">
            <Title h={1}>PRATICA SSE</Title>
            <Background />
            <div className="flex flex-col gap-3 my-4 w-3/4 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 max-w-150">
                <Link to="/parameters-practice">
                    <Button
                        outlined
                        icon={<FaStethoscope />}
                        style={{ width: "100%" }}
                    >
                        Parametri
                    </Button>
                </Link>
                <Link to="/terminology-practice">
                    <Button
                        outlined
                        icon={<FaBook />}
                        style={{ width: "100%" }}
                    >
                        Terminologia
                    </Button>
                </Link>
                <Link to="/skills-practice">
                    <Button
                        outlined
                        icon={<FaAmbulance />}
                        style={{ width: "100%" }}
                    >
                        Skills
                    </Button>
                </Link>
                <Link to="/analyze-practice">
                    <Button
                        outlined
                        icon={<FaQuestionCircle />}
                        style={{ width: "100%" }}
                    >
                        Domande di Rito
                    </Button>
                </Link>
                <Link to="/disease-practice">
                    <Button
                        outlined
                        icon={<MdSick />}
                        style={{ width: "100%" }}
                    >
                        Patologie
                    </Button>
                </Link>
                <Link to="/oxygen-practice">
                    <Button
                        outlined
                        icon={<SiO2 />}
                        style={{ width: "100%" }}
                    >
                        Ossigenoterapia
                    </Button>
                </Link>
                <Link to="/diagnostic-suspicion-score-practice">
                    <Button
                        outlined
                        icon={<FaMagnifyingGlass />}
                        style={{ width: "100%" }}
                    >
                        Indice di Sospetto
                    </Button>
                </Link>
                <Link to="/ecg-practice">
                    <Button
                        outlined
                        icon={<TbActivityHeartbeat />}
                        style={{ width: "100%" }}
                    >
                        ECG
                    </Button>
                </Link>
                <Link to="/blood-glucose-practice">
                    <Button
                        outlined
                        icon={<FaSyringe />}
                        style={{ width: "100%" }}
                    >
                        Glicemia
                    </Button>
                </Link>
                <Link to="/sweeping-triage-practice">
                    <Button
                        outlined
                        icon={<FaFlagCheckered />}
                        style={{ width: "100%" }}
                    >
                        Sweeping Triage
                    </Button>
                </Link>
            </div>
        </div>
    );
}

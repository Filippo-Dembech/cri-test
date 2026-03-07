import { Link } from "react-router-dom";
import Title from "../ui/Title";
import Button from "../ui/Button";
import Background from "../ui/Background";
import { IoSchool } from "react-icons/io5";
import { FaAmbulance } from "react-icons/fa";

export default function SSEPage() {
    return (
        <div>
            <Title h={1}>Soccorso Sanitario Extraospedaliero</Title>
            <Background />
            <div className="flex flex-col gap-4 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 max-w-100 w-full p-8">
                <Link to={`/corsi/SSE/teoria`}>
                    <Button icon={<IoSchool />}>Ripasso Teorico</Button>
                </Link>
                <Link to={`/corsi/SSE/pratica`}>
                    <Button icon={<FaAmbulance />}>Ripasso Pratico</Button>
                </Link>
            </div>
        </div>
    );
}

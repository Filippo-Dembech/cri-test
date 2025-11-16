import { Link } from "react-router-dom";
import { usePractice } from "../context/PracticeContext";

export default function PracticeRecapButton() {
    const { exercises } = usePractice();
    return (
        <Link
            to="/practice"
            className="bg-red-600 text-white py-3 px-6 rounded-3xl fixed bottom-6 right-10 flex flex-col cursor-pointer"
        >
            <span className="text-xl font-bold">Pratica</span>
            <span>({exercises.length} esercizi)</span>
        </Link>
    );
}

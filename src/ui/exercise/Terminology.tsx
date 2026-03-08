import { useState } from "react";
import type { TerminologyData } from "../../exercises";

export default function Terminology({definition, validAnswers}: TerminologyData) {
    const [givenAnswer, setGivenAnswer] = useState("");

    return (
        <div>
            <span className="mr-2">{definition}:</span>
            <input type="text" className="px-2 pb-1 border-2 border-red-200 rounded-lg"/>
        </div>
    )
}
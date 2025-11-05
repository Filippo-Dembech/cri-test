import { useState } from "react";
import type { FillInData } from "../../exercises";

export default function FillIn({sentence, correctWords}: FillInData) {
    const [givenAnswer, setGivenAnswer] = useState("");
    const [ firstPart, secondPart ] = sentence.split("...");
    return (
        <div>
            <span>{firstPart}</span>
            <input type="text" className="border-2 border-red-200 rounded-lg px-2 pb-1" onChange={(e) => setGivenAnswer(e.target.value)}/>
            <span>{secondPart}</span>
        </div>
    )
}
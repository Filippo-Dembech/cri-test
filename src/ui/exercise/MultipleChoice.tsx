import { useState } from "react";
import type { MultipleChoiceData } from "../../exercises";

export default function MultipleChoice({question, options, answerId}: MultipleChoiceData) {
    
    const [givenAnswer, setGivenAnswer] = useState<number | undefined>(undefined);
    return (
        <div>
            <p className="bg-red-100 rounded-lg px-2 pb-1">{question}</p>
            <div className="flex flex-col">
                {options.map((option, i) => (
                    <label key={option}>
                        <input
                            type="radio"
                            className="accent-red-500"
                            name={`${option}-${i}`}
                            value={i}
                            checked={givenAnswer === i}
                            onChange={() => setGivenAnswer(i)}
                        />
                        <span className="ml-2">{option}</span>
                    </label>
                ))}
            </div>
        </div>
    )
}
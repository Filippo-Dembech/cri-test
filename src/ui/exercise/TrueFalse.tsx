import { useState } from "react";
import type { TrueFalseData } from "../../exercises";

export default function TrueFalse({ prompt, answer }: TrueFalseData) {

    const [givenAnswer, setGivenAnswer] = useState("");

    return (
        <div>
            <p>{prompt}:</p>
            <div className="flex flex-col">
                <label>
                    <input
                        type="radio"
                        className="accent-red-500"
                        name="q1"
                        value="true"
                        checked={givenAnswer === "true"}
                        onChange={(e) => setGivenAnswer(e.target.value)}
                    />
                    <span className="ml-2">Vero</span>
                </label>
                <label>
                    <input
                        type="radio"
                        name="q1"
                        className="accent-red-500"
                        value="false"
                        checked={givenAnswer === "false"}
                        onChange={(e) => setGivenAnswer(e.target.value)}
                    />
                    <span className="ml-2">Falso</span>
                </label>
            </div>
        </div>
    );
}

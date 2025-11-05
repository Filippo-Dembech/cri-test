import { useState } from "react";
import type { StepsData } from "../../exercises";
import Button from "../Button";

function Step({ step }: { step: string }) {
    return (
        <div className="border-2 border-red-200 rounded-lg p-3">{step}</div>
    )
}

export default function Steps({ procedureName, steps }: StepsData) {
    
    console.log("render steps: ", procedureName)
    const [stepsToShow, setStepsToShow] = useState(0);

    return (
        <div>
            <h2 className="text-xl mb-4">{procedureName}</h2>
            <div className="flex flex-col gap-3">
                {steps
                    .filter((_, i) => i < stepsToShow)
                    .map((step) => (
                        <Step step={step} />
                    ))}
                {stepsToShow < steps.length ? (
                    <Button onClick={() => setStepsToShow((curr) => curr + 1)}>
                        Guarda Prossimo Step
                    </Button>
                ) : (
                    <Button outlined>End</Button>
                )}
            </div>
        </div>
    );
}

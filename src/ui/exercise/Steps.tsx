import { useState } from "react";
import type { StepsData } from "../../exercises";
import Button from "../Button";
import { GiPartyPopper } from "react-icons/gi";
import Modal from "react-modal";

function Step({ step }: { step: string }) {
    return <div className="border-2 border-red-200 rounded-lg p-3">{step}</div>;
}

export default function Steps({ procedureName, steps }: StepsData) {
    const [stepsToShow, setStepsToShow] = useState(0);
    const [showAlignment, setShowAlignment] = useState(false);

    return (
        <div>
            <Modal
                isOpen={showAlignment}
                onRequestClose={() => setShowAlignment(false)}
                style={{
                    content: {
                        maxHeight: "max-content",
                        borderRadius: "40px",
                        padding: "30px"
                    },
                    overlay: {
                        backgroundColor: "rgba(0,0,0,0.3)"
                    }
                }}
            >
                <div className="flex flex-col gap-8">
                    <h3 className="text-2xl">Come allineare gli arti?</h3>
                    <ul className="list-disc ml-8">
                        <li>Un arto alla volta</li>
                        <li>Prima un lato e poi l'altro</li>
                        <li>Prima arti inferiori</li>
                        <li>Afferrare articolazioni distale e a valle</li>
                        <li>Lieve trazione</li>
                        <li>Non portare l'arto verso di sè</li>
                        <li>
                            Mani che sorreggono l'arto, non pinzarlo dall'alto
                        </li>
                    </ul>
                    <button
                        onClick={() => setShowAlignment(false)}
                        className="bg-red-50 rounded-2xl py-2 cursor-pointer outline-0"
                    >
                        Chiudi
                    </button>
                </div>
            </Modal>
            <h2 className="text-xl mb-4">{procedureName}</h2>
            <div className="flex flex-col gap-3">
                {steps
                    .filter((_, i) => i < stepsToShow)
                    .map((step) =>
                        step.toLowerCase().includes("allinea") &&
                        step.toLowerCase().includes("arti") ? (
                            <button onClick={() => setShowAlignment(true)} className="border-2 border-red-200 rounded-lg p-3 underline underline-offset-2 cursor-pointer text-left outline-0">
                                {step}
                            </button>
                        ) : (
                            <Step step={step} />
                        ),
                    )}
                {stepsToShow < steps.length ? (
                    <Button onClick={() => setStepsToShow((curr) => curr + 1)}>
                        Guarda Prossimo Step
                    </Button>
                ) : (
                    <div className="flex gap-3 items-center justify-center border-red-600 border-2 rounded-2xl text-red-600 p-3">
                        End <GiPartyPopper />
                    </div>
                )}
            </div>
        </div>
    );
}

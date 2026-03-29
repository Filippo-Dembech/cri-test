import { useState } from "react";
import { ScenarioPractice } from "../../ui/exercise/ScenariosPractice";
import PracticePage from "../../ui/PracticePage";
import { generateScenario } from "./generateScenario";
import { choices } from "./scenarios";
import CountSelector from "../../ui/selections/CountSelector";

export default function ECGPractice() {
    const [scenariosAmount, setScenariosAmount] = useState(20);
    const scenarios = Array.from({ length: scenariosAmount}, generateScenario); 
    return (
        <PracticePage title="Pratica ECG">
            <div className="flex flex-col gap-5">
                <CountSelector
                    value={scenariosAmount}
                    onChange={setScenariosAmount}
                    max={100}
                />
                <ScenarioPractice
                    key={scenariosAmount}
                    title="Scenari ECG"
                    scenarios={scenarios}
                    choices={choices}
                />
            </div>
        </PracticePage>
    );
}

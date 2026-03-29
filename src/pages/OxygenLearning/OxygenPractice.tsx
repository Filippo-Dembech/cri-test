import PracticePage from "../../ui/PracticePage";
import ProcedureWalker from "../../ui/ProcedureWalker";
import { Tabs } from "../../ui/Tabs";
import { oxygenProcedure } from "./oxygenProcedure";
import ScenarioPractice from "./ScenarioPractice";


export default function OxygenPractice() {
    return (
        <PracticePage title="Pratica Ossigenoterapia">
            <Tabs tabs={[
                {id: "study", label: "Studia", description: "Vedi il percorso" },
                {id: "practice", label: "Ripassa", description: "Ti ricordi la procedura?" },
            ]}>
                {(activeTab) => {
                    if (activeTab === "study") return <ProcedureWalker procedure={oxygenProcedure} />
                    return <ScenarioPractice />
                }}
            </Tabs>
        </PracticePage>
    );
}
import PracticePage from "../../ui/PracticePage";
import { Tabs } from "../../ui/Tabs";
import ConceptPractice from "./ConceptPractice";
import StudyQuestions from "./StudyQuestions";


export default function AnalyzePractice() {

    return (
        <PracticePage title="Pratica Domande di Rito">
            <Tabs tabs={[
                { id: "study", label: "Studia", description: "Studia le domande di rito"},
                { id: "practice", label: "Ripassa", description: "Ripassa le domande di rito"}
            ]}>
                {(activeTab) => {
                    if (activeTab === "study") return <StudyQuestions />
                    return <ConceptPractice />
                }}
            </Tabs>
        </PracticePage>
    );
}
import { Tabs, type TabItem } from "../../ui/Tabs";
import GentleSlide from "../../ui/animations/GentleSlide";
import PracticePage from "../../ui/PracticePage";
import StartProtocol from "./StartProtocol";
import StartProtocolPractice from "./StartProtocolPractice";

const TABS: TabItem[] = [
    { id: "study",    label: "Studia",  description: "Esplora il protocollo passo per passo" },
    { id: "practice", label: "Pratica", description: "Mettiti alla prova con scenari clinici" },
];

export default function SweepingTriagePractice() {
    return (
        <PracticePage title="Pratica Sweeping Triage">
            <div className="flex flex-col gap-4 w-full sm:max-w-200">
                <Tabs tabs={TABS} defaultValue="study">
                    {(activeTab) => (
                        <GentleSlide from="top">
                            {activeTab === "study"    && <StartProtocol />}
                            {activeTab === "practice" && <StartProtocolPractice />}
                        </GentleSlide>
                    )}
                </Tabs>
            </div>
        </PracticePage>
    );
}
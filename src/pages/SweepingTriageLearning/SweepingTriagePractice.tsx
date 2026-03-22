import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import PracticePage from "../../ui/PracticePage";
import StartProtocol from "./StartProtocol";
import StartProtocolPractice from "./StartProtocolPractice";
import GentleSlide from "../../ui/animations/GentleSlide";

type Tab = "study" | "practice";

const TABS: { id: Tab; label: string; description: string }[] = [
    { id: "study",    label: "Studia",    description: "Esplora il protocollo passo per passo" },
    { id: "practice", label: "Pratica",   description: "Mettiti alla prova con scenari clinici" },
];

export default function SweepingTriagePractice() {
    const [tab, setTab] = useState<Tab>("study");
    const [tabKey, setTabKey] = useState(0);

    function switchTab(next: Tab) {
        if (next === tab) return;
        setTab(next);
        setTabKey((k) => k + 1);
    }

    return (
        <PracticePage title="Pratica Sweeping Triage">
        <div className="flex flex-col gap-4 w-full sm:max-w-200">
            {/* Tab switcher */}
            <div className="flex gap-2 p-1 bg-red-50 border border-red-100 rounded-2xl">
                {TABS.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => switchTab(t.id)}
                        className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
                            ${tab === t.id
                                ? "bg-white border border-red-200 text-red-600 shadow-sm"
                                : "text-red-300 hover:text-red-400"
                            }`}
                    >
                        {t.label}
                        <span className={`text-[10px] font-normal leading-tight text-center transition-colors
                            ${tab === t.id ? "text-red-400" : "text-red-200"}`}>
                            {t.description}
                        </span>
                    </button>
                ))}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                <GentleSlide key={tabKey} from="top">
                    {tab === "study"    && <StartProtocol />}
                    {tab === "practice" && <StartProtocolPractice />}
                </GentleSlide>
            </AnimatePresence>
            </div>
        </PracticePage>
    );
}
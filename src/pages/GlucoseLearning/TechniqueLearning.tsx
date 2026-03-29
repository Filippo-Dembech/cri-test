import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import GentleSlide from "../../ui/animations/GentleSlide";
import SlidingSelector, { type SelectorOption } from "../../ui/selections/SlidingSelector";
import { icons } from "../../icons/icons";
import TechniqueStudy from "./TechniqueStudy";
import TechniquePractice from "./TechniquePractice";

export default function TechniqueLearning() {
    const [tab, setTab] = useState<"study" | "practice">("study");
    const [tabKey, setTabKey] = useState(0);

    function switchTab(nextOption: SelectorOption) {
        if (nextOption.id === tab) return;
        setTab(nextOption.id as "study" | "practice");
        setTabKey((k) => k + 1);
    }

    const TABS: SelectorOption<"study" | "practice">[] = [
        {
            id: "study",
            label: "Studia",
            sub: "Occorrente e sequenza completa",
            icon: icons.book
        },
        {
            id: "practice",
            label: "Pratica",
            sub: "Esercitati sulla tecnica",
            icon: icons.lightningMood
        },
    ];

    return (
        <div className="flex flex-col gap-5 w-full">
            <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300">
                    MSB
                </p>
                <h1 className="text-red-900 font-semibold text-lg">
                    Tecnica di rilevazione glicemia
                </h1>
            </div>

            <SlidingSelector
                options={TABS}
                currentOption={tab}
                onSelect={(tab) => switchTab(tab)}
            />

            <AnimatePresence mode="wait">
                <GentleSlide
                    key={tabKey}
                    from="top"
                >
                    {tab === "study" && <TechniqueStudy />}
                    {tab === "practice" && <TechniquePractice />}
                </GentleSlide>
            </AnimatePresence>
        </div>
    );
}

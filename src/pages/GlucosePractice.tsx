import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import GlicemiaLearning from "./GlicemiaPractice/GlicemiaLearning";
import TechniquePractice from "./GlicemiaPractice/TechniquePractice";
import GentleSlide from "../ui/animations/GentleSlide";
import PracticePage from "../ui/PracticePage";

type Topic = "criteri" | "tecnica";

const TOPICS: { id: Topic; label: string; description: string }[] = [
    { id: "criteri", label: "Criteri",  description: "Quando rilevare in autonomia" },
    { id: "tecnica", label: "Tecnica",  description: "Come eseguire la rilevazione" },
];

export default function GlicemiaPage() {
    const [topic, setTopic] = useState<Topic>("criteri");
    const [topicKey, setTopicKey] = useState(0);

    function switchTopic(next: Topic) {
        if (next === topic) return;
        setTopic(next);
        setTopicKey((k) => k + 1);
    }

    return (
        <PracticePage title="Glicemia capillare">
            <div className="flex flex-col gap-4 w-full sm:max-w-200">
            {/* Topic switcher */}
            <div className="flex gap-2 p-1 bg-red-50 border border-red-100 rounded-2xl">
                {TOPICS.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => switchTopic(t.id)}
                        className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
                            ${topic === t.id
                                ? "bg-white border border-red-200 text-red-600 shadow-sm"
                                : "text-red-300 hover:text-red-400"}`}
                    >
                        {t.label}
                        <span className={`text-[10px] font-normal leading-tight text-center transition-colors
                            ${topic === t.id ? "text-red-400" : "text-red-200"}`}>
                            {t.description}
                        </span>
                    </button>
                ))}
            </div>

            {/* Content — each child manages its own study/practice tab internally */}
            <AnimatePresence mode="wait">
                <GentleSlide key={topicKey} from="top">
                    {topic === "criteri" && <GlicemiaLearning />}
                    {topic === "tecnica" && <TechniquePractice />}
                </GentleSlide>
            </AnimatePresence>
</div>
        </PracticePage>
    );
}
import { useState } from "react";
import type { StepsData } from "../../exercises";
import Steps from "../../ui/exercise/Steps";
import PracticePage from "../../ui/PracticePage";
import { motion, AnimatePresence } from "framer-motion";
import SkillsReorderPractice from "./SkillsReorderPractice";
import { skills } from "./skills";
import Dropdown from "../../ui/selections/Dropdown";
import { Tabs, type TabItem } from "../../ui/Tabs";

const TABS: TabItem[] = [
    {
        id: "study",
        label: "Studia",
        description: "Esplora le skills passo passo",
    },
    { id: "practice", label: "Pratica", description: "Quanto ti ricordi?" },
];

export default function SkillsLearning() {
    const [selectedSkill, setSelectedSkill] = useState<StepsData | undefined>(
        undefined,
    );

    const handleReset = () => setSelectedSkill(undefined);

    return (
        <PracticePage title="Pratica Skills">
            <Tabs tabs={TABS}>
                {(activeTab) => (
                    <div className="flex flex-col gap-5 w-full max-w-200 p-3 sm:p-8">
                        <Dropdown
                            options={skills.map((s) => s.procedureName)}
                            selected={selectedSkill?.procedureName}
                            onSelect={(selectedSkillName) =>
                                setSelectedSkill(
                                    skills.find(
                                        (s) =>
                                            s.procedureName ===
                                            selectedSkillName,
                                    ),
                                )
                            }
                        />

                        <AnimatePresence
                            key={activeTab}
                            mode="wait"
                        >
                            <motion.div
                                key={`study-${selectedSkill?.procedureName}`}
                                className="bg-red-50 border border-red-200 rounded-2xl p-5"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{
                                    duration: 0.25,
                                    ease: "easeInOut",
                                }}
                            >
                                {selectedSkill ? (
                                    activeTab === "study" ? (
                                        <Steps
                                            procedureName={
                                                selectedSkill.procedureName
                                            }
                                            steps={selectedSkill.steps}
                                            onReset={handleReset}
                                        />
                                    ) : (
                                        <SkillsReorderPractice
                                            selectedSkill={selectedSkill}
                                        />
                                    )
                                ) : (
                                    <p className="text-red-300 text-sm text-center">
                                        Seleziona una skill per iniziare
                                    </p>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                )}
            </Tabs>
        </PracticePage>
    );
}

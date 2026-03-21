import { motion } from "framer-motion";
import type { RefObject } from "react";
import type { StepsData } from "../../exercises";

interface Props {
    onSelect: (selectedSkillName: string) => void;
    skills: StepsData[];
    selectRef: RefObject<HTMLSelectElement | null>
}

export function SkillsSelector({ onSelect, skills, selectRef }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-2">
                Skill
            </p>
            <div className="bg-white border border-red-200 rounded-2xl px-4 py-3 cursor-pointer hover:border-red-400 transition-colors duration-200">
                <select
                    ref={selectRef}
                    className="w-full outline-0 cursor-pointer bg-transparent text-red-900"
                    onChange={(e) => {
                        const selectedSkillName = e.target.value;
                        onSelect(selectedSkillName);
                    }}
                >
                    <option
                        value=""
                        disabled
                        selected
                        className="text-red-300"
                    >
                        Seleziona la skill...
                    </option>
                    {skills.map((skill) => (
                        <option key={skill.procedureName}>
                            {skill.procedureName}
                        </option>
                    ))}
                </select>
            </div>
        </motion.div>
    );
}

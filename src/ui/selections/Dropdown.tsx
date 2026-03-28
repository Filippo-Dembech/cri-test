import { motion } from "framer-motion";

interface Props {
    options: string[];
    selected?: string;
    onSelect: (selectedSkillName: string) => void;
}

export default function Dropdown({ options, selected, onSelect  }: Props) {
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
                    className="w-full outline-0 cursor-pointer bg-transparent text-red-900"
                    onChange={(e) => {
                        const option = e.target.value;
                        onSelect(option);
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
                    {options.map((option) => (
                        <option selected={option === selected} key={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
        </motion.div>
    );
}
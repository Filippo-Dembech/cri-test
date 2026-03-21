import { Link } from "react-router-dom";
import Title from "../ui/Title";
import Background from "../ui/Background";
import {
    FaAmbulance,
    FaBook,
    FaFlagCheckered,
    FaQuestionCircle,
    FaStethoscope,
    FaSyringe,
} from "react-icons/fa";
import { MdSick } from "react-icons/md";
import { SiO2 } from "react-icons/si";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { TbActivityHeartbeat } from "react-icons/tb";
import { motion } from 'framer-motion'

const navItems = [
    { to: "/parameters-practice",                 icon: <FaStethoscope />,      label: "Parametri" },
    { to: "/terminology-practice",                icon: <FaBook />,             label: "Terminologia" },
    { to: "/skills-practice",                     icon: <FaAmbulance />,        label: "Skills" },
    { to: "/analyze-practice",                    icon: <FaQuestionCircle />,   label: "Domande di Rito" },
    { to: "/disease-practice",                    icon: <MdSick />,             label: "Patologie" },
    { to: "/oxygen-practice",                     icon: <SiO2 />,               label: "Ossigenoterapia" },
    { to: "/diagnostic-suspicion-score-practice", icon: <FaMagnifyingGlass />,  label: "Indice di Sospetto" },
    { to: "/ecg-practice",                        icon: <TbActivityHeartbeat />, label: "ECG" },
    { to: "/blood-glucose-practice",              icon: <FaSyringe />,          label: "Glicemia" },
    { to: "/sweeping-triage-practice",            icon: <FaFlagCheckered />,    label: "Sweeping Triage" },
];

export default function SSEPractice() {
    return (
        <div className="p-8 min-h-screen flex flex-col items-center justify-center">
            <Background />

            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="mb-8 text-center"
            >
                <Title h={1}>PRATICA SSE</Title>
            </motion.div>

            {/* Grid menu */}
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-150"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.06 } },
                }}
            >
                {navItems.map(({ to, icon, label }) => (
                    <motion.div
                        key={to}
                        variants={{
                            hidden: { opacity: 0, y: 18, scale: 0.96 },
                            visible: { opacity: 1, y: 0, scale: 1 },
                        }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        whileHover={{ scale: 1.03, transition: { duration: 0.15 } }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <Link to={to} className="block h-full">
                            <div className="flex items-center gap-3 h-full bg-red-50 border border-red-200 rounded-2xl px-4 py-3.5 cursor-pointer hover:bg-red-500 transition-colors duration-200 group">
                                <span className="text-red-400 group-hover:text-white transition-colors duration-200 text-lg shrink-0">
                                    {icon}
                                </span>
                                <span className="text-red-700 group-hover:text-white font-medium text-sm transition-colors duration-200">
                                    {label}
                                </span>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
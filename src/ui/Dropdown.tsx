import { useState, type ReactNode } from "react";
import Button from "./Button";
import { IoIosArrowDown } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";

interface DropdownProps {
    showLabel?: string;
    children: ReactNode;
}

export default function Dropdown({
    children,
    showLabel = "Mostra",
}: DropdownProps) {
    const [showContent, setShowContent] = useState(false);

    function toggleContent() {
        setShowContent((show) => !show);
    }
    return (
        <div>
            <Button
                className="flex justify-between pb-1"
                onClick={toggleContent}
            >
                <span>{showLabel}</span>
                <motion.span
                    animate={{ rotate: showContent ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <IoIosArrowDown />
                </motion.span>
            </Button>
            <AnimatePresence>
                {showContent && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: "hidden", marginTop: "0.4rem" }}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

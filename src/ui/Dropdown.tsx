import { useState, type ReactNode } from "react";
import Button from "./Button";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface DropdownProps {
    showLabel?: string;
    hideLabel?: string;
    children: ReactNode
}

export default function Dropdown({ children, showLabel = "Mostra", hideLabel = "Nascondi" }: DropdownProps) {
    const [showContent, setShowContent] = useState(false);
    
    function toggleContent() {
        setShowContent(show => !show);
    }
    return (
        
            <div>
                {showContent ? (
                    <Button
                        className="flex justify-between pb-1"
                        onClick={toggleContent}
                    >
                        <span>{hideLabel}</span>
                        <IoIosArrowUp />
                    </Button>
                ) : (
                    <Button
                        className="flex justify-between pb-1"
                        onClick={toggleContent}
                    >
                        <span>{showLabel}</span>
                        <IoIosArrowDown />
                    </Button>
                )}
                {showContent && children}
            </div>
    )
}
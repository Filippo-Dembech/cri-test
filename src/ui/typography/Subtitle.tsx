import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
    className?: string
}

export default function Subtitle({ children, className = "text-red-300" }: Props) {
    return (
        <p className={`text-[10px] font-semibold uppercase tracking-widest ${className}`}>
            {children}
        </p>
    );
}

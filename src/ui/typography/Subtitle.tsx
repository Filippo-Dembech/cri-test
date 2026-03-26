import type { ReactNode } from "react";

interface Props {
    children: ReactNode
}

export default function Subtitle({ children }: Props) {
    return (
        <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300">
            {children}
        </p>
    );
}

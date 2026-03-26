import type { ReactNode } from "react";

interface Props {
    color?: "red" | "yellow";
    children: ReactNode,
}

export default function Card({ color = "red", children }: Props) {
    if (color === "yellow")
        return (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                {children}
            </div>
        );
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {children}
            </div>
        );
;
}

import type { ReactNode } from "react";

type ColorPillColor = "green" | "yellow" | "red"

const COLOR_STYLE: Record<ColorPillColor, { pill: string; dot: string }> = {
    "green":  { pill: "bg-green-100 text-green-800 border-green-300", dot: "bg-green-500" },
    "yellow": { pill: "bg-amber-100 text-amber-800 border-amber-300", dot: "bg-amber-400" },
    "red":  { pill: "bg-red-100 text-red-700 border-red-300",         dot: "bg-red-500"   },
};


export default function ColorPill({
    color = "red",
    children
}: {
    color?: ColorPillColor;
    children: ReactNode
}) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-xs font-bold ${COLOR_STYLE[color].pill}`}
        >
            <span className={`w-2 h-2 rounded-full ${COLOR_STYLE[color].dot}`} />
            {children}
        </span>
    );
}

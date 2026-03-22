import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export default function Back({ children }: Props) {
    return (
        <div
            className="absolute inset-0 w-full bg-white border border-red-300 rounded-2xl px-6 py-10 flex flex-col items-center justify-center gap-3 min-h-44"
            style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
            }}
        >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300">
                Termine
            </p>
            {children}
        </div>
    );
}

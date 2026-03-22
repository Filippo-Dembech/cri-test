import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export default function Front({ children }: Props) {
    return (
        <div
            className="w-full bg-red-50 border border-red-200 rounded-2xl px-6 py-10 flex flex-col items-center justify-center gap-3 min-h-44"
            style={{ backfaceVisibility: "hidden" }}
        >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-red-300">
                Definizione
            </p>
            {children}
        </div>
    );
}

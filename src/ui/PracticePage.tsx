import type { ReactNode } from "react";

interface PracticePageProps {
    title: string;
    bodyClassName?: string;
    children: ReactNode
}
export default function PracticePage({ title, bodyClassName, children }: PracticePageProps) {
    return (
        <div className="flex flex-col h-screen px-6 pt-6 pb-4 sm:px-10 sm:pt-8">

            {/* Header */}
            <div className="mb-5 shrink-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-red-400 mb-1">
                    Croce Rossa Italiana
                </p>
                <h1 className="text-3xl font-bold text-red-900">{title}</h1>
            </div>

            {/* Divider */}
            <div className="border-t border-red-100 mb-5 shrink-0" />

            {/* Body */}
            <div
                className={`${bodyClassName} flex-1 overflow-y-auto overflow-x-hidden rounded-2xl sm:border sm:border-red-100 sm:bg-red-50/30`}
            >
                <div className="flex justify-center items-start min-h-full p-4 sm:p-8 sm:items-center">
                    {children}
                </div>
            </div>

        </div>
    );
}
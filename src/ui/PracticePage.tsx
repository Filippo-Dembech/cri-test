import type { ReactNode } from "react";

interface PracticePageProps {
    title: string;
    bodyClassName?: string;
    children: ReactNode
}

export default function PracticePage({ title, bodyClassName, children }: PracticePageProps) {
    return (
        <div className="flex flex-col h-screen p-8">
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <div className={`${bodyClassName} sm:flex sm:mt-20 sm:justify-center sm:flex-1`}>{children}</div>
        </div>
    )
}
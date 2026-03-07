import type { ReactNode } from "react";

interface PracticePageProps {
    title: string;
    bodyClassName?: string;
    children: ReactNode
}

export default function PracticePage({ title, bodyClassName, children }: PracticePageProps) {
    return (
        <div>
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <div className={bodyClassName}>{children}</div>
        </div>
    )
}
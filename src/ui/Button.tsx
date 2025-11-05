import type { ButtonHTMLAttributes } from "react";

interface ButtonProps {
    outlined?: boolean;
    children: React.ReactNode
}

export default function Button({outlined, children, ...htmlButtonAttributes}: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
    if (outlined) return (
        <button className="px-2 py-1 text-red-500 rounded-lg border border-red-500 cursor-pointer hover:bg-red-500 hover:text-white transition-colors duration-100" {...htmlButtonAttributes}>{children}</button>
    )
    return (
        <button className="px-2 py-1 text-white bg-red-500 rounded-lg cursor-pointer hover:bg-red-600 transition-colors duration-100" {...htmlButtonAttributes}>{children}</button>
    )
}
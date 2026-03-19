import type { ButtonHTMLAttributes } from "react";

interface ButtonProps {
    outlined?: boolean;
    icon?: React.ReactNode;
    children: React.ReactNode;
}

export default function Button({
    outlined,
    children,
    icon,
    className,
    ...htmlButtonAttributes
}: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
    if (outlined)
        return (
            <div className="relative">
                <button
                    className={`px-2 py-1 text-red-500 rounded-lg border border-red-500 cursor-pointer hover:bg-red-50 transition-colors duration-300 w-full ${className}`}
                    {...htmlButtonAttributes}
                >
                    {children}
                </button>
                {icon && <span className="absolute text-red-500 top-1/2 left-6 -translate-1/2 transition-colors duration-400">{icon}</span>}
            </div>
        );
    return (
        <div>
            <button
                style={htmlButtonAttributes.disabled ? { backgroundColor: "gray" }: {}}
                className={`flex items-center px-2 py-1 text-white bg-red-500 rounded-lg cursor-pointer hover:bg-red-600 transition-colors duration-400 w-full ${className}`}
                {...htmlButtonAttributes}
            >
                {icon && <span className="text-white mr-2 transition-colors duration-400">{icon}</span>}
                {children}
            </button>
        </div>
    );
}

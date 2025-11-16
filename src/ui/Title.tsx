interface TitleProps {
    h: number;
    className?: string;
    children: React.ReactNode;
}

export default function Title({ h, className, children }: TitleProps) {
    if (h === 1) return <h1 className={`text-3xl sm:text-5xl font-bold mb-8 ${className}`}>{children}</h1>
    if (h === 2) return <h2 className={`text-2xl sm:text-4xl font-bold mb-6 ${className}`}>{children}</h2>
    if (h === 3) return <h3 className={`text-1xl sm:text-3xl font-bold mb-5 ${className}`}>{children}</h3>
    if (h === 4) return <h4 className={`text-2xl font-bold mb-4 ${className}`}>{children}</h4>
    return <h5 className={`text-1xl font-bold mb-3 ${className}`}>{children}</h5>
}
const PRESETS = [5, 10, 20, 50];

export default function TermCountSelector({
    value,
    onChange,
    max,
}: {
    value: number | "all";
    onChange: (v: number | "all") => void;
    max: number;
}) {
    const options: (number | "all")[] = [...PRESETS.filter((p) => p < max), "all"];

    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-red-400 font-medium shrink-0">Termini:</span>
            <div className="flex gap-1.5">
                {options.map((opt) => (
                    <button
                        key={opt}
                        onClick={() => onChange(opt)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer
                            ${value === opt
                                ? "bg-red-500 text-white"
                                : "border border-red-200 text-red-400 hover:bg-red-50"
                            }`}
                    >
                        {opt === "all" ? "Tutti" : opt}
                    </button>
                ))}
            </div>
        </div>
    );
}

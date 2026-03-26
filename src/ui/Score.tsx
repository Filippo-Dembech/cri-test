interface Props {
    correct: number;
    total: number;
}

export default function Score({ correct, total }: Props) {
    const percentage = Math.round((correct / total) * 100);
    return (
        <div className="flex flex-col items-center gap-3">
            <div
                className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${percentage >= 80 ? "border-green-400 bg-green-50" : percentage >= 50 ? "border-amber-400 bg-amber-50" : "border-red-400 bg-red-50"}`}
            >
                <span
                    className={`text-2xl font-semibold ${percentage >= 80 ? "text-green-700" : percentage >= 50 ? "text-amber-700" : "text-red-700"}`}
                >
                    {percentage}%
                </span>
            </div>
            <p className="text-red-900 font-semibold text-lg text-center">
                {correct} su {total} corrette
            </p>
        </div>
    );
}

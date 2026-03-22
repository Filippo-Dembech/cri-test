import { motion } from "framer-motion";

interface Props {
    total: number;
    done: number
}

export default function ProgressBar({done, total}: Props) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-red-100 overflow-hidden">
                <motion.div
                    initial={{width: 0}}
                    className="h-full bg-red-400 rounded-full"
                    animate={{ width: `${(done / total) * 100}%` }}
                    transition={{ duration: 0.4 }}
                />
            </div>
            <span className="text-xs text-red-400 font-medium tabular-nums">
                {done + 1}/{total}
            </span>
        </div>
    );
}

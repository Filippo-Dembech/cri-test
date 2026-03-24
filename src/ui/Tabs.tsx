import { useState } from "react";
import { AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TabItem<T extends string = string> {
    id: T;
    label: string;
    /** Optional subtitle shown below the label */
    description?: string;
}

export interface TabsProps<T extends string = string> {
    /** The tab definitions */
    tabs: TabItem<T>[];
    /** Controlled active tab */
    value?: T;
    /** Default active tab (uncontrolled) */
    defaultValue?: T;
    /** Fired when the user selects a different tab */
    onChange?: (id: T) => void;
    /** Color theme — maps to Tailwind color scale names */
    color?: "red" | "blue" | "green" | "violet" | "amber" | "slate";
    /**
     * Render prop that receives the active tab id.
     * Wrap in <AnimatePresence> + your own animation if desired.
     */
    children?: (activeTab: T) => React.ReactNode;
    className?: string;
}

// ─── Theme map ────────────────────────────────────────────────────────────────

const THEMES = {
    red: {
        track:        "bg-red-50   border border-red-100",
        activeBtn:    "bg-white border border-red-200 text-red-600 shadow-sm",
        inactiveBtn:  "text-red-300 hover:text-red-400",
        activeDesc:   "text-red-400",
        inactiveDesc: "text-red-200",
    },
    blue: {
        track:        "bg-blue-50  border border-blue-100",
        activeBtn:    "bg-white border border-blue-200 text-blue-600 shadow-sm",
        inactiveBtn:  "text-blue-300 hover:text-blue-400",
        activeDesc:   "text-blue-400",
        inactiveDesc: "text-blue-200",
    },
    green: {
        track:        "bg-green-50  border border-green-100",
        activeBtn:    "bg-white border border-green-200 text-green-600 shadow-sm",
        inactiveBtn:  "text-green-300 hover:text-green-400",
        activeDesc:   "text-green-400",
        inactiveDesc: "text-green-200",
    },
    violet: {
        track:        "bg-violet-50  border border-violet-100",
        activeBtn:    "bg-white border border-violet-200 text-violet-600 shadow-sm",
        inactiveBtn:  "text-violet-300 hover:text-violet-400",
        activeDesc:   "text-violet-400",
        inactiveDesc: "text-violet-200",
    },
    amber: {
        track:        "bg-amber-50  border border-amber-100",
        activeBtn:    "bg-white border border-amber-200 text-amber-600 shadow-sm",
        inactiveBtn:  "text-amber-300 hover:text-amber-400",
        activeDesc:   "text-amber-400",
        inactiveDesc: "text-amber-200",
    },
    slate: {
        track:        "bg-slate-100 border border-slate-200",
        activeBtn:    "bg-white border border-slate-300 text-slate-700 shadow-sm",
        inactiveBtn:  "text-slate-400 hover:text-slate-500",
        activeDesc:   "text-slate-500",
        inactiveDesc: "text-slate-300",
    },
} as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function Tabs<T extends string = string>({
    tabs,
    value,
    defaultValue,
    onChange,
    color = "red",
    children,
    className = "",
}: TabsProps<T>) {
    const isControlled = value !== undefined;

    const [internalTab, setInternalTab] = useState<T>(
        defaultValue ?? tabs[0]?.id
    );
    const [contentKey, setContentKey] = useState(0);

    const activeTab = isControlled ? value! : internalTab;
    const theme = THEMES[color];

    function handleSelect(id: T) {
        if (id === activeTab) return;
        if (!isControlled) setInternalTab(id);
        setContentKey((k) => k + 1);
        onChange?.(id);
    }

    return (
        <div className={`flex flex-col gap-4 w-full ${className}`}>
            {/* Tab bar */}
            <div className={`flex gap-2 p-1 rounded-2xl ${theme.track}`}>
                {tabs.map((t) => {
                    const isActive = t.id === activeTab;
                    return (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => handleSelect(t.id)}
                            className={`
                                flex-1 flex flex-col items-center gap-0.5
                                py-2.5 px-3 rounded-xl text-sm font-semibold
                                transition-all duration-200 cursor-pointer
                                ${isActive ? theme.activeBtn : theme.inactiveBtn}
                            `}
                        >
                            {t.label}
                            {t.description && (
                                <span
                                    className={`
                                        text-[10px] font-normal leading-tight text-center
                                        transition-colors
                                        ${isActive ? theme.activeDesc : theme.inactiveDesc}
                                    `}
                                >
                                    {t.description}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Content area — animated via render prop */}
            {children && (
                <AnimatePresence mode="wait">
                    {/* key forces AnimatePresence to re-mount on tab change */}
                    <div key={contentKey}>
                        {children(activeTab)}
                    </div>
                </AnimatePresence>
            )}
        </div>
    );
}
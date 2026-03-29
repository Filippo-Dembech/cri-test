import { useState, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Context ──────────────────────────────────────────────────────────────────

interface AccordionContextValue {
  openId: string | null;
  toggle: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextValue>({
  openId: null,
  toggle: () => {},
});

// ─── Accordion.Section ────────────────────────────────────────────────────────

let sectionCounter = 0;

interface SectionProps {
  label: string;
  children: React.ReactNode;
}

function Section({ label, children }: SectionProps) {
  const { openId, toggle } = useContext(AccordionContext);
  const [id] = useState(() => `accordion-section-${++sectionCounter}`);
  const isOpen = openId === id;

  return (
    <div className="border border-red-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => toggle(id)}
        aria-expanded={isOpen}
        aria-controls={id}
        className="w-full flex items-center justify-between px-5 py-4 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
      >
        <span className="text-red-900 font-semibold text-sm text-left">
          {label}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-red-300 text-xs ml-2 shrink-0"
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={id}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 bg-white flex flex-col gap-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Accordion ────────────────────────────────────────────────────────────────

interface AccordionProps {
  children: React.ReactNode;
  /** If true, multiple sections can be open at the same time */
  multiple?: boolean;
  /** Which section is open by default (matches the label) */
  defaultOpen?: string;
}

function Accordion({ children }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <AccordionContext.Provider value={{ openId, toggle }}>
      <div className="flex flex-col gap-3">{children}</div>
    </AccordionContext.Provider>
  );
}

Accordion.Section = Section;

export default Accordion;
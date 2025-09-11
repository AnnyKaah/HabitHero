import { CheckCircle2, Circle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils"; // No changes needed here

// Interface para o objeto quest
interface Quest {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

// Interface para as props do componente
interface DailyQuestCardProps {
  quest: Quest;
  isExpanded: boolean;
  onToggle: () => void;
  onComplete: () => void;
}

export default function DailyQuestCard({
  quest,
  isExpanded,
  onToggle,
  onComplete,
}: DailyQuestCardProps) {
  const { title, description, completed } = quest;

  return (
    <div
      className={cn(
        "bg-brand-slate/60 rounded-lg border border-brand-light-slate/50 overflow-hidden transition-all duration-300",
        completed && "bg-green-500/10 border-green-500/30"
      )}
    >
      <div className="flex items-center justify-between w-full p-3 text-left">
        <div className="flex items-center gap-3">
          <button
            onClick={onComplete}
            disabled={completed}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Completar missão"
          >
            {completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-slate-500 flex-shrink-0 transition-colors hover:text-green-400" />
            )}
          </button>
          <span
            className={cn(
              "text-slate-300",
              completed && "line-through text-slate-500",
              "cursor-pointer"
            )}
            onClick={onToggle}
          >
            {title}
          </span>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
          <ChevronDown className="w-5 h-5 text-slate-400 transition-transform" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="px-4 pb-3"
          >
            <p className="text-slate-400 text-sm border-l-2 border-brand-cyan/50 pl-3">
              {description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

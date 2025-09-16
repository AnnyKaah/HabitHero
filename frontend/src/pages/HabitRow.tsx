import React from "react";
import { motion } from "framer-motion";
import type { Habit } from "../types";
import LevelMedal from "./LevelMedal";

interface HabitRowProps {
  habit: Habit;
}

export default function HabitRow({ habit }: HabitRowProps) {
  // Lógica de progresso baseada nos dias completados, para consistência com o HabitCard.
  const completedDays = habit.logs?.filter((l) => l.completed).length || 0;
  const progressPercentage =
    habit.duration > 0 ? (completedDays / habit.duration) * 100 : 0;

  return (
    <motion.div
      className="group relative grid grid-cols-3 items-center gap-4 p-2 rounded-lg hover:bg-brand-light-slate/10 transition-colors"
      whileHover={{ scale: 1.02 }}
      layout
    >
      {/* Coluna 1: Nome do Hábito */}
      <span className="col-span-1 font-semibold text-slate-300 truncate">
        {habit.name}
      </span>
      {/* Coluna 2 e 3: Progresso e Nível */}
      <div className="col-span-2 flex items-center justify-end gap-4">
        {/* Barra de Progresso do Hábito */}
        <div
          className="w-full max-w-24 bg-brand-dark rounded-full h-2 border border-brand-light-slate/30"
          title={`${completedDays} / ${habit.duration} dias completados`}
        >
          <motion.div
            className={`h-full rounded-full origin-left ${
              progressPercentage >= 100
                ? "bg-green-500" // Cor de conclusão
                : "bg-gradient-to-r from-brand-pink to-brand-purple" // Cor de progresso
            }`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progressPercentage / 100 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <LevelMedal level={habit.level} />
      </div>

      {/* Tooltip com XP Total */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
        Total: {habit.completedCount * 10} XP
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900"></div>
      </div>
    </motion.div>
  );
}

import React from "react";
import { motion } from "framer-motion";
import type { Habit } from "../types";
import LevelMedal from "./LevelMedal";

interface HabitRowProps {
  habit: Habit;
}

export default function HabitRow({ habit }: HabitRowProps) {
  // A barra de progresso do hábito pode ser baseada no XP para o próximo nível.
  // Supondo que xpToNextLevel = level * 50, como no useGamification.
  const xpToNextLevel = habit.level * 50;
  const progressPercentage =
    xpToNextLevel > 0 ? (habit.xp / xpToNextLevel) * 100 : 0;

  return (
    <motion.div
      className="group relative flex items-center justify-between p-2 rounded-lg hover:bg-brand-light-slate/10 transition-colors"
      whileHover={{ scale: 1.02 }}
      layout
    >
      <span className="font-semibold text-slate-300">{habit.name}</span>
      <div className="flex items-center gap-4">
        {/* Barra de Progresso do Hábito */}
        <div
          className="w-24 bg-brand-dark rounded-full h-2 border border-brand-light-slate/30"
          title={`${habit.xp}/${xpToNextLevel} XP`}
        >
          <motion.div
            className="bg-gradient-to-r from-brand-pink to-brand-purple h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
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

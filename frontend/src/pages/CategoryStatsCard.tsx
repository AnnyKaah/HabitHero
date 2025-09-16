import React from "react";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import type { Habit } from "../types";
import HabitRow from "./HabitRow";

export type CategorizedHabit = {
  title: string;
  icon: keyof typeof Icons;
  habits: Habit[];
};

interface CategoryStatsCardProps {
  category: CategorizedHabit;
  color: string;
}

export default function CategoryStatsCard({
  category,
  color,
}: CategoryStatsCardProps) {
  const IconComponent =
    (Icons[category.icon] as React.ElementType) || Icons.Activity;

  const totalDays = category.habits.reduce((sum, h) => sum + h.duration, 0);
  const completedDays = category.habits.reduce(
    (sum, h) => sum + (h.logs?.filter((l) => l.completed).length || 0),
    0
  );
  const categoryProgress =
    totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
  const areAllHabitsComplete =
    category.habits.length > 0 &&
    category.habits.every(
      (h) => (h.logs?.filter((l) => l.completed).length || 0) >= h.duration
    );

  return (
    <motion.div
      className={cn(
        "bg-brand-slate/50 p-4 rounded-xl border border-brand-light-slate flex flex-col gap-3 transition-all",
        areAllHabitsComplete && "border-green-400/50 shadow-glow-green"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <IconComponent className={`w-6 h-6 ${color}`} />
          <h4 className="font-display text-lg font-bold text-slate-200 truncate">
            {category.title}
          </h4>
          {areAllHabitsComplete && (
            <span className="text-xs font-bold text-green-400 bg-green-500/20 px-2 py-0.5 rounded-full">
              Completo
            </span>
          )}
        </div>
        <span className="text-xs font-mono text-slate-400">
          {category.habits.length} hábitos
        </span>
      </div>

      {/* Barra de Progresso da Categoria */}
      <div className="w-full bg-brand-dark rounded-full h-1.5">
        <motion.div
          className={`h-full rounded-full origin-left ${color.replace(
            "text-",
            "bg-"
          )}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: categoryProgress / 100 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <div className="space-y-1">
        {category.habits.map((habit) => (
          <HabitRow key={habit.id} habit={habit} />
        ))}
      </div>
    </motion.div>
  );
}

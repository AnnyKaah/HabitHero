import React from "react";
import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { Habit } from "../pages/Dashboard"; // No changes needed here
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

  // Calcula o progresso geral da categoria (ex: média dos níveis)
  const totalLevels = category.habits.reduce((sum, h) => sum + h.level, 0);
  const averageLevel =
    category.habits.length > 0 ? totalLevels / category.habits.length : 0;
  // Normaliza para uma barra de progresso (ex: 100% = nível 20)
  const categoryProgress = Math.min((averageLevel / 20) * 100, 100);

  return (
    <motion.div
      className="bg-brand-slate/50 p-4 rounded-xl border border-brand-light-slate flex flex-col gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconComponent className={`w-6 h-6 ${color}`} />
          <h4 className="font-display text-lg font-bold text-slate-200">
            {category.title}
          </h4>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {category.habits.length} hábitos
        </span>
      </div>

      {/* Barra de Progresso da Categoria */}
      <div className="w-full bg-brand-dark rounded-full h-1.5">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${categoryProgress}%` }}
        ></div>
      </div>

      <div className="space-y-1">
        {category.habits.map((habit) => (
          <HabitRow key={habit.id} habit={habit} />
        ))}
      </div>
    </motion.div>
  );
}

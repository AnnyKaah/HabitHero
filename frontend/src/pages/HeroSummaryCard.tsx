import React from "react";
import { CheckSquare, ListChecks, Swords, Heart } from "lucide-react";
import type { Habit } from "../types";

interface HeroSummaryCardProps {
  totalHabitsCompleted: number;
  activeHabitsCount: number;
  strongestHabit: Habit | null;
  favoriteCategoryName: string;
}

const StatItem = ({
  icon: Icon,
  label,
  value,
  valueTitle,
  colorClass,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  valueTitle?: string;
  colorClass: string;
}) => (
  <div className="flex items-center gap-4">
    <Icon className={`w-6 h-6 ${colorClass} flex-shrink-0`} />
    <div className="flex-1 flex justify-between items-center min-w-0">
      <span className="text-slate-300">{label}</span>
      <span
        className="font-bold text-md text-white truncate"
        title={valueTitle || String(value)}
      >
        {value}
      </span>
    </div>
  </div>
);

export default function HeroSummaryCard({
  totalHabitsCompleted,
  activeHabitsCount,
  strongestHabit,
  favoriteCategoryName,
}: HeroSummaryCardProps) {
  return (
    <div className="bg-brand-slate/50 p-6 rounded-xl border border-brand-light-slate space-y-4">
      <h3 className="font-display text-xl font-bold text-green-400 mb-4">
        Resumo do Herói
      </h3>

      <StatItem
        icon={CheckSquare}
        label="Missões Concluídas"
        value={totalHabitsCompleted}
        colorClass="text-green-400"
      />
      <StatItem
        icon={ListChecks}
        label="Hábitos Ativos"
        value={activeHabitsCount}
        colorClass="text-cyan-400"
      />
      <StatItem
        icon={Swords}
        label="Missão Mais Forte"
        value={
          strongestHabit
            ? `${strongestHabit.name} (Nvl. ${strongestHabit.level})`
            : "N/A"
        }
        valueTitle={strongestHabit?.name}
        colorClass="text-red-400"
      />
      <StatItem
        icon={Heart}
        label="Categoria Favorita"
        value={favoriteCategoryName}
        colorClass="text-pink-400"
      />
    </div>
  );
}

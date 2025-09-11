import * as Icons from "lucide-react";
import type { Habit } from "../types";

interface CategorySectionProps {
  category: {
    title: string;
    icon: keyof typeof Icons;
    habits: Habit[];
  };
}

export default function CategorySection({ category }: CategorySectionProps) {
  const IconComponent =
    category.icon in Icons &&
    typeof Icons[category.icon] === "object" &&
    (Icons[category.icon] as React.ElementType);
  if (!IconComponent) return null; // Fallback seguro
  // Lógica de progresso atualizada para missões de múltiplos dias
  const totalMissionDays = category.habits.reduce(
    (sum, h) => sum + h.duration,
    0
  );
  const completedMissionDays = category.habits.reduce(
    (sum, h) => sum + (h.logs?.filter((l) => l.completed).length || 0),
    0
  );
  const categoryProgress =
    totalMissionDays > 0 ? (completedMissionDays / totalMissionDays) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-brand-slate rounded-full flex items-center justify-center border-2 border-brand-purple">
          <IconComponent className="w-6 h-6 text-brand-purple" />
        </div>
        <div>
          <h3 className="text-2xl font-display font-bold text-slate-200">
            {category.title}
          </h3>
          <div className="w-48 bg-brand-dark rounded-full h-2 mt-1 border border-brand-light-slate/50">
            <div
              className="bg-gradient-to-r from-brand-pink to-brand-purple h-full rounded-full"
              style={{ width: `${categoryProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { Trash2, Calendar, CheckCircle, Tag } from "lucide-react";
import type { Habit } from "../types";
import { habitCategories } from "../utils/habitCategories";
import { format } from "date-fns";
import { useUser } from "../pages/UserContext";

interface HabitCardProps {
  habit: Habit;
  onComplete: (id: number) => Promise<void>;
  onDelete: (id: number) => void;
  isGlowing?: boolean;
  completingHabitId: number | null;
  justCompletedHabitId: number | null;
}

export default function HabitCard({
  habit: initialHabit,
  onComplete,
  onDelete,
  isGlowing,
  completingHabitId,
  justCompletedHabitId,
}: HabitCardProps) {
  const {
    state: { habits },
  } = useUser();
  // Garante que estamos sempre usando a versão mais atualizada do hábito do estado global.
  const habit = habits.find((h) => h.id === initialHabit.id) || initialHabit;

  // --- Lógica de Progresso Simplificada ---
  // Calculamos o progresso diretamente aqui para garantir reatividade máxima.
  const logs = habit.logs || [];
  const completedDays = logs.filter((l) => l.completed).length;

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const wasCompletedToday = logs.some(
    (log) => log.date === todayStr && log.completed
  );

  const categoryInfo = habitCategories.find((c) => c.id === habit.category);
  const categoryName = categoryInfo?.name || "Geral";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`bg-brand-slate/80 backdrop-blur-sm p-5 rounded-xl shadow-lg flex flex-col justify-between h-full relative overflow-hidden transition-all duration-500 ${
        isGlowing
          ? "border-brand-cyan shadow-glow-cyan"
          : "border border-brand-light-slate"
      }`}
      whileHover={{ scale: 1.03, y: -5 }}
    >
      <div>
        <h3 className="text-xl font-bold font-display text-brand-cyan">
          {habit.name}
        </h3>
        <div className="flex items-center gap-4 text-slate-400 text-xs mt-2 mb-4">
          <div className="flex items-center gap-1">
            <Tag size={12} />
            <span>{categoryName}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{habit.duration} dia(s)</span>
          </div>
        </div>
      </div>

      {/* Barra de Progresso da Missão */}
      <div className="mb-4 space-y-2">
        {/* Visualização de progresso ultra-simples com texto */}
        <div className="text-center bg-brand-dark/50 p-3 rounded-lg border border-brand-light-slate/30">
          <p className="text-sm text-slate-400">Progresso da Missão</p>
          <p className="font-mono text-2xl font-bold text-white mt-1">
            <span className="text-green-400">{completedDays}</span>
            <span className="text-slate-500"> / </span>
            <span>{habit.duration}</span>
            <span className="text-lg text-slate-400"> dias</span>
          </p>
        </div>
      </div>

      {/* Botão único para completar a missão hoje */}
      <div className="mt-4">
        <motion.button
          onClick={() => onComplete(habit.id)}
          disabled={wasCompletedToday || completingHabitId === habit.id}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-lg font-bold transition-all duration-300 disabled:cursor-not-allowed bg-green-600/20 text-green-300 hover:bg-green-600/40 disabled:bg-slate-800 disabled:text-slate-500"
          whileHover={{ scale: wasCompletedToday ? 1 : 1.05 }}
          whileTap={{ scale: wasCompletedToday ? 1 : 0.95 }}
        >
          <CheckCircle size={20} />
          {completingHabitId === habit.id
            ? "Registrando..."
            : wasCompletedToday
            ? "Concluído Hoje"
            : "Completar Hoje"}
        </motion.button>
      </div>

      {/* Botão de deletar permanece o mesmo */}
      <button
        onClick={() => onDelete(habit.id)}
        className="absolute top-3 right-3 text-slate-500 hover:text-brand-pink transition-colors"
        aria-label="Deletar hábito"
      >
        <Trash2 size={18} />
      </button>
    </motion.div>
  );
}

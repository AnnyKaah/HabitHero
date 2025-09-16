import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Trash2, Calendar, CheckCircle, Tag } from "lucide-react";
import type { Habit } from "../types";
import { useEffect } from "react";
import { format } from "date-fns/format";
import { habitCategories } from "../utils/habitCategories";

interface HabitCardProps {
  habit: Habit;
  // A função onComplete agora recebe a data da sub-missão
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
  isGlowing?: boolean;
  completingHabitId: number | null;
}

export default function HabitCard({
  habit,
  onComplete,
  onDelete,
  isGlowing,
  completingHabitId,
}: HabitCardProps) {
  // Verifica se o hábito já foi completado hoje
  const categoryInfo = habitCategories.find((c) => c.id === habit.category);
  const categoryName = categoryInfo?.name || "Geral";

  const todayStr = format(new Date(), "yyyy-MM-dd");
  const wasCompletedToday = habit.logs?.some(
    (log) => log.date === todayStr && log.completed
  );

  // Calcula o progresso da missão
  const completedDays = habit.logs?.filter((l) => l.completed).length || 0;
  const progressPercentage =
    habit.duration > 0 ? (completedDays / habit.duration) * 100 : 0;

  // Animação para o contador de dias
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, completedDays, {
      duration: 0.8,
      ease: "easeInOut",
    });
    return controls.stop;
  }, [completedDays, count]);
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
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Progresso</span>
          <span>
            <motion.span>{rounded}</motion.span> / {habit.duration} dias
          </span>
        </div>
        <div className="w-full bg-brand-dark rounded-full h-2.5 border border-brand-light-slate/50">
          <motion.div
            className={
              progressPercentage > 0
                ? "h-full rounded-full bg-gradient-to-r from-green-400 to-brand-cyan"
                : "h-full rounded-full bg-slate-700"
            }
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
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

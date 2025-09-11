import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Trash2, Calendar, Circle, CheckCircle } from "lucide-react";
import type { Habit } from "../types";
import { useEffect } from "react";
import { format } from "date-fns/format";
import { addDays } from "date-fns/addDays";
import { isToday } from "date-fns/isToday";
import { isPast } from "date-fns/isPast";
import { ptBR } from "date-fns/locale";

interface HabitCardProps {
  habit: Habit;
  // A função onComplete agora recebe a data da sub-missão
  onComplete: (id: number, date: string) => void;
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
  // Gera a lista de dias para a missão
  const missionDays = Array.from({ length: habit.duration }, (_, i) => {
    return format(addDays(new Date(habit.createdAt), i), "yyyy-MM-dd");
  });

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
        <p className="text-slate-400 text-sm mt-1 mb-4">
          <Calendar size={14} className="inline mr-1" />
          Missão de {habit.duration} dia(s)
        </p>
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
            className="bg-gradient-to-r from-brand-cyan to-brand-purple h-full rounded-full"
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Lista de sub-missões diárias */}
      <div className="mt-4 space-y-2">
        {missionDays.map((day) => {
          const log = habit.logs?.find((l) => l.date === day);
          const isCompleted = log?.completed || false;
          const isDayToday = isToday(new Date(day));
          const isDayPast = isPast(new Date(day)) && !isDayToday;
          const isDisabled = isCompleted || (!isDayToday && !isDayPast);

          return (
            <button
              key={day}
              onClick={() => onComplete(habit.id, day)}
              disabled={isDisabled}
              className="w-full flex items-center justify-between p-2 rounded-md transition-colors bg-brand-dark/50 hover:bg-brand-light-slate/20 disabled:bg-slate-800/50 disabled:cursor-not-allowed"
            >
              <span
                className={`font-semibold ${
                  isCompleted ? "text-green-400 line-through" : "text-slate-300"
                } ${isDisabled && !isCompleted ? "text-slate-600" : ""}`}
              >
                {format(new Date(day), "eeee, dd/MM", { locale: ptBR })}
              </span>
              {isCompleted ? (
                <CheckCircle size={20} className="text-green-400" />
              ) : (
                <Circle size={20} className="text-slate-500" />
              )}
            </button>
          );
        })}
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

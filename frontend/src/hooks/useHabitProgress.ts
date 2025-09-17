import { useMemo } from "react";
import { format } from "date-fns";
import type { Habit } from "../types";

/**
 * Hook customizado para gerenciar a lógica de progresso de um hábito.
 * @param habit - O objeto do hábito.
 * @returns Um objeto contendo os valores de progresso calculados.
 */
export const useHabitProgress = (habit: Habit) => {
  // Memoiza os cálculos de progresso para evitar recomputações desnecessárias.
  const { completedDays, wasCompletedToday } = useMemo(() => {
    const todayStr = format(new Date(), "yyyy-MM-dd");
    const logs = habit.logs || [];

    const completedLogs = logs.filter((l) => l.completed);
    const completedDays = completedLogs.length;

    const wasCompletedToday = completedLogs.some(
      (log) => log.date === todayStr
    );

    return { completedDays, wasCompletedToday };
  }, [habit.logs]);

  return { wasCompletedToday, completedDays };
};

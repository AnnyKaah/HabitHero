import { useState, useMemo } from "react";
import { useUser } from "../pages/UserContext";
import { useGamification } from "./useGamification";
import type { Habit } from "../types";
import type * as Icons from "lucide-react";
import { useMissionStreak } from "../pages/useMissionStreak";

export type HabitCategory = {
  title: string;
  icon: keyof typeof Icons;
  habits: Habit[];
};

export const useDashboardState = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChestModalOpen, setIsChestModalOpen] = useState(false);
  const [chestReward, setChestReward] = useState<{
    type: string;
    amount: number;
  } | null>(null);
  const [expandedQuestId, setExpandedQuestId] = useState<
    string | number | null
  >(null);
  const [currentView, setCurrentView] = useState<
    "dashboard" | "profile" | "social" | "settings"
  >("dashboard");

  const {
    state: { habits, user, completingHabitId }, // Pegamos o completingHabitId diretamente do contexto
    addHabit,
    deleteHabit,
    completeHabit, // Usaremos a função do contexto diretamente
    updateUserStats,
  } = useUser();

  // Garantimos que o usuário não é nulo neste ponto.
  const nonNullUser = user!;

  const gamification = useGamification({
    habits,
    user: nonNullUser,
    completingHabitId,
    updateUserStats,
  });

  // Transforma a lista de hábitos em uma lista de datas de conclusão para o hook de streak.
  const completionDates = useMemo(() => {
    if (!habits) return [];
    return habits
      .flatMap((habit) => habit.logs || []) // Pega todos os logs de todos os hábitos
      .filter((log) => log.completed) // Filtra apenas os concluídos
      .map((log) => new Date(log.date)); // Converte as strings de data para objetos Date
  }, [habits]);

  const missionStreak = useMissionStreak(completionDates);

  // Filtra apenas os hábitos que ainda não foram totalmente concluídos
  const activeHabits = useMemo(
    () =>
      habits.filter(
        (habit) =>
          (habit.logs?.filter((l) => l.completed).length || 0) < habit.duration
      ),
    [habits]
  );

  const categorizedHabits: HabitCategory[] = useMemo(
    () => [{ title: "Missões Ativas", icon: "Swords", habits: activeHabits }],
    [activeHabits]
  );

  const handleOpenChest = () => {
    const reward = gamification.openChest();
    setChestReward(reward);
    setIsChestModalOpen(true);
  };

  return {
    user,
    habits,
    categorizedHabits,
    isModalOpen,
    setIsModalOpen,
    isChestModalOpen,
    setIsChestModalOpen,
    chestReward,
    expandedQuestId,
    setExpandedQuestId,
    completingHabitId,
    gamification,
    missionStreak,
    addHabit,
    deleteHabit,
    completeHabit, // Passa a função do contexto diretamente
    handleOpenChest,
    currentView,
    setCurrentView,
  };
};

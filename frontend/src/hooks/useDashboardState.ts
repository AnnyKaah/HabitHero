import { useState, useMemo } from "react";
import { useUser } from "../pages/UserContext";
import { useGamification } from "./useGamification";
import { useMissionStreak } from "../pages/useMissionStreak";
import { habitCategories as dynamicCategories } from "../components/AddHabitModal";
import type { Habit } from "../types";
import * as Icons from "lucide-react";

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
  const [completingHabitId, setCompletingHabitId] = useState<number | null>(
    null
  );
  const [currentView, setCurrentView] = useState<
    "dashboard" | "profile" | "social"
  >("dashboard");

  const {
    habits,
    addHabit,
    deleteHabit,
    setUser,
    setHabits,
    user,
    completeHabit,
  } = useUser();

  // Garantimos que o usuário não é nulo neste ponto.
  const nonNullUser = user!;

  const gamification = useGamification({
    habits,
    setHabits,
    user: nonNullUser,
    setUser: setUser,
    completeHabitAndUpdateState: completeHabit,
  });

  const categorizedHabits: HabitCategory[] = useMemo(
    () =>
      dynamicCategories.map((cat) => ({
        title: cat.name,
        icon: cat.icon.displayName as keyof typeof Icons,
        habits: habits.filter((habit: Habit) => habit.category === cat.id),
      })),
    [habits]
  );

  const handleOpenChest = () => {
    const reward = gamification.openChest();
    setChestReward(reward);
    setIsChestModalOpen(true);
  };

  const handleCompleteHabit = async (id: number, date: string) => {
    setCompletingHabitId(id);
    try {
      await gamification.completeHabit(id, date);
    } finally {
      setCompletingHabitId(null);
    }
  };

  // Simulação de histórico de conclusões.
  const [completionHistory] = useState<Date[]>([
    new Date("2024-07-28T10:00:00Z"),
    new Date("2024-07-29T10:00:00Z"),
    new Date("2024-07-30T10:00:00Z"),
    new Date("2024-08-01T10:00:00Z"),
  ]);

  const missionStreak = useMissionStreak(completionHistory);

  return {
    isModalOpen,
    setIsModalOpen,
    isChestModalOpen,
    setIsChestModalOpen,
    chestReward,
    expandedQuestId,
    setExpandedQuestId,
    completingHabitId,
    currentView,
    setCurrentView,
    habits,
    addHabit,
    deleteHabit,
    user: nonNullUser,
    gamification,
    categorizedHabits,
    handleOpenChest,
    handleCompleteHabit,
    missionStreak,
  };
};

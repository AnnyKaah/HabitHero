import { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
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

  /**
   * Envolve a função `addHabit` do contexto com notificações de toast.
   */
  const handleAddHabit: typeof addHabit = (habitData) => {
    return toast.promise(
      // @ts-ignore - Spreading arguments to match the context's function signature
      addHabit(...Object.values(habitData)),
      {
        loading: "Criando nova missão...",
        success: "Missão criada com sucesso!",
        error: "Não foi possível criar a missão.",
      }
    );
  };

  /**
   * Envolve a função `deleteHabit` do contexto com notificações de toast.
   */
  const handleDeleteHabit: typeof deleteHabit = (id) => {
    return toast.promise(deleteHabit(id), {
      loading: "Deletando missão...",
      success: "Missão deletada.",
      error: "Não foi possível deletar a missão.",
    });
  };

  /**
   * Envolve a função `completeHabit` com uma notificação de sucesso.
   * Como a UI é otimista, o estado é atualizado instantaneamente.
   * O toast confirma que a alteração foi salva no servidor.
   */
  const handleCompleteHabit: typeof completeHabit = (id) => {
    // Passa o ID e a função de gamificação para a função do contexto.
    // Fornece uma função vazia como fallback para garantir que o callback nunca seja undefined.
    const promise = completeHabit(
      id,
      gamification.runGamificationEffects || (() => {})
    );

    // Envolve a promise com o toast.
    toast.promise(promise, {
      loading: "Registrando progresso...", // Mostrado brevemente enquanto a API responde.
      success: "Missão registrada com sucesso!",
      error: "Falha ao salvar. A missão foi revertida.",
    });
    return promise;
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
    addHabit: handleAddHabit, // Expõe a nova função com toast
    deleteHabit: handleDeleteHabit, // Expõe a nova função com toast
    completeHabit: handleCompleteHabit, // Expõe a nova função com toast
    handleOpenChest,
    currentView,
    setCurrentView,
  };
};

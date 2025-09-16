import { useState, useMemo } from "react";
import { DashboardUI } from "../components/DashboardUI";
import { useUser, UserProvider } from "./UserContext";
import { RefreshCw, AlertTriangle } from "lucide-react";
import type { User, Habit } from "../types";
import { useGamification } from "../hooks/useGamification";
import { useMissionStreak } from "./useMissionStreak";
import type * as Icons from "lucide-react";

export type HabitCategory = {
  title: string;
  icon: keyof typeof Icons;
  habits: Habit[];
};

function DashboardContent({ user }: { user: User }) {
  const {
    state: { habits, completingHabitId },
    addHabit,
    deleteHabit,
    completeHabit,
    updateUserStats,
  } = useUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChestModalOpen, setIsChestModalOpen] = useState(false);
  const [chestReward, setChestReward] = useState<{
    type: string;
    amount: number;
  } | null>(null);
  const [expandedQuestId, setExpandedQuestId] = useState<
    string | number | null
  >(null);

  const gamification = useGamification({
    habits,
    user,
    completingHabitId,
    updateUserStats,
  });

  const completionDates = useMemo(() => {
    if (!habits) return [];
    return habits
      .flatMap((habit) => habit.logs || [])
      .filter((log) => log.completed)
      .map((log) => new Date(log.date));
  }, [habits]);

  const missionStreak = useMissionStreak(completionDates);

  const categorizedHabits: HabitCategory[] = useMemo(
    () => [{ title: "Missões Ativas", icon: "Swords", habits: habits }],
    [habits]
  );

  const handleOpenChest = () => {
    const reward = gamification.openChest();
    setChestReward(reward);
    setIsChestModalOpen(true);
  };

  return (
    <div className="w-full">
      <DashboardUI
        user={user}
        habits={habits}
        categorizedHabits={categorizedHabits}
        isModalOpen={isModalOpen}
        isChestModalOpen={isChestModalOpen}
        chestReward={chestReward}
        expandedQuestId={expandedQuestId}
        gamification={gamification}
        completingHabitId={completingHabitId}
        missionStreak={missionStreak}
        onSetIsModalOpen={setIsModalOpen}
        onSetIsChestModalOpen={setIsChestModalOpen}
        onSetExpandedQuestId={setExpandedQuestId}
        onAddHabit={addHabit}
        onCompleteHabit={completeHabit}
        onDeleteHabit={deleteHabit}
        onOpenChest={handleOpenChest}
      />
    </div>
  );
}

function Dashboard() {
  const { state, fetchData } = useUser();
  const { isLoading, error, user } = state;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <RefreshCw className="w-12 h-12 text-brand-purple animate-spin" />
        <p className="text-slate-300 text-lg mt-4">Carregando seu reino...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <h2 className="text-2xl font-bold text-slate-200 mt-4">
          Oh, não! Um dragão atacou o servidor.
        </h2>
        <p className="text-slate-400 max-w-md mt-2">{error}</p>
        <button
          onClick={fetchData}
          className="mt-6 flex items-center gap-2 bg-brand-purple text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-purple/80 transition-colors"
        >
          <RefreshCw size={18} /> Tentar Novamente
        </button>
      </div>
    );
  }

  // Se o usuário não estiver carregado e não houver erro, não renderiza nada.
  // Isso também cobre o caso de `user` ser `null`.
  if (!user) {
    return null;
  }

  return <DashboardContent user={user} />;
}

// Este é o novo componente que deve ser usado na sua rota.
// Ele garante que o UserProvider envolva o Dashboard.
export default function DashboardPage() {
  return (
    <UserProvider>
      <Dashboard />
    </UserProvider>
  );
}

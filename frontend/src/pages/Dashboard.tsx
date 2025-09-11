import { useDashboardState } from "../hooks/useDashboardState";
import { DashboardUI } from "../components/DashboardUI";
import { useUser } from "./UserContext";
import ProfilePage from "./ProfilePage";
import SocialPage from "./SocialPage";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface DashboardProps {
  onLogout: () => void;
}

function DashboardContent({ onLogout }: DashboardProps) {
  const state = useDashboardState();

  if (state.currentView === "profile") {
    return (
      <ProfilePage
        onBack={() => state.setCurrentView("dashboard")}
        isSubmitting={false}
      />
    );
  }

  if (state.currentView === "social") {
    return <SocialPage onBack={() => state.setCurrentView("dashboard")} />;
  }

  return (
    <DashboardUI
      user={state.user}
      habits={state.habits}
      categorizedHabits={state.categorizedHabits}
      isModalOpen={state.isModalOpen}
      isChestModalOpen={state.isChestModalOpen}
      chestReward={state.chestReward}
      expandedQuestId={state.expandedQuestId}
      gamification={state.gamification}
      completingHabitId={state.completingHabitId}
      missionStreak={state.missionStreak}
      onLogout={onLogout}
      onSetIsModalOpen={state.setIsModalOpen}
      onSetIsChestModalOpen={state.setIsChestModalOpen}
      onSetExpandedQuestId={state.setExpandedQuestId}
      onAddHabit={state.addHabit}
      onCompleteHabit={state.handleCompleteHabit}
      onDeleteHabit={state.deleteHabit}
      onOpenChest={state.handleOpenChest}
      onSetCurrentView={state.setCurrentView}
    />
  );
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const { isLoading, error, fetchData, user } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-deep-slate">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-12 h-12 text-brand-purple animate-spin" />
          <p className="text-slate-300 text-lg">Carregando seu reino...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-deep-slate text-center">
        <div className="flex flex-col items-center gap-4 p-8 bg-brand-slate/50 rounded-xl">
          <AlertTriangle className="w-12 h-12 text-red-500" />
          <h2 className="text-2xl font-bold text-slate-200">
            Oh, não! Um dragão atacou o servidor.
          </h2>
          <p className="text-slate-400 max-w-md">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 flex items-center gap-2 bg-brand-purple text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-purple/80 transition-colors"
          >
            <RefreshCw size={18} /> Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // Se o usuário não estiver carregado e não houver erro, não renderiza nada.
  // Isso também cobre o caso de `user` ser `null`.
  if (!user) {
    return null;
  }

  return <DashboardContent onLogout={onLogout} />;
}

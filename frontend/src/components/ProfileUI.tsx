import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import type { User, Habit } from "../types";
import type { HabitCategory as CategorizedHabit } from "../hooks/useDashboardState";

import AvatarSelectionModal from "./AvatarSelectionModal";
import AchievementCard from "./AchievementCard";
import UserStatsCard from "../pages/UserStatsCard";
import HeroSummaryCard from "../pages/HeroSummaryCard";
import { achievementsData } from "../pages/achievementsData";
import XPChart from "./XPChart";
import { ProfileHeader } from "./ProfileHeader";

interface ProfileUIProps {
  user: User;
  habits: Habit[];
  isEditingUsername: boolean;
  isAvatarModalOpen: boolean;
  newUsername: string;
  avatarSrc: string;
  avatarIds: string[];
  profileStats: {
    totalHabitsCompleted: number;
    strongestHabit: Habit | null;
    favoriteCategoryName: string;
    categorizedHabits: CategorizedHabit[];
  };
  isSubmitting: boolean;
  onBack: () => void;
  onSetIsEditingUsername: (isEditing: boolean) => void;
  onSetIsAvatarModalOpen: (isOpen: boolean) => void;
  onSetNewUsername: (username: string) => void;
  onSaveUsername: () => void;
  onSelectAvatar: (avatarId: string) => void;
}

export const ProfileUI: React.FC<ProfileUIProps> = ({
  user,
  habits,
  isEditingUsername,
  isAvatarModalOpen,
  newUsername,
  avatarSrc,
  avatarIds,
  profileStats,
  isSubmitting,
  onBack,
  onSetIsEditingUsername,
  onSetIsAvatarModalOpen,
  onSetNewUsername,
  onSaveUsername,
  onSelectAvatar,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 md:p-8 bg-slate-900 min-h-screen text-white"
    >
      <AvatarSelectionModal
        isOpen={isAvatarModalOpen}
        onClose={() => onSetIsAvatarModalOpen(false)}
        avatarIds={avatarIds}
        onSelectAvatar={onSelectAvatar}
        currentAvatarId={user.avatarId || "avatar1"}
      />

      <header className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-300 hover:text-brand-purple transition-colors"
        >
          <ArrowLeft size={20} />
          Voltar ao Painel
        </button>

        <ProfileHeader
          user={user}
          avatarSrc={avatarSrc}
          isEditingUsername={isEditingUsername}
          newUsername={newUsername}
          isSubmitting={isSubmitting}
          onSetIsEditingUsername={onSetIsEditingUsername}
          onSetNewUsername={onSetNewUsername}
          onSaveUsername={onSaveUsername}
          onOpenAvatarModal={() => onSetIsAvatarModalOpen(true)}
        />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <h2 className="text-2xl font-bold text-brand-cyan border-b-2 border-brand-cyan/20 pb-2">
            Estatísticas
          </h2>
          <HeroSummaryCard
            totalHabitsCompleted={profileStats.totalHabitsCompleted}
            activeHabitsCount={habits.length}
            strongestHabit={profileStats.strongestHabit}
            favoriteCategoryName={profileStats.favoriteCategoryName}
          />
          <UserStatsCard
            user={user}
            categories={profileStats.categorizedHabits}
          />
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-yellow-400 border-b-2 border-yellow-400/20 pb-2 mb-8">
            Galeria de Conquistas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {achievementsData.map((ach) => (
              <AchievementCard
                key={ach.id}
                achievement={ach}
                isUnlocked={user.unlockedAchievementIds.includes(ach.id)}
              />
            ))}
          </div>
        </div>

        {/* Gráfico de XP movido para ocupar a largura total abaixo das outras seções */}
        <div className="lg:col-span-3 mt-8">
          <h2 className="text-2xl font-bold text-brand-cyan border-b-2 border-brand-cyan/20 pb-2 mb-8">
            Distribuição de XP por Missão
          </h2>
          <XPChart habits={habits} />
        </div>
      </div>
    </motion.div>
  );
};

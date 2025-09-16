import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
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
      className="p-4 md:p-8 w-full max-w-screen-lg mx-auto text-white"
    >
      <AvatarSelectionModal
        isOpen={isAvatarModalOpen}
        onClose={() => onSetIsAvatarModalOpen(false)}
        avatarIds={avatarIds}
        onSelectAvatar={onSelectAvatar}
        currentAvatarId={user.avatarId || "avatar1"}
      />

      <header className="flex items-center justify-between mb-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-300 hover:text-brand-purple transition-colors"
        >
          <ArrowLeft size={20} />
          Voltar ao Painel
        </Link>

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

      {/* Seção Principal de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="md:col-span-2 lg:col-span-1 space-y-8">
          <h2 className="text-2xl font-bold text-brand-cyan border-b-2 border-brand-cyan/20 pb-2">
            Estatísticas
          </h2>
          <UserStatsCard
            user={user}
            categories={profileStats.categorizedHabits}
          />
        </div>
        <div className="md:col-span-2 lg:col-span-1 space-y-8">
          <XPChart habits={habits} />
        </div>
        <div className="md:col-span-2 lg:col-span-1 space-y-8">
          <HeroSummaryCard
            totalHabitsCompleted={profileStats.totalHabitsCompleted}
            activeHabitsCount={habits.length}
            strongestHabit={profileStats.strongestHabit}
            favoriteCategoryName={profileStats.favoriteCategoryName}
          />
        </div>
      </div>

      {/* Rodapé com a Galeria de Conquistas */}
      <footer className="mt-12">
        <h2 className="text-2xl font-bold text-yellow-400 border-b-2 border-yellow-400/20 pb-2 mb-8">
          Galeria de Conquistas
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {achievementsData.map((ach) => (
            <AchievementCard
              key={ach.id}
              achievement={ach}
              isUnlocked={user.unlockedAchievementIds.includes(ach.id)}
            />
          ))}
        </div>
      </footer>
    </motion.div>
  );
};

import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import HabitCard from "./HabitCard";
import { Plus, LogOut, User as UserIcon, Users } from "lucide-react";

import AddHabitModal from "./AddHabitModal";
import ChestOpeningModal from "./ChestOpeningModal";
import XPProgressBar from "./XPProgressBar";
import RoleplayIntro from "./RoleplayIntro";
import DailyQuestCard from "./DailyQuestCard";
import InstructionsMap from "./InstructionsMap";
import EmptyState from "./EmptyState";
import CategorySection from "./CategorySection";
import BossBattle from "./BossBattle";
import RewardChest from "./RewardChest";
import AchievementsSection from "./AchievementsSection";
import Mascot from "./Mascot";
import JourneyMap from "./JourneyMap";

import { HeaderStats } from "./HeaderStats";
import type { Habit, User } from "../types";
import type { HabitCategory } from "../hooks/useDashboardState";
import { achievementsData } from "../pages/achievementsData";

interface DashboardUIProps {
  user: User;
  habits: Habit[];
  categorizedHabits: HabitCategory[];
  isModalOpen: boolean;
  isChestModalOpen: boolean;
  chestReward: { type: string; amount: number } | null;
  expandedQuestId: string | number | null;
  completingHabitId: number | null;
  gamification: any; // Simplificado para o exemplo, idealmente tipar o retorno do useGamification
  missionStreak: number;
  onLogout: () => void;
  onSetIsModalOpen: (isOpen: boolean) => void;
  onSetIsChestModalOpen: (isOpen: boolean) => void;
  onSetExpandedQuestId: (id: string | number | null) => void;
  onAddHabit: (
    name: string,
    description: string,
    category: string,
    duration: number
  ) => Promise<void>;
  onCompleteHabit: (id: number, date: string) => Promise<void>;
  onDeleteHabit: (id: number) => Promise<void>;
  onOpenChest: () => void;
  onSetCurrentView: (view: "dashboard" | "profile" | "social") => void;
}

export const DashboardUI: React.FC<DashboardUIProps> = ({
  user,
  habits,
  categorizedHabits,
  isModalOpen,
  isChestModalOpen,
  chestReward,
  expandedQuestId,
  completingHabitId,
  gamification,
  missionStreak,
  onLogout,
  onSetIsModalOpen,
  onSetIsChestModalOpen,
  onSetExpandedQuestId,
  onAddHabit,
  onCompleteHabit,
  onDeleteHabit,
  onOpenChest,
  onSetCurrentView,
}) => {
  const constraintsRef = useRef(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      ref={constraintsRef}
    >
      {gamification.showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={400}
          gravity={0.1}
          onConfettiComplete={(confetti) => {
            gamification.setShowConfetti(false);
            confetti?.reset();
          }}
        />
      )}

      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => onSetIsModalOpen(false)}
        onAddHabit={onAddHabit}
      />
      <ChestOpeningModal
        isOpen={isChestModalOpen}
        onClose={() => onSetIsChestModalOpen(false)}
        reward={chestReward}
      />

      <header className="flex justify-between items-center bg-slate-900/80 backdrop-blur-md p-4 md:p-6 rounded-xl border border-slate-700 shadow-lg mb-6 mx-4 md:mx-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-purple tracking-wide flex items-center gap-2">
          Painel do Herói
        </h1>
        <HeaderStats
          dailyProgress={{
            completed: gamification.dailyQuests.filter((q: any) => q.completed)
              .length,
            total: gamification.dailyQuests.length,
          }}
          achievements={{
            unlocked: user.unlockedAchievementIds.length,
            total: achievementsData.length,
          }}
          streak={missionStreak}
        />
        <div className="flex items-center gap-6">
          <XPProgressBar
            level={user.level}
            xp={user.xp}
            xpToNextLevel={user.xpToNextLevel}
          />
          <motion.button
            onClick={() => onSetCurrentView("profile")}
            className="text-slate-300 hover:text-brand-cyan transition flex items-center gap-1"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <UserIcon size={20} /> Perfil
          </motion.button>
          <motion.button
            onClick={() => onSetCurrentView("social")}
            className="text-slate-300 hover:text-brand-cyan transition flex items-center gap-1"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Users size={20} /> Social
          </motion.button>
          <motion.button
            onClick={onLogout}
            className="text-slate-300 hover:text-red-400 transition flex items-center gap-1"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <LogOut size={20} /> Sair
          </motion.button>
        </div>
      </header>

      <main className="p-4 md:p-8 grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <RoleplayIntro />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <BossBattle
              name={gamification.boss.name}
              image={gamification.boss.image}
              currentHp={gamification.boss.hp}
              totalHp={gamification.BOSS_MAX_HP}
              isTakingDamage={gamification.isBossTakingDamage}
              isDefeated={gamification.isBossDefeated}
            />
            <RewardChest
              progress={gamification.chestProgress}
              goal={gamification.CHEST_GOAL}
              isReady={gamification.chestProgress >= gamification.CHEST_GOAL}
              onOpen={onOpenChest}
            />
          </div>
          <div className="flex justify-center">
            <motion.button
              onClick={() => onSetIsModalOpen(true)}
              className="flex items-center gap-2 bg-brand-purple/20 text-brand-purple font-bold py-2 px-5 rounded-lg border-2 border-brand-purple hover:bg-brand-purple/30 hover:shadow-glow-purple transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Plus size={20} />
              Nova Missão
            </motion.button>
          </div>
          {habits.length === 0 ? (
            <EmptyState onAddHabit={() => onSetIsModalOpen(true)} />
          ) : (
            <div className="space-y-8">
              {categorizedHabits
                .filter((cat) => cat.habits.length > 0)
                .map((cat) => (
                  <div key={cat.title} className="space-y-6">
                    <CategorySection category={cat} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {cat.habits.map((habit) => (
                        <HabitCard
                          key={habit.id}
                          habit={habit}
                          onComplete={onCompleteHabit}
                          onDelete={onDeleteHabit}
                          isGlowing={
                            habit.id === gamification.justCompletedHabitId
                          }
                          completingHabitId={completingHabitId}
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <InstructionsMap />
          <div className="bg-brand-slate/50 p-4 rounded-xl border border-brand-light-slate">
            <h3 className="font-display text-xl font-bold text-brand-cyan mb-3">
              Missões Diárias
            </h3>
            <div className="space-y-2">
              {gamification.dailyQuests.map((quest: any) => {
                const isExpanded = quest.id === expandedQuestId;
                return (
                  <DailyQuestCard
                    key={quest.id}
                    quest={quest}
                    isExpanded={isExpanded}
                    onComplete={() => gamification.completeDailyQuest(quest.id)}
                    onToggle={() =>
                      onSetExpandedQuestId(isExpanded ? null : quest.id)
                    }
                  />
                );
              })}
            </div>
          </div>
          <AchievementsSection unlockedIds={user.unlockedAchievementIds} />
        </aside>
      </main>

      <AnimatePresence>
        {!isChestModalOpen && !isModalOpen && (
          <motion.div
            className="fixed bottom-40 left-1/2 -translate-x-1/2 z-50"
            drag
            dragConstraints={constraintsRef}
            dragMomentum={false}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <Mascot
              isJumping={gamification.mascotIsJumping}
              isEvolving={gamification.showLevelUp}
              user={user}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="w-full p-4 md:p-8 mt-8">
        <JourneyMap currentLevel={user.level} />
      </footer>
    </motion.div>
  );
};

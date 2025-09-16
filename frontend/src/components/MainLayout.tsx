import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, User as UserIcon, Users, Settings } from "lucide-react";
import { useUser } from "../pages/UserContext";
import XPProgressBar from "./XPProgressBar"; // No changes needed here
import { HeaderStats } from "./HeaderStats";
import { achievementsData } from "../pages/achievementsData";
import { useGamification } from "../hooks/useGamification";
import type { Habit, User } from "../types";
import { PageLayout } from "./PageLayout";
import { useMissionStreak } from "../pages/useMissionStreak";

interface MainLayoutProps {
  onLogout: () => void;
}

const LayoutContent: React.FC<MainLayoutProps & { user: User }> = ({
  onLogout,
  user,
}) => {
  const {
    state: { habits, completingHabitId },
    updateUserStats,
  } = useUser();
  const location = useLocation();

  const gamification = useGamification({
    habits: habits,
    user: user,
    completingHabitId: completingHabitId,
    updateUserStats: updateUserStats,
  });

  const completionDates = React.useMemo(() => {
    if (!habits) return [];
    return habits
      .flatMap((habit: Habit) => habit.logs || [])
      .filter((log: { completed: boolean }) => log.completed)
      .map((log: { date: string }) => new Date(log.date));
  }, [habits]);
  const missionStreak = useMissionStreak(completionDates);

  const navLinks = [
    { path: "/profile", icon: UserIcon, label: "Perfil" },
    { path: "/social", icon: Users, label: "Social" },
    { path: "/settings", icon: Settings, label: "Configurações" },
  ];

  return (
    <PageLayout className="justify-start">
      <header className="flex justify-between items-center bg-slate-900/80 backdrop-blur-md p-4 md:p-6 rounded-xl border border-slate-700 shadow-lg my-6 mx-4 md:mx-8">
        <Link to="/">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-purple tracking-wide flex items-center gap-2">
            Painel do Herói
          </h1>
        </Link>
        <HeaderStats
          dailyProgress={{
            // No changes needed here
            completed: gamification.dailyQuests.filter((q: any) => q.completed)
              .length,
            total: gamification.dailyQuests.length,
          }} // No changes needed here
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
          {navLinks.map((link) => (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              key={link.path}
            >
              <Link
                to={link.path}
                className={`text-slate-300 hover:text-brand-cyan transition flex items-center gap-1 ${
                  location.pathname === link.path ? "text-brand-cyan" : ""
                }`}
              >
                <link.icon size={20} /> {link.label}
              </Link>
            </motion.div>
          ))}
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

      <main className="mx-4 md:mx-8">
        {/* O Outlet renderiza o componente da rota filha */}
        <Outlet />
      </main>
    </PageLayout>
  );
};

const MainLayout: React.FC<MainLayoutProps> = ({ onLogout }) => {
  const {
    state: { user },
  } = useUser();

  if (!user) {
    return null; // Or a loading spinner, as user data is essential for the layout
  }

  return <LayoutContent onLogout={onLogout} user={user} />;
};

export default MainLayout;

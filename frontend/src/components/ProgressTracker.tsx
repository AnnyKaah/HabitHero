import { motion } from "framer-motion";
import { CheckCircle, Flame, Trophy, Calendar } from "lucide-react";
// No changes needed here
// Tipos de dados que o componente espera receber
interface DailyQuest {
  id: number;
  title: string;
  completed: boolean;
}

interface ProgressTrackerProps {
  dailyQuests: DailyQuest[];
  streak: number;
  unlockedAchievements: number;
  totalAchievements: number;
}

// Componente para um único dia no calendário de streak
const StreakDay = ({
  active,
  isToday,
}: {
  active: boolean;
  isToday: boolean;
}) => (
  <div className="flex flex-col items-center gap-1">
    <motion.div
      className={`w-10 h-10 rounded-full flex items-center justify-center
        ${active ? "bg-orange-400/80" : "bg-slate-700/50"}
        ${
          isToday ? "border-2 border-orange-300" : "border-2 border-transparent"
        }`}
      whileHover={{ scale: 1.1 }}
    >
      <Flame size={22} className={active ? "text-white" : "text-slate-500"} />
    </motion.div>
    <span className="text-xs text-slate-400">{isToday ? "Hoje" : ""}</span>
  </div>
);

export default function ProgressTracker({
  dailyQuests,
  streak,
  unlockedAchievements,
  totalAchievements,
}: ProgressTrackerProps) {
  const completedQuests = dailyQuests.filter((q) => q.completed).length;
  const totalQuests = dailyQuests.length;
  const progressPercentage =
    totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="bg-brand-slate/50 border border-brand-light-slate rounded-2xl shadow-lg p-4 md:p-6 w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Progresso Diário */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-brand-cyan" size={20} />
            <h3 className="font-bold text-lg text-slate-200">
              Progresso Diário
            </h3>
          </div>
          <p className="text-sm text-slate-400">
            {completedQuests} de {totalQuests} missões concluídas hoje.
          </p>
          <div className="w-full bg-slate-700 rounded-full h-2.5 mt-1">
            <motion.div
              className="bg-gradient-to-r from-brand-purple to-brand-cyan h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* 3. Ranking e Conquistas */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-400" size={20} />
            <h3 className="font-bold text-lg text-slate-200">Conquistas</h3>
          </div>
          <p className="text-sm text-slate-400">
            Você desbloqueou {unlockedAchievements} de {totalAchievements}{" "}
            medalhas.
          </p>
          <div className="flex gap-2 mt-1">
            {/* Exemplo de ícones de conquistas */}
            <span className="text-lg" title="Pioneiro">
              🚀
            </span>
            <span className="text-lg" title="Iniciado">
              ✨
            </span>
            <span
              className="text-lg text-slate-600"
              title="Persistente (Bloqueada)"
            >
              🔁
            </span>
          </div>
        </div>

        {/* 2. Calendário de Streaks (movido para o final) */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="text-orange-400" size={20} />
            <h3 className="font-bold text-lg text-slate-200">
              Streak de Missões
            </h3>
          </div>
          <div className="flex justify-around items-end pt-1">
            {/* Simulação para 7 dias, com o dia atual sendo o último */}
            {[...Array(7)].map((_, i) => (
              <StreakDay key={i} active={i < streak} isToday={i === 6} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

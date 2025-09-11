import { motion } from "framer-motion";
import { Achievement } from "../pages/achievementsData";

interface AchievementCardProps {
  achievement: Achievement;
  isUnlocked: boolean;
}

export default function AchievementCard({
  achievement,
  isUnlocked,
}: AchievementCardProps) {
  return (
    <motion.div
      className={`p-4 rounded-xl border transition-all duration-300 text-center ${
        isUnlocked
          ? "bg-yellow-400/10 border-yellow-400/30 shadow-lg shadow-yellow-500/10"
          : "bg-slate-800/50 border-slate-700"
      }`}
      whileHover={{ scale: 1.05, y: -5 }}
    >
      <achievement.icon
        className={`w-12 h-12 mb-3 mx-auto ${
          isUnlocked ? "text-yellow-400" : "text-slate-600"
        }`}
      />
      <h4
        className={`font-bold text-lg ${
          isUnlocked ? "text-slate-100" : "text-slate-500"
        }`}
      >
        {achievement.name}
      </h4>
      <p className="text-sm text-slate-400 mt-1">
        {isUnlocked ? achievement.description : "????"}
      </p>
    </motion.div>
  );
}

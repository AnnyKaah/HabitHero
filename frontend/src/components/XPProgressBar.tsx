import { motion } from "framer-motion";
// No changes needed here
interface XPProgressBarProps {
  xp: number;
  xpToNextLevel: number;
  level: number;
}

export default function XPProgressBar({
  xp,
  xpToNextLevel,
  level,
}: XPProgressBarProps) {
  const progressPercentage = (xp / xpToNextLevel) * 100;

  return (
    <div className="w-48">
      <div className="flex justify-between w-full mb-1 text-xs">
        <span className="font-bold text-slate-200">Nível {level}</span>
        <span className="font-medium text-slate-400">
          {xp} / {xpToNextLevel} XP
        </span>
      </div>
      <div className="w-full bg-slate-700/50 rounded-full h-3.5 group relative overflow-hidden border border-slate-600">
        <motion.div
          className="bg-gradient-to-r from-brand-purple to-brand-cyan h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

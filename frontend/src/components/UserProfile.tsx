import { LogOut } from "lucide-react";
import { motion } from "framer-motion";
// No changes needed here
interface UserProfileProps {
  username: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  showLevelUpEffect: boolean;
  onLogout: () => void;
}

export default function UserProfile({
  username,
  level,
  xp,
  xpToNextLevel,
  showLevelUpEffect,
  onLogout,
}: UserProfileProps) {
  const xpPercentage = (xp / xpToNextLevel) * 100;

  return (
    <div className="bg-gradient-to-br from-brand-slate/80 to-brand-deep-slate/70 p-4 rounded-xl border border-brand-light-slate/50 relative overflow-hidden backdrop-blur-sm">
      {showLevelUpEffect && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 via-transparent to-brand-purple/30"
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: [0, 1, 0], scale: 1 }}
          transition={{ duration: 1.5, times: [0, 0.5, 1] }}
        />
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-brand-purple to-brand-pink rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            {username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-200">{username}</h3>
            <motion.p
              key={level} // Força a re-animação quando o nível muda
              initial={{ scale: 1 }}
              animate={showLevelUpEffect ? { scale: [1, 1.5, 1] } : {}}
              transition={
                showLevelUpEffect ? { duration: 0.5, ease: "circOut" } : {}
              }
              className="text-sm text-brand-cyan font-bold"
            >
              Nível {level}
            </motion.p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
          title="Sair"
        >
          <LogOut size={20} />
        </button>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>XP</span>
          <span>
            {xp} / {xpToNextLevel}
          </span>
        </div>
        <div className="w-full bg-brand-dark-slate rounded-full h-2.5">
          <motion.div
            className="bg-gradient-to-r from-brand-cyan to-brand-purple h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${xpPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import chestClosed from "../assets/chest-closed.png";
import chestGlowing from "../assets/chest-glowing.png"; // No changes needed here

interface RewardChestProps {
  progress: number;
  goal: number;
  isReady: boolean;
  onOpen: () => void;
}

export default function RewardChest({
  progress,
  goal,
  isReady,
  onOpen,
}: RewardChestProps) {
  const progressPercentage = (progress / goal) * 100;

  return (
    <div className="bg-brand-slate/50 p-4 rounded-xl border border-brand-light-slate text-center">
      <h3 className="font-display text-xl font-bold text-amber-400 mb-3">
        Baú de Recompensas
      </h3>
      <motion.button
        onClick={onOpen}
        disabled={!isReady}
        className="relative disabled:cursor-not-allowed"
        whileHover={isReady ? { scale: 1.1 } : {}}
        whileTap={isReady ? { scale: 0.9 } : {}}
      >
        {isReady && (
          <motion.div
            className="absolute -inset-2 bg-amber-400/20 rounded-full blur-lg"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        <img
          src={isReady ? chestGlowing : chestClosed}
          alt="Baú de Recompensa"
          className="w-24 h-24 mx-auto drop-shadow-lg"
        />
      </motion.button>
      <p className="text-slate-400 text-sm mt-2 h-5">
        {isReady
          ? "Pronto para abrir!"
          : `Complete mais ${goal - progress} missões!`}
      </p>
      <div className="w-full bg-brand-dark-slate rounded-full h-2.5 mt-2 border border-amber-500/50">
        <motion.div
          className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

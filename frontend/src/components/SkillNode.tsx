// src/components/SkillNode.tsx
import { motion } from "framer-motion";
import { Lock, Zap } from "lucide-react"; // No changes needed here

interface SkillNodeProps {
  data: {
    name: string;
    cost: number;
    isUnlocked: boolean;
    onUnlock: () => void;
  };
}

export default function SkillNode({ data }: SkillNodeProps) {
  return (
    <motion.div
      className={`w-32 h-32 p-4 rounded-full flex flex-col items-center justify-center text-center border-4 transition-all
        ${
          data.isUnlocked
            ? "bg-brand-cyan/20 border-brand-cyan shadow-glow-cyan"
            : "bg-brand-slate border-brand-light-slate cursor-pointer hover:border-brand-cyan/50"
        }`}
      onClick={!data.isUnlocked ? data.onUnlock : undefined}
      whileHover={{ scale: data.isUnlocked ? 1 : 1.05 }}
    >
      {data.isUnlocked ? (
        <Zap size={32} className="text-brand-cyan" />
      ) : (
        <Lock size={32} className="text-slate-500" />
      )}
      <p className="font-bold text-sm mt-2">{data.name}</p>
      {!data.isUnlocked && (
        <p className="font-mono text-xs text-amber-400">{data.cost} XP</p>
      )}
    </motion.div>
  );
}

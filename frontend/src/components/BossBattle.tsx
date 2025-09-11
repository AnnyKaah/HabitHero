// src/components/BossBattle.tsx
import { motion } from "framer-motion";
// No changes needed here
interface BossBattleProps {
  name: string;
  image: string;
  currentHp: number;
  totalHp: number;
  isTakingDamage: boolean; // Para disparar a animação de dano
  isDefeated: boolean; // Para disparar a animação de derrota
}

export default function BossBattle({
  name,
  image,
  currentHp,
  totalHp,
  isTakingDamage,
  isDefeated,
}: BossBattleProps) {
  const healthPercentage = (currentHp / totalHp) * 100;
  return (
    <div className="bg-brand-slate/50 p-4 rounded-xl border border-brand-light-slate text-center">
      <h3 className="font-display text-xl font-bold text-brand-pink mb-2">
        Batalha de Chefe
      </h3>
      <p className="text-slate-400 text-sm mb-3">
        Derrote a <span className="font-bold text-brand-pink">{name}</span>!
      </p>
      <motion.img
        src={image}
        alt={name}
        className="mx-auto h-32 w-32 mb-4 drop-shadow-[0_4px_8px_rgba(236,72,153,0.4)]"
        animate={(() => {
          if (isDefeated) {
            return {
              opacity: 0,
              scale: 0.5,
              rotate: -45,
              filter: "grayscale(100%) blur(5px)",
            };
          }
          if (isTakingDamage) {
            return { x: [0, -5, 5, -5, 0], opacity: [1, 0.7, 1] };
          }
          return {};
        })()}
        transition={
          isDefeated ? { duration: 1.5, ease: "anticipate" } : { duration: 0.3 }
        }
      />
      <div className="w-full bg-brand-dark-slate rounded-full h-5 border-2 border-brand-pink/50 overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-red-500 to-brand-pink h-full flex items-center justify-center"
          initial={{ width: "100%" }}
          animate={{ width: `${healthPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span className="text-xs font-bold text-white drop-shadow-md">
            {currentHp} / {totalHp} HP
          </span>
        </motion.div>
      </div>
    </div>
  );
}

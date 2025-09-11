import { motion, useAnimationControls, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
// No changes needed here
// Importando todas as imagens do mascote
import idleMascotBasic from "../assets/habi_chan_idle.png";
import jumpMascotBasic from "../assets/habi_chan_jump.png";
import idleMascotIntermediate from "../assets/habi_chan_idle-intermediate.png";
import jumpMascotIntermediate from "../assets/habi_chan-intermediate-jump.png";
import idleMascotAdvanced from "../assets/habi_chan_idle-advanced.png";
import jumpMascotAdvanced from "../assets/habi_chan_idle-advanced-jump.png";

interface User {
  level: number;
  xp: number;
  xpToNextLevel: number;
}

interface MascotProps {
  isJumping: boolean;
  isEvolving: boolean;
  user: User;
}

const MAX_LEVEL = 30; // Nível máximo para cálculo de progresso

const motivationalTips = [
  "Um pequeno passo todo dia faz uma grande diferença!",
  "Lembre-se do seu porquê!",
  "Você é mais forte do que pensa!",
  "Consistência é a chave do sucesso.",
];

export default function Mascot({ isJumping, isEvolving, user }: MascotProps) {
  const { level, xp, xpToNextLevel } = user;
  const controls = useAnimationControls();
  const [isHovered, setIsHovered] = useState(false);
  const [currentTip, setCurrentTip] = useState("");

  // Lógica de Evolução com base no progresso percentual
  let idleSrc = idleMascotBasic;
  let jumpSrc = jumpMascotBasic;
  const progressPercent = (level / MAX_LEVEL) * 100;

  if (progressPercent >= 67) {
    idleSrc = idleMascotAdvanced;
    jumpSrc = jumpMascotAdvanced;
  } else if (progressPercent >= 34) {
    idleSrc = idleMascotIntermediate;
    jumpSrc = jumpMascotIntermediate;
  }

  // Seleciona a imagem correta com base no estado atual
  const imageSrc = isJumping ? jumpSrc : idleSrc;

  // Dispara a animação de evolução quando o estado 'isEvolving' muda
  useEffect(() => {
    if (isEvolving) {
      const evolutionAnimation = async () => {
        // Estágio 1: Carregamento de energia
        await controls.start({
          y: -20,
          scale: 1.1,
          filter:
            "brightness(200%) drop-shadow(0 0 15px rgba(255, 255, 255, 0.8))",
          transition: { duration: 0.4, ease: "easeOut" },
        });

        // Estágio 2: Explosão e Evolução
        await controls.start({
          scale: [1.1, 2.5, 1],
          rotate: [0, 180, 360],
          filter: [
            "brightness(200%) drop-shadow(0 0 15px #fff)",
            "brightness(500%) drop-shadow(0 0 30px #fff)",
            "brightness(100%) drop-shadow(0 0 0px #fff)",
          ],
          transition: { duration: 0.8, ease: "circOut", times: [0, 0.3, 1] },
        });

        // Estágio 3: Pouso suave
        await controls.start({
          y: 0,
          transition: { type: "spring", stiffness: 300, damping: 15 },
        });
      };

      evolutionAnimation();
    }
  }, [isEvolving, controls]);

  const handleMouseEnter = () => {
    const statusTip = `Nível: ${level} | XP: ${xp}/${xpToNextLevel}`;
    const allTips = [...motivationalTips, statusTip];
    const randomTip = allTips[Math.floor(Math.random() * allTips.length)];
    setCurrentTip(randomTip);
    setIsHovered(true);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="relative flex flex-col items-center cursor-grab active:cursor-grabbing"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full mb-2 w-48 bg-slate-900 text-white text-xs text-center rounded-lg p-2 shadow-lg border border-brand-purple"
            >
              {currentTip}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-[-8px] w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-slate-900" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          animate={controls} // Controla a animação de evolução
        >
          <motion.div
            // Animação de pulo ou flutuação
            animate={{ y: isJumping ? -30 : [0, -8, 0] }}
            transition={{
              y: isJumping
                ? {
                    type: "spring",
                    stiffness: 500,
                    damping: 15,
                    repeat: 1,
                    repeatType: "reverse",
                  }
                : { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <img
              key={imageSrc} // A 'key' força o React a recriar o elemento, garantindo uma transição suave da imagem
              src={imageSrc}
              alt="Mascote Habi-chan"
              width="120"
              height="120"
              className="drop-shadow-[0_4px_8px_rgba(192,132,252,0.4)]"
            />
          </motion.div>
        </motion.div>
        <p className="mt-2 text-sm font-bold text-slate-300 bg-slate-900/50 px-2 py-1 rounded">
          {isJumping ? "Missão Cumprida!" : "Habi-Chan"}
        </p>
      </motion.div>
    </div>
  );
}

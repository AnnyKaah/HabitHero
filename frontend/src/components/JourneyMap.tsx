import { motion } from "framer-motion";
import { MapPin, Shield, Flag, Mountain, Castle } from "lucide-react";
import React from "react"; // No changes needed here

interface JourneyMapProps {
  currentLevel: number;
}

const milestones = [
  { level: 1, name: "O Começo", icon: Flag, offset: "0%" },
  { level: 5, name: "Colinas da Coragem", icon: Mountain, offset: "25%" },
  { level: 10, name: "Forte da Disciplina", icon: Castle, offset: "50%" },
  { level: 15, name: "Pico da Persistência", icon: Mountain, offset: "75%" },
  { level: 20, name: "Cidadela Lendária", icon: Shield, offset: "100%" },
];

const TOTAL_LEVELS_ON_MAP = 20; // O nível máximo exibido no mapa

interface MilestoneProps {
  milestone: {
    level: number;
    name: string;
    icon: React.ElementType;
    offset: string;
  };
  currentLevel: number;
}

const Milestone = ({ milestone, currentLevel }: MilestoneProps) => {
  const isUnlocked = currentLevel >= milestone.level;

  return (
    <motion.div
      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group z-10"
      style={{ left: milestone.offset }}
      title={`Nível ${milestone.level}: ${milestone.name}`}
    >
      <div
        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 relative ${
          isUnlocked
            ? "bg-green-500/30 border-green-400 shadow-lg shadow-green-500/30"
            : "bg-slate-700 border-slate-600"
        }`}
      >
        {isUnlocked && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-50"></span>
        )}
        <milestone.icon
          className={`w-5 h-5 z-10 ${
            isUnlocked ? "text-green-300" : "text-slate-500"
          }`}
        />
      </div>
      <div className="absolute bottom-full mb-2 w-32 p-2 text-xs text-center text-slate-200 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 left-1/2 -translate-x-1/2">
        Nível {milestone.level}: {milestone.name}
      </div>
    </motion.div>
  );
};

export default function JourneyMap({ currentLevel }: JourneyMapProps) {
  const playerProgress =
    (Math.min(currentLevel, TOTAL_LEVELS_ON_MAP) / TOTAL_LEVELS_ON_MAP) * 100;

  return (
    <div className="bg-gradient-to-b from-brand-slate/50 to-brand-deep-slate/60 p-4 rounded-2xl border border-brand-light-slate/50 shadow-lg">
      <h3 className="font-display text-lg font-bold text-green-400 mb-8 text-center tracking-wide">
        Mapa da Jornada
      </h3>
      <div className="relative w-full h-10 flex items-center px-5">
        {/* Trilha de fundo */}
        <div className="w-full h-2 bg-slate-700 rounded-full" />

        {/* Trilha de progresso */}
        <motion.div
          className="absolute h-2 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full shadow-glow-cyan"
          initial={{ width: 0 }}
          animate={{ width: `calc(${playerProgress}% - 10px)` }} // Ajuste para centralizar no ícone
          transition={{ duration: 1, ease: "easeInOut" }}
        />

        {/* Marcos da Jornada */}
        {milestones.map((milestone) => (
          <Milestone
            key={milestone.level}
            milestone={milestone}
            currentLevel={currentLevel}
          />
        ))}

        {/* Avatar do Jogador */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 z-20"
          initial={{ left: "0%" }}
          animate={{ left: `${playerProgress}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
          title={`Você está no nível ${currentLevel}`}
        >
          <div className="relative -translate-x-1/2">
            <MapPin className="w-8 h-8 text-brand-pink drop-shadow-[0_2px_4px_rgba(236,72,153,0.8)]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-pink opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-pink"></span>
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

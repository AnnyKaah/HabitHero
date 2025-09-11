import { motion } from "framer-motion";
import { Map, Star, CheckCircle, Zap, Shield, Target } from "lucide-react";
// No changes needed here
const instructions = [
  {
    icon: Star,
    title: "Conquista: Pioneiro",
    description: "Crie sua primeira missão usando o botão 'Nova Missão'.",
  },
  {
    icon: CheckCircle,
    title: "Conquista: Iniciado",
    description: "Complete qualquer missão da sua lista clicando nela.",
  },
  {
    icon: Zap,
    title: "Conquista: Aprendiz (Nível 5)",
    description: "Ganhe XP completando missões e suba de nível.",
  },
  {
    icon: Shield,
    title: "Conquista: Matador de Chefes",
    description: "Cause dano ao chefe na barra lateral completando missões.",
  },
  {
    icon: Target,
    title: "Conquista: Colecionador",
    description: "Mantenha 5 ou mais missões ativas ao mesmo tempo.",
  },
];

export default function InstructionsMap() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="bg-brand-slate/50 p-4 rounded-xl border border-brand-light-slate"
    >
      <h3 className="font-display text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
        <Map /> Mapa do Herói: Como Começar
      </h3>
      <div className="space-y-3">
        {instructions.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              <item.icon className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="font-bold text-slate-200">{item.title}</p>
              <p className="text-sm text-slate-400">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

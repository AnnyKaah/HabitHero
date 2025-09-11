import { motion } from "framer-motion";
// No changes needed here
import roleplayImage from "../assets/roleplay.png"; // No changes needed here
export default function RoleplayIntro() {
  return (
    <motion.div
      className="bg-gradient-to-b from-brand-slate/50 to-brand-deep-slate/60 p-6 rounded-xl border border-brand-light-slate/30 flex flex-col items-center text-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <img
        src={roleplayImage}
        alt="Herói em sua jornada"
        className="w-24 h-24 rounded-full object-cover shadow-lg border-2 border-amber-300/50"
      />
      <div>
        <h3
          className="font-serif text-2xl font-bold text-amber-200 mb-2 tracking-wider"
          style={{ fontFamily: "'Cinzel Decorative', serif" }}
        >
          Sua Jornada Começa
        </h3>
        <p className="text-slate-300 max-w-xl">
          As terras de 'Habitia' estão sob a sombra de grandes vilões: a{" "}
          <span className="text-brand-pink font-semibold">Procrastinação</span>,
          a <span className="text-brand-pink font-semibold">Preguiça</span> e a{" "}
          <span className="text-brand-pink font-semibold">Distração</span>. Cada
          hábito que você completa é um golpe contra eles. Mantenha a
          consistência para derrotá-los e trazer a produtividade de volta ao
          reino!
        </p>
      </div>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
// No changes needed here
interface BadgeProps {
  name: string;
  description: string;
  icon: keyof typeof Icons;
}

export default function Badge({ name, icon, description }: BadgeProps) {
  // Verifica se o ícone solicitado existe e é um componente válido.
  // Caso contrário, usa o ícone 'Award' como padrão.
  const IconComponent =
    icon in Icons && typeof Icons[icon] === "object"
      ? (Icons[icon] as unknown as React.ElementType)
      : Icons.Award;

  return (
    <motion.div
      className="group relative flex flex-col items-center text-center p-2"
      whileHover={{ scale: 1.1 }}
    >
      <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center border-2 border-amber-400 shadow-lg shadow-amber-500/20">
        <IconComponent className="w-8 h-8 text-amber-400" />
      </div>
      <span className="mt-2 text-xs font-semibold text-slate-300">{name}</span>
      <div className="absolute bottom-full mb-2 w-48 p-2 text-xs text-center text-white bg-slate-900 border border-slate-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        {description}
      </div>
    </motion.div>
  );
}

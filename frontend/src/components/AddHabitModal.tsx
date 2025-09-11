import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import {
  X,
  Brain,
  HeartPulse,
  Paintbrush,
  Briefcase,
  Smile,
  Users,
  PiggyBank,
} from "lucide-react";

export const habitCategories = [
  { id: "dev_pessoal", name: "Desenvolvimento Pessoal", icon: Brain },
  { id: "saude_fitness", name: "Saúde & Fitness", icon: HeartPulse },
  {
    id: "criatividade_hobbies",
    name: "Criatividade & Hobbies",
    icon: Paintbrush,
  },
  {
    id: "carreira_produtividade",
    name: "Carreira & Produtividade",
    icon: Briefcase,
  },
  { id: "bem_estar_mindfulness", name: "Bem-estar & Mindfulness", icon: Smile },
  {
    id: "relacionamentos_social",
    name: "Relacionamentos & Social",
    icon: Users,
  },
  {
    id: "financas_organizacao",
    name: "Finanças & Organização",
    icon: PiggyBank,
  },
];

export type HabitCategory = (typeof habitCategories)[number]["id"];

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHabit: (
    name: string,
    description: string,
    category: HabitCategory,
    duration: number
  ) => Promise<void>;
}

export default function AddHabitModal({
  isOpen,
  onClose,
  onAddHabit,
}: AddHabitModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<HabitCategory>("dev_pessoal");
  const [duration, setDuration] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    await onAddHabit(name, description, category, duration);
    setIsSubmitting(false);
    setName("");
    setDescription("");
    setCategory("dev_pessoal"); // Reset category
    setDuration(1);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-100">Nova Missão</h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors rounded-full p-1"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="habit-name"
                  className="block mb-2 text-sm font-medium text-slate-300"
                >
                  Nome do Hábito
                </label>
                <input
                  id="habit-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-white"
                  placeholder="Ex: Ler 10 páginas por dia"
                />
              </div>
              <div>
                <label
                  htmlFor="habit-description"
                  className="block mb-2 text-sm font-medium text-slate-300"
                >
                  Descrição (Opcional)
                </label>
                <input
                  id="habit-description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-white"
                  placeholder="Ex: Qualquer livro de ficção"
                />
              </div>
              <div>
                <label
                  htmlFor="habit-category"
                  className="block mb-2 text-sm font-medium text-slate-300"
                >
                  Categoria
                </label>
                <select
                  id="habit-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as HabitCategory)}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-white"
                >
                  {habitCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="habit-duration"
                  className="block mb-2 text-sm font-medium text-slate-300"
                >
                  Duração (em dias)
                </label>
                <input
                  id="habit-duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                  min="1"
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition text-white"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-md hover:bg-purple-700 transition-colors duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Adicionando..." : "Criar Missão"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

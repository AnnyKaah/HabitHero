import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import chestOpen from "../assets/chest-open.png"; // No changes needed here

interface ChestOpeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  reward: { type: string; amount: number } | null;
}

export default function ChestOpeningModal({
  isOpen,
  onClose,
  reward,
}: ChestOpeningModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm p-6 border-2 border-amber-400 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-display font-bold text-amber-400">
                Baú Aberto!
              </h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-amber-400 transition-colors rounded-full p-1 -mr-2"
              >
                <X size={24} />
              </button>
            </div>
            <motion.img
              src={chestOpen}
              alt="Baú Aberto"
              className="w-40 h-40 mx-auto my-4"
              initial={{ scale: 0.5, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            />
            <p className="text-lg text-slate-200">Você ganhou:</p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-3xl font-bold text-white my-2"
            >
              +{reward?.amount} {reward?.type}
            </motion.div>
            <button
              onClick={onClose}
              className="mt-4 w-full bg-amber-500 text-slate-900 font-bold py-2 px-4 rounded-md hover:bg-amber-600 transition-colors"
            >
              Coletar!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { AnimatePresence, motion } from "framer-motion";
import { X, Zap, Lightbulb, Heart } from "lucide-react";
import { toast } from "react-hot-toast"; // No changes needed here

interface SendBoostModalProps {
  isOpen: boolean;
  onClose: () => void;
  friendName: string;
}

const boosts = [
  { id: "motivation", text: "Você consegue!", icon: Zap },
  { id: "tip", text: "Uma dica para você...", icon: Lightbulb },
  { id: "support", text: "Estou na torcida!", icon: Heart },
];

export default function SendBoostModal({
  isOpen,
  onClose,
  friendName,
}: SendBoostModalProps) {
  const handleSendBoost = (boostText: string) => {
    // Aqui iria a lógica da API para enviar o boost
    console.log(`Enviando boost para ${friendName}: ${boostText}`);
    toast.success(`Boost enviado para ${friendName}!`);
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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm p-6 border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-100">
                Enviar Boost para {friendName}
              </h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors rounded-full p-1"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-3">
              {boosts.map((boost) => (
                <button
                  key={boost.id}
                  onClick={() => handleSendBoost(boost.text)}
                  className="w-full flex items-center gap-3 p-3 bg-brand-slate hover:bg-brand-light-slate rounded-md transition-colors text-left"
                >
                  <boost.icon className="w-5 h-5 text-brand-cyan" />
                  <span className="text-slate-200">{boost.text}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

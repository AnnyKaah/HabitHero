import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import ImageWithSkeleton from "./ImageWithSkeleton";
import { avatarImages } from "../utils/avatars";

interface AvatarSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAvatar: (avatarId: string) => void;
  currentAvatarId: string;
  avatarIds: string[];
}

export default function AvatarSelectionModal({
  isOpen,
  onClose,
  onSelectAvatar,
  currentAvatarId,
  avatarIds,
}: AvatarSelectionModalProps) {
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
            className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg p-6 border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-100">
                Escolha seu Avatar
              </h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors rounded-full p-1"
              >
                <X size={24} />
              </button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {avatarIds.map((avatarId) => (
                <button
                  key={avatarId}
                  onClick={() => onSelectAvatar(avatarId)}
                  className={`p-2 rounded-lg transition-all ${
                    currentAvatarId === avatarId
                      ? "bg-brand-purple ring-2 ring-brand-purple"
                      : "hover:bg-slate-700"
                  }`}
                >
                  <ImageWithSkeleton
                    src={avatarImages[avatarId]}
                    alt={`Avatar ${avatarId}`}
                    className="w-full h-auto rounded-md aspect-square"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import React from "react";
import { motion } from "framer-motion";
import { User } from "../pages/Dashboard";
import { Check, X } from "lucide-react";
import { getAvatarUrl } from "../utils/avatar";
import ImageWithSkeleton from "../components/ImageWithSkeleton";

interface FriendRequest
  extends Omit<
    User,
    "xp" | "xpToNextLevel" | "totalXp" | "unlockedAchievementIds"
  > {
  id: string;
}

interface RequestsTabProps {
  requests: FriendRequest[];
}

export default function RequestsTab({ requests }: RequestsTabProps) {
  if (requests.length === 0) {
    return (
      <div className="text-center text-slate-500 py-10">
        Nenhum pedido de amizade pendente.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {requests.map((req, index) => (
        <motion.div
          key={req.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center justify-between p-3 rounded-lg bg-brand-slate/50 border border-brand-light-slate"
        >
          <div className="flex items-center gap-3">
            <ImageWithSkeleton
              src={getAvatarUrl(req.avatarId)}
              alt={req.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <span className="font-semibold text-slate-200">
                {req.username}
              </span>
              <p className="text-xs text-slate-400">Nível {req.level}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-full transition-colors">
              <Check size={18} />
            </button>
            <button className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-full transition-colors">
              <X size={18} />
            </button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

import React from "react";
import { motion } from "framer-motion";
import { User } from "../pages/Dashboard";
import { Crown, Star } from "lucide-react";
import { getAvatarUrl } from "../utils/avatar";
import ImageWithSkeleton from "./ImageWithSkeleton";

// This type is more specific to what the ranking needs and doesn't require all User properties.
interface Friend {
  id: string;
  username: string;
  level: number;
  avatarId: string;
  xp: number;
}

interface RankingTabProps {
  currentUser: User;
  friends: Friend[];
}

export default function RankingTab({ currentUser, friends }: RankingTabProps) {
  const allPlayers = [{ ...currentUser, id: "currentUser" }, ...friends].sort(
    (a, b) => b.xp - a.xp
  );

  const getRankColor = (rank: number) => {
    if (rank === 0) return "text-yellow-400"; // 1st
    if (rank === 1) return "text-slate-300"; // 2nd
    if (rank === 2) return "text-yellow-600"; // 3rd
    return "text-slate-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {allPlayers.map((player, index) => (
        <motion.div
          key={player.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`flex items-center p-4 rounded-lg border ${
            player.id === "currentUser"
              ? "bg-brand-purple/10 border-brand-purple"
              : "bg-brand-slate/50 border-brand-light-slate"
          }`}
        >
          <div className="flex items-center gap-3 w-1/4">
            <span
              className={`font-bold text-xl w-8 text-center ${getRankColor(
                index
              )}`}
            >
              {index + 1}
            </span>
            <ImageWithSkeleton
              src={getAvatarUrl(player.avatarId)}
              alt={player.username}
              className="w-12 h-12 rounded-full border-2 border-slate-600 object-cover"
            />
            <span className="font-semibold text-slate-200">
              {player.username}
            </span>
          </div>
          <div className="w-1/4 text-center font-mono text-brand-cyan">
            Nível {player.level}
          </div>
          <div className="w-1/4 text-center font-mono text-yellow-400 flex items-center justify-center gap-1">
            <Star size={16} /> {player.xp.toLocaleString()} XP
          </div>
          <div className="w-1/4 text-center">
            {index === 0 && <Crown className="mx-auto text-yellow-400" />}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

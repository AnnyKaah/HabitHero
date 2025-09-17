import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Trash2 } from "lucide-react";
import SendBoostModal from "./SendBoostModal";
import { getAvatarUrl } from "../utils/avatar";
import ImageWithSkeleton from "./ImageWithSkeleton";
// Create a more specific type for the friend list, as it doesn't need all User properties.
interface Friend {
  id: string;
  username: string;
  level: number;
  avatarId: string;
  xp: number;
}

interface FriendsTabProps {
  friends: Friend[];
}

export default function FriendsTab({ friends }: FriendsTabProps) {
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);

  const handleOpenBoostModal = (friend: Friend) => {
    setSelectedFriend(friend);
    setIsBoostModalOpen(true);
  };

  return (
    <>
      <SendBoostModal
        isOpen={isBoostModalOpen}
        onClose={() => setIsBoostModalOpen(false)}
        friendName={selectedFriend?.username || ""}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {friends.map((friend, index) => (
          <motion.div
            key={friend.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="bg-brand-slate/50 p-4 rounded-lg border border-brand-light-slate flex flex-col items-center text-center"
          >
            <ImageWithSkeleton
              src={getAvatarUrl(friend.avatarId)}
              alt={friend.username}
              className="w-20 h-20 rounded-full mb-3 object-cover"
            />
            <h4 className="font-bold text-lg text-slate-200">
              {friend.username}
            </h4>
            <p className="text-sm text-slate-400">Nível {friend.level}</p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleOpenBoostModal(friend)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 font-semibold py-2 px-3 rounded-md transition-colors"
              >
                <Send size={16} /> Boost
              </button>
              <button className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-md transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}

import React from "react";
import { Pencil, Check, X } from "lucide-react";
import ImageWithSkeleton from "./ImageWithSkeleton";
import type { User } from "../types";

interface ProfileHeaderProps {
  user: User;
  avatarSrc: string;
  isEditingUsername: boolean;
  newUsername: string;
  isSubmitting: boolean;
  onSetIsEditingUsername: (isEditing: boolean) => void;
  onSetNewUsername: (username: string) => void;
  onSaveUsername: () => void;
  onOpenAvatarModal: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  avatarSrc,
  isEditingUsername,
  newUsername,
  isSubmitting,
  onSetIsEditingUsername,
  onSetNewUsername,
  onSaveUsername,
  onOpenAvatarModal,
}) => {
  return (
    <div className="flex items-center gap-4 text-right">
      <div className="relative group">
        <ImageWithSkeleton
          src={avatarSrc}
          alt="User Avatar"
          className="w-20 h-20 rounded-full border-4 border-brand-purple shadow-lg object-cover"
        />
        <button
          onClick={onOpenAvatarModal}
          className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pencil size={24} className="text-white" />
        </button>
      </div>

      {isEditingUsername ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newUsername}
            onChange={(e) => onSetNewUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSaveUsername()}
            autoFocus
            className="bg-slate-700 text-white text-2xl md:text-3xl font-bold p-1 rounded-md w-48 outline-none ring-2 ring-brand-purple"
          />
          <button
            onClick={onSaveUsername}
            className="p-2 bg-green-500/20 text-green-400 rounded-full hover:bg-green-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            <Check size={20} />
          </button>
          <button
            onClick={() => onSetIsEditingUsername(false)}
            className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/40"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3 group">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-purple">
            {user.username}
          </h1>
          <button
            onClick={() => onSetIsEditingUsername(true)}
            className="text-slate-500 group-hover:text-white transition-colors"
          >
            <Pencil size={20} />
          </button>
        </div>
      )}
      <p className="text-slate-400">Nível {user.level}</p>
    </div>
  );
};

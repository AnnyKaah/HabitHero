import { useState } from "react";
import { useUser } from "../pages/UserContext";
import { useProfileStats } from "./useProfileStats";
import { avatarImages, avatarIds } from "../utils/avatars";

export const useProfilePage = () => {
  const { user, habits, updateUsername, updateAvatar } = useUser();

  // Este hook deve ser usado apenas onde o usuário já foi verificado.
  if (!user) {
    throw new Error(
      "useProfilePage must be used within a context where the user is loaded."
    );
  }

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState(user.username || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const profileStats = useProfileStats(habits);

  const handleSelectAvatar = async (avatarId: string) => {
    setIsSubmitting(true);
    await updateAvatar(avatarId);
    setIsSubmitting(false);
    setIsAvatarModalOpen(false);
  };

  const avatarSrc = avatarImages[user.avatarId] || avatarImages.avatar1;

  const handleSaveUsername = async () => {
    if (newUsername.trim() && newUsername.trim() !== user.username) {
      setIsSubmitting(true);
      await updateUsername(newUsername.trim());
      setIsSubmitting(false);
    }
    setIsEditingUsername(false);
  };

  return {
    user,
    habits,
    isEditingUsername,
    setIsEditingUsername,
    isAvatarModalOpen,
    setIsAvatarModalOpen,
    newUsername,
    setNewUsername,
    profileStats,
    handleSelectAvatar,
    avatarSrc,
    handleSaveUsername,
    avatarIds,
    isSubmitting,
  };
};

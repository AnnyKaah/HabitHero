import { useState } from "react";
import { toast } from "react-hot-toast";
import { useProfileStats } from "./useProfileStats";
import { avatarImages, avatarIds } from "../utils/avatars";
import { useProfile } from "./useProfile";
import { useHabits } from "./useHabits";

export const useProfilePage = () => {
  const { user, updateUsername, updateAvatar } = useProfile();
  const { habits } = useHabits();

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
    await toast.promise(updateAvatar(avatarId), {
      loading: "Atualizando avatar...",
      success: "Avatar atualizado!",
      error: "Erro ao atualizar o avatar.",
    });
    setIsSubmitting(false);
    setIsAvatarModalOpen(false);
  };

  const avatarSrc = avatarImages[user.avatarId] || avatarImages.avatar1;

  const handleSaveUsername = async () => {
    if (newUsername.trim() && newUsername.trim() !== user.username) {
      setIsSubmitting(true);
      await toast.promise(updateUsername(newUsername.trim()), {
        loading: "Salvando nome...",
        success: "Nome de usuário salvo!",
        error: "Erro ao salvar o nome.",
      });
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

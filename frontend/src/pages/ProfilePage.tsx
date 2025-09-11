import React from "react";
import { useUser } from "./UserContext";
import { useProfilePage } from "../hooks/useProfilePage";
import { ProfileUI } from "../components/ProfileUI";

interface ProfilePageProps {
  onBack: () => void; // Função para voltar ao Dashboard
  isSubmitting: boolean;
}

export default function ProfilePage({
  onBack,
  isSubmitting,
}: ProfilePageProps) {
  const { user } = useUser();
  const state = useProfilePage();

  // Os Hooks devem ser chamados no topo do componente, antes de qualquer retorno condicional.
  if (!user) {
    return null; // ou um spinner/mensagem de carregamento
  }

  return (
    <ProfileUI
      user={state.user}
      habits={state.habits}
      isEditingUsername={state.isEditingUsername}
      isAvatarModalOpen={state.isAvatarModalOpen}
      newUsername={state.newUsername}
      avatarSrc={state.avatarSrc}
      avatarIds={state.avatarIds}
      profileStats={state.profileStats}
      isSubmitting={isSubmitting}
      onBack={onBack}
      onSetIsEditingUsername={state.setIsEditingUsername}
      onSetIsAvatarModalOpen={state.setIsAvatarModalOpen}
      onSetNewUsername={state.setNewUsername}
      onSaveUsername={state.handleSaveUsername}
      onSelectAvatar={state.handleSelectAvatar}
    />
  );
}

import React from "react";
import { useProfilePage } from "../hooks/useProfilePage";
import { ProfileUI } from "../components/ProfileUI";

export default function ProfilePage() {
  const state = useProfilePage();

  // Os Hooks devem ser chamados no topo do componente, antes de qualquer retorno condicional.
  // Adicionando uma verificação para garantir que o usuário exista antes de renderizar.
  if (!state.user) {
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
      isSubmitting={state.isSubmitting}
      onSetIsEditingUsername={state.setIsEditingUsername}
      onSetIsAvatarModalOpen={state.setIsAvatarModalOpen}
      onSetNewUsername={state.setNewUsername}
      onSaveUsername={state.handleSaveUsername}
      onSelectAvatar={state.handleSelectAvatar}
    />
  );
}

import { useUser } from "../pages/UserContext";

/**
 * Hook personalizado para abstrair a lógica de manipulação do perfil do usuário.
 * Ele consome o UserContext e expõe apenas o estado e as funções
 * relacionadas ao perfil, como dados do usuário e funções para atualizar
 * nome e avatar.
 */
export const useProfile = () => {
  const { state, updateUsername, updateAvatar } = useUser();

  return {
    /** O objeto de usuário atual, contendo dados como nome, nível, XP e avatar. */
    user: state.user,
    /** Função para atualizar o nome de usuário. */
    updateUsername,
    /** Função para atualizar o avatar do usuário. */
    updateAvatar,
  };
};

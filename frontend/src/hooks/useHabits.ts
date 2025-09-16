import { useUser } from "../pages/UserContext";

/**
 * Hook personalizado para abstrair a lógica de manipulação de hábitos.
 * Ele consome o UserContext e expõe apenas o estado e as funções
 * relacionadas aos hábitos, promovendo a separação de responsabilidades.
 */
export const useHabits = () => {
  const { state, addHabit, editHabit, deleteHabit, completeHabit } = useUser();

  return {
    /** A lista atual de hábitos do usuário. */
    habits: state.habits,
    /** Função para adicionar um novo hábito. */
    addHabit,
    /** Função para editar um hábito existente. */
    editHabit,
    /** Função para deletar um hábito. */
    deleteHabit,
    /** Função para marcar um hábito como concluído em uma data específica. */
    completeHabit,
  };
};

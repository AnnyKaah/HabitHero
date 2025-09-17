import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useReducer,
  ReactNode,
} from "react";
import { toast } from "react-hot-toast";
import type { Habit, User } from "../types";
import {
  getInitialData,
  addHabit as apiAddHabit,
  deleteHabit as apiDeleteHabit,
  completeHabit as apiCompleteHabit,
  updateUser as apiUpdateUser,
} from "../api";

interface State {
  user: User | null;
  habits: Habit[];
  isLoading: boolean;
  completingHabitId: number | null; // Adicionamos o estado de carregamento aqui
  error: string | null;
}

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: { user: User; habits: Habit[] } }
  | { type: "FETCH_FAILURE"; payload: string }
  | { type: "ADD_HABIT_SUCCESS"; payload: Habit }
  | { type: "REVERT_HABITS"; payload: Habit[] }
  | { type: "SET_OPTIMISTIC_HABITS"; payload: Habit[] } // Ação mais específica
  | { type: "DELETE_HABIT_OPTIMISTIC"; payload: number }
  | { type: "START_COMPLETE_HABIT"; payload: number } // Nova ação para iniciar
  | { type: "COMPLETE_HABIT_FAILURE" } // Nova ação para falha
  | { type: "COMPLETE_HABIT_SUCCESS"; payload: { user: User; habit: Habit } }
  | {
      type: "REVERT_USER_AND_HABITS";
      payload: { user: User | null; habits: Habit[] };
    }
  | { type: "UPDATE_USER_OPTIMISTIC"; payload: Partial<User> }
  | { type: "REVERT_USER"; payload: User | null };

const initialState: State = {
  user: null,
  habits: [],
  isLoading: true,
  completingHabitId: null,
  error: null,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,
        habits: action.payload.habits,
      };
    case "FETCH_FAILURE":
      return { ...state, isLoading: false, error: action.payload };
    case "ADD_HABIT_SUCCESS":
      return { ...state, habits: [...state.habits, action.payload] };
    case "REVERT_HABITS":
      return { ...state, habits: action.payload };
    case "SET_OPTIMISTIC_HABITS":
      return { ...state, habits: action.payload };
    case "DELETE_HABIT_OPTIMISTIC":
      return {
        ...state,
        habits: state.habits.filter((h) => h.id !== action.payload),
      };
    case "START_COMPLETE_HABIT":
      return {
        ...state,
        completingHabitId: action.payload,
      };
    case "COMPLETE_HABIT_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        habits: state.habits.map((h) =>
          h.id === action.payload.habit.id ? action.payload.habit : h
        ),
        completingHabitId: null, // Limpa o estado de carregamento no sucesso
      };
    case "COMPLETE_HABIT_FAILURE":
      return {
        ...state,
        completingHabitId: null, // Limpa o estado de carregamento na falha
      };
    case "REVERT_USER_AND_HABITS":
      return {
        ...state,
        user: action.payload.user,
        habits: action.payload.habits,
      };
    // Note: não limpamos o completingHabitId aqui para que a UI possa decidir o que fazer
    case "UPDATE_USER_OPTIMISTIC":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case "REVERT_USER":
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

interface UserContextType {
  state: State;
  fetchData: () => Promise<void>;
  addHabit: (
    name: string,
    description: string,
    category: string,
    duration: number
  ) => Promise<void>;
  deleteHabit: (id: number) => Promise<void>;
  updateUsername: (newUsername: string) => Promise<void>;
  updateAvatar: (newAvatarId: string) => Promise<void>;
  updateUserStats: (updates: Partial<User>) => void;
  completeHabit: (
    id: number,
    runGamificationLogic: (
      updatedHabit: Habit,
      habitBeforeUpdate: Habit | undefined
    ) => void
  ) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  // Usamos uma ref para garantir que apenas uma requisição de conclusão seja feita por vez.
  // Isso é mais seguro que depender apenas do estado.
  const isCompletingRef = useRef(false);

  const fetchData = async () => {
    dispatch({ type: "FETCH_START" });
    try {
      // Fazendo duas requisições separadas, que são mais comuns em APIs REST.
      const [userData, habitsData] = await getInitialData();
      dispatch({
        type: "FETCH_SUCCESS",
        payload: { user: userData, habits: habitsData },
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar dados.";
      dispatch({ type: "FETCH_FAILURE", payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    // Busca os dados se houver um token e se o usuário ainda não foi carregado.
    // Isso evita buscas repetidas desnecessárias, mas garante a busca inicial.
    const token = localStorage.getItem("authToken");
    if (token && !state.user) {
      fetchData();
    }
    // A dependência em state.user garante que, se o usuário fizer logout (state.user se torna null),
    // e depois login novamente, o contexto pode re-buscar os dados se necessário.
  }, [state.user]);

  const addHabit = async (
    name: string,
    description: string,
    category: string,
    duration: number
  ) => {
    try {
      const newHabit = await apiAddHabit({
        name,
        description,
        category,
        duration,
      });

      dispatch({ type: "ADD_HABIT_SUCCESS", payload: newHabit });
      toast.success("Hábito adicionado com sucesso!");
    } catch (error) {
      toast.error("Falha ao adicionar o hábito.");
    }
  };

  const deleteHabit = async (id: number) => {
    const originalHabits = state.habits;
    dispatch({ type: "DELETE_HABIT_OPTIMISTIC", payload: id });
    try {
      await apiDeleteHabit(id);
      toast.success("Hábito deletado!");
    } catch (err) {
      toast.error("Falha ao deletar o hábito.");
      dispatch({ type: "REVERT_HABITS", payload: originalHabits });
    }
  };

  const completeHabit = async (
    id: number,
    runGamificationLogic: (
      updatedHabit: Habit,
      habitBeforeUpdate: Habit | undefined
    ) => void
  ): Promise<void> => {
    // Trava síncrona para impedir qualquer condição de corrida
    if (isCompletingRef.current) {
      return;
    }
    isCompletingRef.current = true;

    const originalHabits = [...state.habits];
    const originalUser = state.user ? { ...state.user } : null;
    const habitBeforeUpdate = originalHabits.find((h) => h.id === id);

    // 1. Cria o estado otimista
    const optimisticHabit = {
      ...(habitBeforeUpdate as Habit),
      logs: [
        ...(habitBeforeUpdate?.logs || []),
        {
          id: Date.now(), // ID temporário
          date: new Date().toISOString().split("T")[0],
          completed: true,
          habitId: id, // Adiciona o habitId para corresponder ao tipo HabitLog
        },
      ],
    };
    const optimisticHabits = originalHabits.map((h) =>
      h.id === id ? optimisticHabit : h
    );

    // 2. Atualiza a UI imediatamente
    dispatch({ type: "START_COMPLETE_HABIT", payload: id });
    dispatch({ type: "SET_OPTIMISTIC_HABITS", payload: optimisticHabits });

    const todayStr = new Date().toISOString().split("T")[0];

    try {
      // 3. Chama a API em segundo plano
      const {
        user: updatedUser,
        habit: updatedHabit,
        ...rest
      } = await apiCompleteHabit(id, todayStr);

      // Sincroniza o estado local com a resposta definitiva do servidor
      // O reducer garante a imutabilidade ao substituir o hábito
      dispatch({
        type: "COMPLETE_HABIT_SUCCESS",
        payload: { user: updatedUser, habit: updatedHabit },
      });

      // 4. Executa a lógica de gamificação APÓS o sucesso da API
      runGamificationLogic(updatedHabit, habitBeforeUpdate);

      const habitName = updatedHabit.name || "Missão";

      if (rest.missionCompleted) {
        toast.success(
          `Missão '${habitName}' concluída! +${rest.bonusXp} XP Bônus!`,
          { icon: "🎉" }
        );
      } else {
        toast.success(`'${habitName}' atualizada! +${rest.xpGained} XP`);
      }
    } catch (error) {
      // 5. Reverte o estado em caso de falha na API
      const errorMessage =
        error instanceof Error ? error.message : "Falha ao completar a missão.";

      // Verifica se o erro é sobre o hábito já ter sido concluído
      if (errorMessage.includes("já foi concluído")) {
        toast.error("Missão já concluída hoje.");
        // Neste caso, a UI otimista já está correta, então não revertemos.
        // Apenas garantimos que o estado de carregamento seja limpo.
      } else {
        toast.error(errorMessage);
        // Reverte o estado para o original apenas se for um erro inesperado.
        dispatch({
          type: "REVERT_USER_AND_HABITS",
          payload: { user: originalUser, habits: originalHabits },
        });
      }

      dispatch({ type: "COMPLETE_HABIT_FAILURE" });
    } finally {
      // Libera a trava independentemente do resultado
      isCompletingRef.current = false;
    }
  };

  const updateUsername = async (newUsername: string) => {
    if (!state.user) return;
    const originalUser = { ...state.user };
    dispatch({
      type: "UPDATE_USER_OPTIMISTIC",
      payload: { username: newUsername },
    });
    try {
      await apiUpdateUser({ username: newUsername });
      toast.success("Nome de usuário atualizado!");
    } catch (error) {
      dispatch({ type: "REVERT_USER", payload: originalUser });
      toast.error("Falha ao atualizar o nome de usuário.");
    }
  };

  const updateAvatar = async (newAvatarId: string) => {
    if (!state.user) return;
    const originalUser = state.user;

    dispatch({
      type: "UPDATE_USER_OPTIMISTIC",
      payload: { avatarId: newAvatarId },
    });

    try {
      await apiUpdateUser({ avatarId: newAvatarId });
      toast.success("Avatar atualizado!");
    } catch (error) {
      dispatch({ type: "REVERT_USER", payload: originalUser }); // Reverte em caso de erro
      toast.error("Falha ao atualizar o avatar.");
    }
  };

  const updateUserStats = (updates: Partial<User>) => {
    if (!state.user) return;
    dispatch({
      type: "UPDATE_USER_OPTIMISTIC",
      payload: updates,
    });
  };

  const value = {
    state,
    fetchData,
    addHabit,
    deleteHabit,
    updateUsername,
    updateAvatar,
    updateUserStats,
    completeHabit,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

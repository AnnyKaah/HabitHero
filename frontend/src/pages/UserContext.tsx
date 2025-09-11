import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "react-hot-toast";
import type { Habit, User } from "../types";
import {
  getInitialData,
  addHabit as apiAddHabit,
  deleteHabit as apiDeleteHabit,
  updateUser as apiUpdateUser,
  completeHabit as apiCompleteHabit,
} from "./api";

interface UserContextType {
  user: User | null;
  habits: Habit[];
  isLoading: boolean;
  error: string | null;
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
  completeHabit: (id: number, date: string) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [userData, habitsData] = await getInitialData();
      setUser(userData);
      setHabits(habitsData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar dados.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      setHabits((prev) => [...prev, newHabit]);
      toast.success("Hábito adicionado com sucesso!");
    } catch (error) {
      toast.error("Falha ao adicionar o hábito.");
    }
  };

  const deleteHabit = async (id: number) => {
    const originalHabits = habits;
    setHabits(habits.filter((h) => h.id !== id));
    try {
      await apiDeleteHabit(id);
      toast.success("Hábito deletado!");
    } catch (err) {
      toast.error("Falha ao deletar o hábito.");
      setHabits(originalHabits);
    }
  };

  const completeHabit = async (id: number, date: string): Promise<void> => {
    const originalHabits = [...habits];
    const originalUser = user ? { ...user } : null;

    try {
      const {
        user: updatedUser,
        habit: updatedHabit,
        missionCompleted,
        bonusXp,
        xpGained,
      } = await apiCompleteHabit(id, date);
      setUser(updatedUser);
      setHabits((prev) => prev.map((h) => (h.id === id ? updatedHabit : h)));
      if (missionCompleted) {
        toast.success(
          `Missão '${updatedHabit.name}' concluída! +${bonusXp} XP Bônus!`,
          { icon: "🎉" }
        );
      } else {
        toast.success(`'${updatedHabit.name}' atualizada! +${xpGained} XP`);
      }
    } catch (error) {
      toast.error("Falha ao completar a missão.");
      setHabits(originalHabits);
      setUser(originalUser as User | null);
    }
  };

  const updateUsername = async (newUsername: string) => {
    if (!user) return;
    const originalUser = { ...user };
    setUser((prev) => (prev ? { ...prev, username: newUsername } : null));
    try {
      await apiUpdateUser({ username: newUsername });
      toast.success("Nome de usuário atualizado!");
    } catch (error) {
      setUser(originalUser);
      toast.error("Falha ao atualizar o nome de usuário.");
    }
  };

  const updateAvatar = async (newAvatarId: string) => {
    if (!user) return;
    const originalUser = user;

    // Cria um novo objeto de usuário com o avatar atualizado
    const updatedUser = { ...user, avatarId: newAvatarId };
    setUser(updatedUser); // Atualização otimista

    try {
      await apiUpdateUser({ avatarId: newAvatarId });
      toast.success("Avatar atualizado!");
    } catch (error) {
      setUser(originalUser); // Reverte em caso de erro
      toast.error("Falha ao atualizar o avatar.");
    }
  };

  const value = {
    user,
    habits,
    isLoading,
    error,
    fetchData,
    addHabit,
    deleteHabit,
    updateUsername,
    updateAvatar,
    completeHabit,
    setUser,
    setHabits,
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

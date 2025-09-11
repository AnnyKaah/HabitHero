import type { Habit, User } from "../types";

const API_BASE_URL = "http://localhost:5000/api";

/**
 * Helper genérico para realizar chamadas à API,
 * tratando autenticação e erros de forma centralizada.
 */
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("authToken");

  const headers = new Headers({
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  });

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token inválido ou expirado, redireciona para o login
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    const errorData = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || "Ocorreu um erro na API");
  }

  // Retorna undefined para respostas sem corpo (ex: 204 No Content)
  if (response.status === 204) {
    return;
  }

  return response.json();
}

// Funções específicas para cada endpoint

export const getInitialData = (): Promise<[User, Habit[]]> => {
  return Promise.all([apiFetch("/auth/me"), apiFetch("/habits")]);
};

export const addHabit = (habitData: {
  name: string;
  description: string;
  category: string;
  duration: number;
}): Promise<Habit> => {
  return apiFetch("/habits", {
    method: "POST",
    body: JSON.stringify(habitData),
  });
};

export const deleteHabit = (id: number): Promise<void> => {
  return apiFetch(`/habits/${id}`, { method: "DELETE" });
};

export const updateUser = (
  userData: Partial<Pick<User, "username" | "avatarId">>
): Promise<User> => {
  return apiFetch("/auth/me", {
    method: "PATCH",
    body: JSON.stringify(userData),
  });
};

export const completeHabit = (
  id: number,
  date: string
): Promise<{
  user: User;
  habit: Habit;
  missionCompleted: boolean;
  bonusXp: number;
  xpGained: number;
}> => {
  return apiFetch(`/habits/${id}/complete`, {
    method: "PATCH",
    body: JSON.stringify({ date }),
  });
};

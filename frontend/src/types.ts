export interface HabitLog {
  id: number;
  habitId: number;
  date: string; // Dates are often strings in JSON
  completed: boolean;
}

export interface Habit {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  category: string;
  level: number;
  xp: number;
  completedCount: number;
  duration: number;
  createdAt: string; // Dates are often strings in JSON
  logs?: HabitLog[]; // Eager loaded logs
}

export interface User {
  username: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
  unlockedAchievementIds: number[];
  avatarId: string;
}

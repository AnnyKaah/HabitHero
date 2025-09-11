import { useMemo } from "react";
import type { Habit } from "../types";
import { habitCategories as dynamicCategories } from "../components/AddHabitModal";

export const useProfileStats = (habits: Habit[]) => {
  const stats = useMemo(() => {
    if (!habits || habits.length === 0) {
      return {
        totalHabitsCompleted: 0,
        strongestHabit: null,
        favoriteCategoryName: "N/A",
        categorizedHabits: dynamicCategories.map((cat) => ({
          title: cat.name,
          habits: [],
          icon: "Activity" as const,
        })),
      };
    }

    const totalHabitsCompleted = habits.reduce(
      (sum, habit) => sum + habit.completedCount,
      0
    );

    const strongestHabit = habits.reduce((strongest, current) =>
      current.level > strongest.level ? current : strongest
    );

    const categoryCounts = habits.reduce((acc, habit) => {
      acc[habit.category] = (acc[habit.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const favoriteCategoryId =
      Object.keys(categoryCounts).length > 0
        ? Object.entries(categoryCounts).reduce((a, b) =>
            a[1] > b[1] ? a : b
          )[0]
        : null;

    const favoriteCategoryName =
      dynamicCategories.find((cat) => cat.id === favoriteCategoryId)?.name ||
      "N/A";

    const categorizedHabits = dynamicCategories.map((cat) => ({
      title: cat.name,
      icon: "Activity" as const, // Mantendo o ícone placeholder
      habits: habits.filter((h) => h.category === cat.id),
    }));

    return {
      totalHabitsCompleted,
      strongestHabit,
      favoriteCategoryName,
      categorizedHabits,
    };
  }, [habits]);

  return stats;
};

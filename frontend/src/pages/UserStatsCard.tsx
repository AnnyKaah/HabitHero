import React from "react";
import type { User } from "../types";
import CategoryStatsCard, { CategorizedHabit } from "./CategoryStatsCard";
import UserStats from "../components/UserStats";

// Cores para dar identidade a cada card de categoria
const categoryColors = [
  "text-red-400",
  "text-blue-400",
  "text-green-400",
  "text-yellow-400",
  "text-indigo-400",
  "text-pink-400",
  "text-sky-400",
];

interface UserStatsCardProps {
  user: User;
  categories: CategorizedHabit[];
}

const UserStatsCard: React.FC<UserStatsCardProps> = ({ user, categories }) => {
  return (
    <div className="space-y-6">
      <UserStats user={user} categories={categories} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories
          .filter((c) => c.habits.length > 0)
          .map((category, index) => (
            <CategoryStatsCard
              key={category.title}
              category={category}
              color={categoryColors[index % categoryColors.length]}
            />
          ))}
      </div>
    </div>
  );
};

export default UserStatsCard;

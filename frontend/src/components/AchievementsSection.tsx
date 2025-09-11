import { Trophy } from "lucide-react";
import { achievementsData, Achievement } from "../pages/achievementsData";

interface AchievementsSectionProps {
  unlockedIds: number[];
}

const AchievementItem = ({
  achievement,
  isUnlocked,
}: {
  achievement: Achievement;
  isUnlocked: boolean;
}) => (
  <div
    className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
      isUnlocked ? "bg-yellow-400/10" : "bg-slate-800/50"
    }`}
    title={isUnlocked ? achievement.description : "Bloqueada"}
  >
    <achievement.icon
      className={`w-6 h-6 ${isUnlocked ? "text-yellow-400" : "text-slate-600"}`}
    />
    <span className={isUnlocked ? "text-slate-200" : "text-slate-500"}>
      {achievement.name}
    </span>
  </div>
);

export default function AchievementsSection({
  unlockedIds,
}: AchievementsSectionProps) {
  return (
    <div className="bg-brand-slate/50 p-4 rounded-xl border border-brand-light-slate">
      <h3 className="font-display text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
        <Trophy /> Conquistas
      </h3>
      <div className="space-y-2">
        {achievementsData.map((ach: Achievement) => (
          <AchievementItem
            key={ach.id}
            achievement={ach}
            isUnlocked={unlockedIds.includes(ach.id)}
          />
        ))}
      </div>
    </div>
  );
}

import { CheckCircle, Trophy, Flame } from "lucide-react";
import React from "react";

interface HeaderStatsProps {
  dailyProgress: {
    completed: number;
    total: number;
  };
  achievements: {
    unlocked: number;
    total: number;
  };
  streak: number;
}

const StatItem: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}> = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-2" title={label}>
    <Icon size={18} className={color} />
    <span className="font-mono font-semibold text-slate-300">{value}</span>
  </div>
);

export const HeaderStats: React.FC<HeaderStatsProps> = ({
  dailyProgress,
  achievements,
  streak,
}) => {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-brand-dark/50 px-4 py-2 border border-brand-light-slate/50">
      <StatItem
        icon={CheckCircle}
        label="Progresso Diário"
        value={`${dailyProgress.completed}/${dailyProgress.total}`}
        color="text-brand-cyan"
      />
      <div className="w-px h-6 bg-brand-light-slate/50" />
      <StatItem
        icon={Trophy}
        label="Conquistas"
        value={`${achievements.unlocked}/${achievements.total}`}
        color="text-yellow-400"
      />
      <div className="w-px h-6 bg-brand-light-slate/50" />
      <StatItem
        icon={Flame}
        label="Streak de Missões"
        value={String(streak)}
        color="text-orange-400"
      />
    </div>
  );
};

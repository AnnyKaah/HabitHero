import React from "react";
import { Shield } from "lucide-react";

interface LevelMedalProps {
  level: number;
}

const getMedalStyle = (level: number) => {
  if (level >= 20) {
    return {
      bgColor: "bg-yellow-500/20",
      borderColor: "border-yellow-400",
      textColor: "text-yellow-300",
    };
  }
  if (level >= 10) {
    return {
      bgColor: "bg-slate-400/20",
      borderColor: "border-slate-300",
      textColor: "text-slate-200",
    };
  }
  return {
    bgColor: "bg-yellow-700/20",
    borderColor: "border-yellow-600",
    textColor: "text-yellow-500",
  };
};

export default function LevelMedal({ level }: LevelMedalProps) {
  const { bgColor, borderColor, textColor } = getMedalStyle(level);

  return (
    <div
      className={`flex items-center justify-center gap-1 w-16 h-7 rounded-full text-sm font-bold border ${bgColor} ${borderColor} ${textColor}`}
      title={`Nível ${level}`}
    >
      <Shield size={14} />
      <span>{level}</span>
    </div>
  );
}

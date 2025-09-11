import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Shield, Star } from "lucide-react"; // No changes needed here

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface User {
  level: number;
  totalXp: number;
}

interface Habit {
  xp: number;
}

interface HabitCategory {
  title: string;
  habits: Habit[];
}

interface UserStatsProps {
  user: User;
  categories: HabitCategory[];
}

export default function UserStats({ user, categories }: UserStatsProps) {
  const chartData = {
    labels: categories.map((c) => c.title),
    datasets: [
      {
        label: "XP por Categoria",
        data: categories.map((c) => c.habits.reduce((sum, h) => sum + h.xp, 0)),
        backgroundColor: [
          "rgba(56, 189, 248, 0.7)", // brand-cyan
          "rgba(236, 72, 153, 0.7)", // brand-pink
          "rgba(168, 85, 247, 0.7)", // brand-purple
        ],
        borderColor: "#1e293b", // slate-800
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#94a3b8", // slate-400
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
      title: {
        display: true,
        text: "Distribuição de XP",
        color: "#e2e8f0", // slate-200
        font: {
          size: 16,
          family: "'Orbitron', sans-serif",
        },
      },
    },
  };

  return (
    <div className="bg-brand-slate/50 p-4 rounded-xl border border-brand-light-slate">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="relative h-48 md:h-56">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-2">
            <Shield className="mx-auto h-8 w-8 text-brand-cyan" />
            <p className="mt-2 text-2xl font-bold text-slate-200">
              {user.level}
            </p>
            <p className="text-sm text-slate-400">Nível Atual</p>
          </div>
          <div className="p-2">
            <Star className="mx-auto h-8 w-8 text-yellow-400" />
            <p className="mt-2 text-2xl font-bold text-slate-200">
              {user.totalXp}
            </p>
            <p className="text-sm text-slate-400">Total XP</p>
          </div>
        </div>
      </div>
    </div>
  );
}

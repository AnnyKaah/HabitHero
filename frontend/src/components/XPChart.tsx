import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  // No changes needed here
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Habit {
  id: number; // No changes needed here
  name: string; // No changes needed here
  level: number; // No changes needed here
  xp: number; // No changes needed here
}

interface XPChartProps {
  habits: Habit[];
}

export default function XPChart({ habits }: XPChartProps) {
  const data = {
    labels: habits.map((h) => h.name),
    datasets: [
      {
        label: "XP Atual",
        data: habits.map((h) => h.xp),
        backgroundColor: "rgba(168, 85, 247, 0.7)", // Roxo
        borderColor: "rgba(192, 132, 252, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Progresso de Hábitos (XP)",
        color: "#e2e8f0",
      },
    },
    scales: {
      x: { ticks: { color: "#94a3b8" } },
      y: { ticks: { color: "#94a3b8" } },
    },
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
      <Bar data={data} options={options} />
    </div>
  );
}

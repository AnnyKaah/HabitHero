import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ScriptableContext,
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

const createGradient = (ctx: CanvasRenderingContext2D, isHighlight = false) => {
  const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
  if (isHighlight) {
    // Gradiente de destaque para a barra mais alta (Rosa -> Amarelo)
    gradient.addColorStop(0, "rgba(236, 72, 153, 0.8)");
    gradient.addColorStop(1, "rgba(250, 204, 21, 1)");
  } else {
    // Gradiente padrão (Roxo -> Ciano)
    gradient.addColorStop(0, "rgba(168, 85, 247, 0.6)");
    gradient.addColorStop(1, "rgba(56, 189, 248, 0.9)");
  }
  return gradient;
};

export default function XPChart({ habits }: XPChartProps) {
  const data = {
    labels: habits.map((h) => h.name),
    datasets: [
      {
        label: "XP Atual",
        data: habits.map((h) => h.xp),
        backgroundColor: (context: ScriptableContext<"bar">) => {
          const maxXP = Math.max(
            ...(context.chart.data.datasets[0].data as number[])
          );
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return;
          }
          const isMaxValue = context.raw === maxXP;
          return createGradient(ctx, isMaxValue);
        },
        borderColor: (context: ScriptableContext<"bar">) => {
          const maxXP = Math.max(
            ...(context.chart.data.datasets[0].data as number[])
          );
          return context.raw === maxXP
            ? "rgba(250, 204, 21, 1)"
            : "rgba(56, 189, 248, 1)";
        },
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: "y" as const, // Transforma em gráfico de barras horizontais
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Progresso de Hábitos (XP)",
        color: "#e2e8f0",
        font: {
          size: 18,
          family: "'Orbitron', sans-serif",
          weight: "bold",
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(14, 24, 41, 0.8)",
        titleColor: "#cbd5e1",
        bodyColor: "#94a3b8",
        borderColor: "#334155",
        borderWidth: 1,
        callbacks: {
          label: (context) => ` ${context.formattedValue} XP`,
        },
        titleFont: {
          family: "'Inter', sans-serif",
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: "rgba(51, 65, 85, 0.5)", // Cor da grade
        },
        border: {
          color: "rgba(51, 65, 85, 1)", // Cor da linha do eixo
        },
        ticks: { color: "#94a3b8", font: { family: "'Inter', sans-serif" } },
      },
      y: {
        grid: {
          display: false, // Remove as linhas de grade verticais
        },
        ticks: {
          color: "#cbd5e1",
          font: { weight: 600, family: "'Inter', sans-serif" },
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
      onProgress: (animation) => {
        const chart = animation.chart;
        chart.canvas.style.opacity = String(
          animation.currentStep / animation.numSteps
        );
      },
    },
  };

  return (
    <div className="bg-brand-slate/50 p-4 md:p-6 rounded-xl shadow-lg border border-brand-light-slate">
      <Bar data={data} options={options} />
    </div>
  );
}

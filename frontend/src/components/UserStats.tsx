import React, { useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  TooltipItem,
} from "chart.js";
import { Shield, Star } from "lucide-react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { habitCategories } from "../utils/habitCategories";
import * as Icons from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface User {
  level: number;
  totalXp: number;
}

// A interface Habit aqui é simplificada, mas o objeto real tem mais propriedades
interface Habit {
  xp: number;
  category: string;
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
  // Animação para o contador de XP Total
  const count = useMotionValue(0);
  const roundedXP = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, user.totalXp, {
      duration: 1.5,
      ease: "easeOut",
    });
    return controls.stop;
  }, [user.totalXp, count]);

  const chartData = {
    labels: categories.map((c) => c.title),
    datasets: [
      {
        label: "XP por Categoria",
        data: categories.map((c) => c.habits.reduce((sum, h) => sum + h.xp, 0)),
        backgroundColor: [
          "rgba(168, 85, 247, 0.7)", // Roxo
          "rgba(56, 189, 248, 0.7)", // Ciano
          "rgba(236, 72, 153, 0.7)", // Rosa
          "rgba(34, 197, 94, 0.7)", // Verde
          "rgba(250, 204, 21, 0.7)", // Amarelo
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
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1200,
    },
    plugins: {
      legend: { display: false }, // Desabilitamos a legenda padrão
      tooltip: {
        backgroundColor: "rgba(14, 24, 41, 0.8)",
        titleColor: "#cbd5e1",
        bodyColor: "#94a3b8",
        borderColor: "#334155",
        borderWidth: 1,
        callbacks: {
          label: (context: TooltipItem<"doughnut">) => {
            const total = context.dataset.data.reduce(
              (acc: number, val: number) => acc + val,
              0
            );
            const percentage =
              total > 0
                ? (((context.raw as number) / total) * 100).toFixed(1)
                : 0;
            return ` ${context.raw} XP (${percentage}%)`;
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div className="relative h-40 md:h-48">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Card de Nível Atual */}
          <motion.div
            className="bg-brand-dark/50 p-4 rounded-lg border border-brand-light-slate/50 flex flex-col items-center justify-center text-center"
            animate={{
              boxShadow: [
                "0 0 0px #38bdf8",
                "0 0 10px #38bdf8",
                "0 0 0px #38bdf8",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <Shield className="h-8 w-8 text-brand-cyan mb-2" />
            <p className="text-2xl font-bold text-slate-200">{user.level}</p>
            <p className="text-sm text-slate-400">Nível Atual</p>
          </motion.div>

          {/* Card de Total XP */}
          <div className="bg-brand-dark/50 p-4 rounded-lg border border-brand-light-slate/50 flex flex-col items-center justify-center text-center">
            <Star className="h-8 w-8 text-yellow-400 mb-2" />
            <motion.p className="text-2xl font-bold text-slate-200">
              {roundedXP}
            </motion.p>
            <p className="text-sm text-slate-400">Total XP</p>
          </div>
        </div>
      </div>
      {/* Legenda Customizada */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
        {categories.map((category) => {
          const categoryInfo = habitCategories.find(
            (c) => c.name === category.title
          );
          const Icon = (
            categoryInfo ? Icons[categoryInfo.icon] : Icons.Activity
          ) as React.ElementType;
          const totalXp = category.habits.reduce((sum, h) => sum + h.xp, 0);

          if (totalXp === 0) return null; // Não mostra categorias sem XP

          return (
            <div
              key={category.title}
              className="flex items-center gap-2 text-sm"
            >
              <Icon className="w-4 h-4 text-brand-cyan flex-shrink-0" />
              <span className="text-slate-300 truncate flex-1">
                {category.title}
              </span>
              <span className="font-mono text-slate-400">{totalXp} XP</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { Award, Star, Zap, Shield, Target } from "lucide-react";

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: React.ElementType;
  isSecret?: boolean;
}

export const achievementsData: Achievement[] = [
  {
    id: 1,
    name: "Pioneiro",
    description: "Crie seu primeiro hábito.",
    icon: Star,
  },
  {
    id: 2,
    name: "Iniciado",
    description: "Complete um hábito pela primeira vez.",
    icon: Award,
  },
  {
    id: 3,
    name: "Aprendiz",
    description: "Alcance o nível 5.",
    icon: Zap,
  },
  {
    id: 4,
    name: "Matador de Chefes",
    description: "Derrote a Procrastinação.",
    icon: Shield,
  },
  {
    id: 5,
    name: "Colecionador",
    description: "Tenha 5 hábitos ativos ao mesmo tempo.",
    icon: Target,
  },
];

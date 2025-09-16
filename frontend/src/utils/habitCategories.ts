import type * as Icons from "lucide-react";

export const habitCategories = [
  {
    id: "dev_pessoal",
    name: "Desenvolvimento Pessoal",
    icon: "Brain" as keyof typeof Icons,
  },
  {
    id: "saude_fitness",
    name: "Saúde & Fitness",
    icon: "HeartPulse" as keyof typeof Icons,
  },
  {
    id: "criatividade_hobbies",
    name: "Criatividade & Hobbies",
    icon: "Paintbrush" as keyof typeof Icons,
  },
  {
    id: "carreira_produtividade",
    name: "Carreira & Produtividade",
    icon: "Briefcase" as keyof typeof Icons,
  },
  {
    id: "bem_estar_mindfulness",
    name: "Bem-estar & Mindfulness",
    icon: "Smile" as keyof typeof Icons,
  },
  {
    id: "relacionamentos_social",
    name: "Relacionamentos & Social",
    icon: "Users" as keyof typeof Icons,
  },
  {
    id: "financas_organizacao",
    name: "Finanças & Organização",
    icon: "PiggyBank" as keyof typeof Icons,
  },
];

export type HabitCategoryId = (typeof habitCategories)[number]["id"];

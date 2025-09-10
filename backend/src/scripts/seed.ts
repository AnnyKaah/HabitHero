import sequelize from "../db.js";
import Achievement, { AchievementType } from "../models/Achievement.js";
import DailyQuest from "../models/DailyQuest.js";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import "../models/associations.js"; // Importante para carregar as associações dos modelos

const achievementsData = [
  {
    name: "Pioneiro",
    description: "Crie sua primeira missão!",
    icon: "Rocket",
    type: AchievementType.HABITS_CREATED,
    value: 1,
  },
  {
    name: "Iniciado",
    description: "Complete uma missão pela primeira vez!",
    icon: "Sparkles",
    type: AchievementType.COMPLETED_COUNT,
    value: 1,
  },
  {
    name: "Persistente",
    description: "Complete uma missão 10 vezes.",
    icon: "Repeat",
    type: AchievementType.COMPLETED_COUNT,
    value: 10,
  },
  {
    name: "Mestre do Foco",
    description: "Alcance o nível 5 em qualquer hábito.",
    icon: "BrainCircuit",
    type: AchievementType.LEVEL_REACHED,
    value: 5,
  },
];

const dailyQuestsData = [
  {
    id: 1,
    title: "Ler por 30 minutos",
    description: "Leia um capítulo de um livro de não-ficção.",
  },
  {
    id: 2,
    title: "Meditar por 10 minutos",
    description: "Use um app de meditação guiada.",
  },
  {
    id: 3,
    title: "Fazer 20 flexões",
    description: "Mantenha a forma correta para evitar lesões.",
  },
];

const seedDatabase = async () => {
  console.log("Iniciando o processo de seeding...");
  try {
    // CUIDADO: { force: true } irá apagar TODAS as tabelas e recriá-las.
    // Ótimo para desenvolvimento, mas perigoso em produção.
    await sequelize.sync({ force: true });
    console.log("Tabelas sincronizadas.");

    await Achievement.bulkCreate(achievementsData);
    console.log("Conquistas (Achievements) populadas com sucesso.");

    await DailyQuest.bulkCreate(dailyQuestsData);
    console.log("Missões Diárias (DailyQuests) populadas com sucesso.");

    // Opcional: Criar um usuário de teste para facilitar o desenvolvimento
    const hashedPassword = await bcrypt.hash("password123", 10);
    await User.create({
      username: "HeroUser",
      email: "admin@habithero.com", // Adicionando o email
      passwordHash: hashedPassword,
      role: "admin",
    });
    console.log("Usuário de teste criado.");

    console.log("✅ Seeding concluído com sucesso!");
  } catch (error) {
    console.error("❌ Erro durante o seeding:", error);
  } finally {
    await sequelize.close();
    console.log("Conexão com o banco de dados fechada.");
  }
};

seedDatabase();

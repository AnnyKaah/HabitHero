import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./db.js";
import habitRoutes from "./routes/habits.js";
import skillRoutes from "./routes/skills.js";
import achievementRoutes from "./routes/achievements.js";
import authRouter from "./routes/auth.js";
import adminQuestsRouter from "./routes/adminQuests.js";
import questsRouter from "./routes/quests.js";
import "./models/associations.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rota raiz para diagnóstico
app.get("/", (req, res) => {
  res.json({
    message: "Bem-vindo à API do HabitHero!",
    status: "online",
    timestamp: new Date().toISOString(),
    docs_path: "/api/habits",
  });
});

app.use("/api/habits", habitRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/auth", authRouter);
app.use("/api/admin/quests", adminQuestsRouter);
app.use("/api/quests", questsRouter);

const PORT = process.env.SERVER_PORT || 5000;

async function startServer() {
  try {
    // 1. Authenticate the database connection
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");

    // 2. Synchronize models with the database.
    // O { alter: true } é ótimo para desenvolvimento, pois ajusta as tabelas existentes.
    await sequelize.sync({ alter: true });
    console.log("🔄 Modelos sincronizados com o banco de dados.");

    // 3. Inicia o servidor Express apenas se a conexão com o DB for bem-sucedida
    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
  } catch (error) {
    console.error("❌ Falha ao iniciar o servidor:", error);
  }
}

startServer();

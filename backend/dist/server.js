import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./db.js";
import habitRoutes from "./routes/habits.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
// Testa conexão
sequelize
    .authenticate()
    .then(() => console.log("✅ PostgreSQL conectado!"))
    .catch((err) => console.error("❌ Erro no banco:", err));
sequelize.sync();
app.use("/api/habits", habitRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

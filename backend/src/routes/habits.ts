import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { habitController } from "../controllers/habitController.js";

const router = Router();

// Aplica o middleware de proteção a todas as rotas de hábitos
router.use(protect);

// GET /api/habits - Listar todos os hábitos DO USUÁRIO LOGADO
router.get("/", habitController.getAllHabits);

// POST /api/habits - Criar um novo hábito PARA O USUÁRIO LOGADO
router.post("/", habitController.createHabit);

// PATCH /api/habits/:id - Editar um hábito
router.patch("/:id", habitController.editHabit);

// PATCH /api/habits/:id/complete - Completar um hábito
router.patch("/:id/complete", habitController.completeHabit);

// DELETE /api/habits/:id - Deletar um hábito
router.delete("/:id", habitController.deleteHabit);

export default router;

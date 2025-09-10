import { Router, Request, Response } from "express";
import DailyQuest from "../models/DailyQuest.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = Router();

// GET /api/admin/quests - Listar todas as missões
router.get("/", protect, admin, async (req: Request, res: Response) => {
  try {
    const quests = await DailyQuest.findAll({ order: [["id", "ASC"]] });
    res.json(quests);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar missões." });
  }
});

// POST /api/admin/quests - Criar uma nova missão
router.post("/", protect, admin, async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Título e descrição são obrigatórios." });
    }
    const newQuest = await DailyQuest.create({ title, description });
    res.status(201).json(newQuest);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar missão." });
  }
});

// PUT /api/admin/quests/:id - Atualizar uma missão
router.put("/:id", protect, admin, async (req: Request, res: Response) => {
  try {
    const questId = parseInt(req.params.id, 10);
    const { title, description } = req.body;
    const quest = await DailyQuest.findByPk(questId);

    if (!quest) {
      return res.status(404).json({ message: "Missão não encontrada." });
    }

    quest.title = title || quest.title;
    quest.description = description || quest.description;
    await quest.save();

    res.json(quest);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar missão." });
  }
});

// DELETE /api/admin/quests/:id - Deletar uma missão
router.delete("/:id", protect, admin, async (req: Request, res: Response) => {
  try {
    const questId = parseInt(req.params.id, 10);
    const quest = await DailyQuest.findByPk(questId);

    if (!quest) {
      return res.status(404).json({ message: "Missão não encontrada." });
    }

    await quest.destroy();
    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar missão." });
  }
});

export default router;

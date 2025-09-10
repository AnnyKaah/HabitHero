import { Router, Request, Response } from "express";
import DailyQuest from "../models/DailyQuest.js";
import DailyQuestCompletion from "../models/DailyQuestCompletion.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// Protege todas as rotas de missões
router.use(protect);

// GET /api/quests/daily - Busca o estado das missões diárias do usuário
router.get("/daily", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const today = new Date().toISOString().split("T")[0];

    const allQuests = await DailyQuest.findAll();
    const completions = await DailyQuestCompletion.findAll({
      where: { userId, completionDate: today },
    });

    const completedQuestIds = new Set(completions.map((c) => c.questId));

    const questsWithStatus = allQuests.map((quest) => ({
      ...quest.toJSON(),
      completed: completedQuestIds.has(quest.id),
    }));

    res.json(questsWithStatus);
  } catch (error) {
    console.error("Erro ao buscar missões diárias:", error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

// POST /api/quests/daily/:questId/complete - Marca uma missão como concluída
router.post("/daily/:questId/complete", async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const questId = parseInt(req.params.questId, 10);
    const today = new Date().toISOString().split("T")[0];

    const user = req.user!;

    // 1. Marca a missão como concluída
    await DailyQuestCompletion.findOrCreate({
      where: { userId, questId, completionDate: today },
      defaults: { userId, questId, completionDate: today },
    });

    // 2. Adiciona XP ao usuário
    user.xp += 50;
    user.totalXp += 50;

    // 3. Lógica de Level Up
    if (user.xp >= user.xpToNextLevel) {
      user.level += 1;
      user.xp -= user.xpToNextLevel;
      user.xpToNextLevel = Math.floor(user.xpToNextLevel * 1.5);
    }

    await user.save();
    res.json({ user });
  } catch (error) {
    console.error("Erro ao completar missão diária:", error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

export default router;

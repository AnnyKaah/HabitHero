import { Router, Request, Response } from "express";
import Habit from "../models/Habit.js";
import HabitLog from "../models/HabitLog.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// Aplica o middleware de proteção a todas as rotas de hábitos
router.use(protect);

// GET /api/habits - Listar todos os hábitos DO USUÁRIO LOGADO
router.get("/", async (req: Request, res: Response) => {
  try {
    const habits = await Habit.findAll({
      where: { userId: req.user!.id },
      order: [["createdAt", "ASC"]],
    });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar hábitos." });
  }
});

// POST /api/habits - Criar um novo hábito PARA O USUÁRIO LOGADO
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, description, category, duration } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ message: "O nome do hábito é obrigatório." });
    }
    const newHabit = await Habit.create({
      name,
      description,
      category, // Adiciona a categoria ao criar
      duration,
      userId: req.user!.id, // Associa o hábito ao usuário logado
    });
    res.status(201).json(newHabit);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar hábito." });
  }
});

// PATCH /api/habits/:id/complete - Completar um hábito
router.patch("/:id/complete", async (req: Request, res: Response) => {
  try {
    const habitId = parseInt(req.params.id, 10);
    const { date } = req.body; // Agora recebemos a data
    const user = req.user!; // Usuário vem do middleware 'protect'
    const habit = await Habit.findByPk(habitId, { include: "logs" });

    if (!habit) {
      return res.status(404).json({ message: "Hábito não encontrado" });
    }

    // Encontra ou cria o log para o dia específico
    const [log, created] = await HabitLog.findOrCreate({
      where: { habitId: habit.id, date },
    });

    if (log.completed) {
      return res.status(400).json({ message: "Missão do dia já concluída." });
    }

    log.completed = true;
    await log.save();

    let xpGained = 10; // XP padrão por tarefa diária
    habit.xp += xpGained;
    user.xp += xpGained;
    user.totalXp += xpGained;

    // Verifica se a missão de múltiplos dias foi totalmente concluída
    const completedLogsCount =
      (await HabitLog.count({
        where: { habitId: habit.id, completed: true },
      })) || 0;

    let missionCompleted = false;
    let bonusXp = 0;
    if (completedLogsCount === habit.duration) {
      // Bônus de XP proporcional à duração da missão (ex: 15 XP por dia de duração)
      const BASE_BONUS_XP_PER_DAY = 15;
      bonusXp = habit.duration * BASE_BONUS_XP_PER_DAY;
      user.xp += bonusXp;
      user.totalXp += bonusXp;
      missionCompleted = true;
    }

    if (user.xp >= user.xpToNextLevel) {
      user.level += 1;
      user.xp -= user.xpToNextLevel;
      user.xpToNextLevel = Math.floor(user.xpToNextLevel * 1.5);
    }

    await habit.save();
    await user.save();

    // Recarrega o hábito com os logs atualizados para retornar ao frontend
    const updatedHabit = await Habit.findByPk(habitId, { include: "logs" });

    res.json({
      user,
      habit: updatedHabit,
      missionCompleted,
      bonusXp,
      xpGained,
    });
  } catch (error) {
    console.error("Erro ao completar hábito:", error);
    res.status(500).json({ message: "Erro ao completar hábito" });
  }
});

// DELETE /api/habits/:id - Deletar um hábito
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const habit = await Habit.findOne({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!habit) {
      return res
        .status(404)
        .json({ message: "Hábito não encontrado ou não pertence ao usuário." });
    }

    await habit.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar hábito." });
  }
});

export default router;

import { Router, Request, Response } from "express";
import Skill from "../models/Skill.js";
import User from "../models/User.js";

const router = Router();

// POST /api/skills/:id/unlock - Desbloquear uma habilidade para um usuário
router.post("/:id/unlock", async (req: Request, res: Response) => {
  // Em um app real, o userId viria de um token de autenticação (req.user.id)
  const userId = 1; // Usando um ID fixo para simulação
  const skillId = parseInt(req.params.id, 10);

  try {
    const user = await User.findByPk(userId);
    const skill = await Skill.findByPk(skillId);

    if (!user || !skill) {
      return res
        .status(404)
        .json({ message: "Usuário ou Habilidade não encontrado." });
    }

    if (user.totalXp < skill.cost) {
      return res
        .status(400)
        .json({ message: "XP insuficiente para desbloquear esta habilidade." });
    }

    // Debita o custo do XP do usuário
    user.totalXp -= skill.cost;
    await user.save();

    // Associa a habilidade ao usuário. O método addSkill é criado automaticamente pelo Sequelize.
    // @ts-ignore
    await user.addSkill(skill);

    res
      .status(200)
      .json({
        message: `Habilidade '${skill.name}' desbloqueada com sucesso!`,
        remainingXp: user.totalXp,
      });
  } catch (error) {
    console.error("Erro ao desbloquear habilidade:", error);
    res
      .status(500)
      .json({ message: "Erro interno ao desbloquear habilidade." });
  }
});

export default router;

// backend/src/controllers/habitController.ts

import { Request, Response } from "express";
import { HabitService } from "../services/HabitService.js";

export const habitController = {
  getAllHabits: async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const habits = await HabitService.getAllForUser(userId);
      return res.status(200).json(habits);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar hábitos." });
    }
  },

  createHabit: async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const newHabit = await HabitService.createForUser(userId, req.body);
      return res.status(201).json(newHabit);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro ao criar hábito." });
    }
  },

  editHabit: async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const habitId = parseInt(req.params.id, 10);
      if (isNaN(habitId)) {
        return res.status(400).json({ message: "ID do hábito inválido." });
      }
      const updatedHabit = await HabitService.edit(userId, habitId, req.body);
      return res.status(200).json(updatedHabit);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro interno no servidor." });
    }
  },

  completeHabit: async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const habitId = parseInt(req.params.id, 10);
      const { date } = req.body; // Espera uma data no formato ISO (ex: "2023-10-27T10:00:00.000Z")

      if (isNaN(habitId)) {
        return res.status(400).json({ message: "ID do hábito inválido." });
      }

      const result = await HabitService.complete(userId, habitId, date);
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        // O serviço pode lançar erros específicos que podemos tratar
        if (error.message.includes("concluído")) {
          return res.status(409).json({ message: error.message });
        }
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro interno no servidor." });
    }
  },

  deleteHabit: async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const habitId = parseInt(req.params.id, 10);
      await HabitService.delete(userId, habitId);
      return res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro ao deletar hábito." });
    }
  },
};

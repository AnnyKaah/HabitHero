import { Router } from "express";
import Habit from "../models/Habit.js";
const router = Router();
// GET todos hábitos
router.get("/", async (req, res) => {
    try {
        const habits = await Habit.findAll();
        res.json(habits);
    }
    catch (error) {
        res.status(500).json({ message: "Erro ao buscar hábitos", error });
    }
});
// POST criar hábito
router.post("/", async (req, res) => {
    try {
        const { name, description } = req.body;
        const newHabit = await Habit.create({ name, description });
        res.status(201).json(newHabit);
    }
    catch (error) {
        res.status(500).json({ message: "Erro ao criar hábito", error });
    }
});
// PATCH concluir hábito
router.patch("/:id/complete", async (req, res) => {
    try {
        const habit = await Habit.findByPk(req.params.id);
        if (!habit) {
            return res.status(404).json({ message: "Hábito não encontrado" });
        }
        habit.completedCount += 1;
        habit.xp += 10; // XP por hábito concluído
        if (habit.xp >= habit.level * 50) {
            habit.level += 1;
        }
        await habit.save(); // Salva as alterações na instância
        res.json(habit);
    }
    catch (error) {
        res.status(500).json({ message: "Erro ao completar hábito", error });
    }
});
export default router;

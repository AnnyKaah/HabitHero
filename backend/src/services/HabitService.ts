import Habit from "../models/Habit.js";
import HabitLog from "../models/HabitLog.js";
import User from "../models/User.js";
import sequelize from "../db.js";
import { Transaction } from "sequelize";

const xpForNextLevel = (level: number) => 50 + level * 25;

const XP_PER_COMPLETION = 10;
const XP_BONUS_MISSION = 50;

interface HabitCompletionResult {
  missionCompleted: boolean;
  xpGained: number;
  bonusXp: number;
}

type UserWithXp = User & { xp: number; level: number; totalXp: number };

export const HabitService = {
  async getAllForUser(userId: number) {
    return Habit.findAll({
      where: { userId },
      order: [["createdAt", "ASC"]],
    });
  },

  async createForUser(
    userId: number,
    data: {
      name: string;
      description: string;
      category: string;
      duration: number;
    }
  ) {
    if (!data.name) {
      throw new Error("O nome do hábito é obrigatório.");
    }
    return Habit.create({ ...data, userId });
  },

  async edit(
    userId: number,
    habitId: number,
    updates: {
      name?: string;
      description?: string;
      category?: string;
      duration?: number;
    }
  ) {
    const habit = await Habit.findOne({ where: { id: habitId, userId } });

    if (!habit) {
      throw new Error("Hábito não encontrado ou não pertence ao usuário.");
    }

    habit.name = updates.name ?? habit.name;
    habit.description = updates.description ?? habit.description;
    habit.category = updates.category ?? habit.category;
    habit.duration = updates.duration ?? habit.duration;

    return habit.save();
  },

  async delete(userId: number, habitId: number) {
    const habit = await Habit.findOne({ where: { id: habitId, userId } });

    if (!habit) {
      throw new Error("Hábito não encontrado ou não pertence ao usuário.");
    }

    await habit.destroy();
  },

  /**
   * Valida a data e garante que o hábito exista e pertença ao usuário.
   */
  async _validateAndFetchHabit(
    userId: number,
    habitId: number,
    date: string,
    transaction: Transaction
  ) {
    const completionDate = new Date(date);
    if (!date || isNaN(completionDate.getTime())) {
      throw new Error("Data de conclusão inválida fornecida.");
    }

    const habit = await Habit.findOne({
      where: { id: habitId, userId },
      transaction,
    });
    if (!habit) {
      throw new Error("Hábito não encontrado ou não pertence ao usuário.");
    }

    return {
      habit,
      dateOnlyString: completionDate.toISOString().split("T")[0],
    };
  },

  /**
   * Cria ou atualiza o log de conclusão do hábito para uma data específica.
   */
  async _logHabitCompletion(
    habitId: number,
    dateOnlyString: string,
    transaction: Transaction
  ) {
    const [log, created] = await HabitLog.findOrCreate({
      where: { habitId, date: dateOnlyString },
      defaults: { habitId, date: dateOnlyString, completed: false },
      transaction,
    });

    if (!created && log.completed) {
      throw new Error("Este hábito já foi concluído para esta data.");
    }

    log.completed = true;
    await log.save({ transaction });
  },

  /**
   * Atualiza o estado do hábito (contador, XP, nível, status) após a conclusão.
   */
  async _updateHabitState(
    habit: Habit,
    transaction: Transaction
  ): Promise<HabitCompletionResult> {
    let bonusXp = 0;
    let missionCompleted = false;

    habit.completedCount += 1;
    habit.xp += XP_PER_COMPLETION;

    if (habit.completedCount >= habit.duration) {
      missionCompleted = true;
      bonusXp = XP_BONUS_MISSION;
      habit.xp += bonusXp;
      habit.status = "completed";
    }

    const requiredXpForHabit = habit.level * 50;
    if (habit.xp >= requiredXpForHabit) {
      habit.level += 1;
      habit.xp -= requiredXpForHabit;
    }

    await habit.save({ transaction });
    return { missionCompleted, xpGained: XP_PER_COMPLETION, bonusXp };
  },

  /**
   * Atualiza o estado do usuário (XP, nível) com base nos ganhos.
   */
  async _updateUserState(
    user: UserWithXp,
    xpGained: number,
    bonusXp: number,
    transaction: Transaction
  ) {
    user.xp += xpGained + bonusXp;
    user.totalXp += xpGained + bonusXp;

    let requiredXpForUser = xpForNextLevel(user.level);
    while (user.xp >= requiredXpForUser) {
      user.level += 1;
      user.xp -= requiredXpForUser;
      requiredXpForUser = xpForNextLevel(user.level);
    }

    await user.save({ transaction });
  },

  async complete(userId: number, habitId: number, date: string) {
    return sequelize.transaction(async (t) => {
      const { habit, dateOnlyString } = await this._validateAndFetchHabit(
        userId,
        habitId,
        date,
        t
      );
      await this._logHabitCompletion(habit.id, dateOnlyString, t);

      const { missionCompleted, xpGained, bonusXp } =
        await this._updateHabitState(habit, t);

      const user = await User.findByPk(userId, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      if (!user) throw new Error("Usuário não encontrado durante a transação.");

      await this._updateUserState(user as UserWithXp, xpGained, bonusXp, t);

      return {
        message: "Hábito concluído com sucesso!",
        habit,
        user,
        missionCompleted,
        xpGained,
        bonusXp,
      };
    });
  },
};

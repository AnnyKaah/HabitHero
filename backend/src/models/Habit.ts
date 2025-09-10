import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "../db.js";
import User from "./User.js";
import HabitLog from "./HabitLog.js";

class Habit extends Model<
  InferAttributes<Habit>,
  InferCreationAttributes<Habit>
> {
  declare id: CreationOptional<number>;
  declare userId: number; // Chave estrangeira para User
  declare duration: CreationOptional<number>; // Duração em dias
  declare name: string;
  declare description: string | null;
  declare level: CreationOptional<number>;
  declare xp: CreationOptional<number>;
  declare completedCount: CreationOptional<number>;
  declare category: string;
  declare type: CreationOptional<"binary" | "fractional">;
  declare dailyGoal: CreationOptional<number>;
  declare dailyProgress: CreationOptional<number>;
  declare unit: CreationOptional<string | null>;
}

Habit.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // Default to 1 day (simple habit)
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "dev_pessoal", // Categoria padrão
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    xp: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    completedCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("binary", "fractional"),
      defaultValue: "binary",
      allowNull: false,
    },
    dailyGoal: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    dailyProgress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Habit",
  }
);

export default Habit;

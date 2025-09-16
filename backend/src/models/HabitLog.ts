import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "../db.js";
import Habit from "./Habit.js";

class HabitLog extends Model<
  InferAttributes<HabitLog>,
  InferCreationAttributes<HabitLog>
> {
  declare id: CreationOptional<number>;
  declare habitId: number;
  declare date: string;
  declare completed: CreationOptional<boolean>;
}

HabitLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    habitId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Habit, key: "id" },
    },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    completed: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { sequelize, modelName: "HabitLog" }
);

export default HabitLog;

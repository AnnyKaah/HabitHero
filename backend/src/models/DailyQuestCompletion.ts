import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import sequelize from "../db.js";
import User from "./User.js";
import DailyQuest from "./DailyQuest.js";

class DailyQuestCompletion extends Model<
  InferAttributes<DailyQuestCompletion>,
  InferCreationAttributes<DailyQuestCompletion>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
  declare questId: number;
  declare completionDate: string;
}

DailyQuestCompletion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    questId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: DailyQuest, key: "id" },
    },
    completionDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "DailyQuestCompletion",
  }
);

export default DailyQuestCompletion;

import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from "sequelize";
import sequelize from "../db.js";

class DailyQuest extends Model<
  InferAttributes<DailyQuest>,
  InferCreationAttributes<DailyQuest>
> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare description: string;
}

DailyQuest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "DailyQuest",
    timestamps: false,
  }
);

export default DailyQuest;

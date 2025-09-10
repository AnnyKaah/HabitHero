import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "../db.js";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare username: string;
  declare email: string;
  declare passwordHash: string;
  declare level: CreationOptional<number>;
  declare xp: CreationOptional<number>;
  declare xpToNextLevel: CreationOptional<number>;
  declare totalXp: CreationOptional<number>;
  declare unlockedAchievementIds: CreationOptional<number[]>;
  declare avatarId: CreationOptional<string>;
  declare role: CreationOptional<"user" | "admin">;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    level: { type: DataTypes.INTEGER, defaultValue: 1 },
    xp: { type: DataTypes.INTEGER, defaultValue: 0 },
    xpToNextLevel: { type: DataTypes.INTEGER, defaultValue: 100 },
    totalXp: { type: DataTypes.INTEGER, defaultValue: 0 },
    unlockedAchievementIds: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    avatarId: {
      type: DataTypes.STRING,
      defaultValue: "avatar1",
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

export default User;

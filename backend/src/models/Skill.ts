import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "../db.js";

export enum SkillType {
  TECHNIQUE = "Técnica",
  TEMPLATE = "Template",
  WORKOUT = "Rotina de Treino",
}

class Skill extends Model<
  InferAttributes<Skill>,
  InferCreationAttributes<Skill>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string;
  declare cost: number; // Custo em XP
  declare type: SkillType;
  declare content: string; // Conteúdo em Markdown ou um link
}

Skill.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.STRING, allowNull: false },
    cost: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 100 },
    type: {
      type: DataTypes.ENUM(...Object.values(SkillType)),
      allowNull: false,
    },
    content: { type: DataTypes.TEXT, allowNull: false },
  },
  { sequelize, modelName: "Skill" }
);

export default Skill;
